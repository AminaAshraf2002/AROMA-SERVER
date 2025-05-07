const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Initialize Razorpay with better error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('Razorpay initialized successfully with key_id:', process.env.RAZORPAY_KEY_ID);
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error('Razorpay not initialized');
      return res.status(500).json({
        success: false,
        message: 'Payment service unavailable'
      });
    }
    
    const { amount, currency = 'INR', paymentMethod } = req.body;
    
    console.log('Creating order with params:', { amount, currency, paymentMethod });
    console.log('Razorpay credentials present:', {
      key_id: !!process.env.RAZORPAY_KEY_ID,
      key_secret: !!process.env.RAZORPAY_KEY_SECRET
    });
    
    // Check if user is present in request
    if (!req.user || !req.user._id) {
      console.error('User not found in request:', req.user);
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    console.log('User ID:', req.user._id);
    
    // Validate amount
    if (!amount || amount < 1) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    // Create Razorpay order options with FIXED receipt field (shorter format)
    const options = {
      amount: Math.round(amount * 100), // Amount in smallest currency unit (paisa for INR)
      currency,
      receipt: `rcpt_${Math.random().toString(36).substring(2, 10)}`, // Fixed shorter receipt ID
      notes: {
        userId: req.user._id.toString(),
        email: req.user.email || 'not-provided',
        paymentMethod
      }
    };
    
    console.log('Order options:', options);
    
    try {
      // Create order in Razorpay
      const order = await razorpay.orders.create(options);
      console.log('Order created successfully:', order.id);
      
      // Create a pending payment record in database
      const payment = new Payment({
        userId: req.user._id,
        amount,
        paymentMethod,
        status: 'pending',
        transactionId: order.id
      });
      
      await payment.save();
      console.log('Payment record created:', payment._id);
      
      // Send successful response
      res.json({
        success: true,
        order,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (razorpayError) {
      console.error('Razorpay API Error:', razorpayError);
      return res.status(400).json({
        success: false,
        message: 'Failed to create Razorpay order',
        error: razorpayError.message
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    console.log('Verifying payment:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature ? 'Present' : 'Missing'
    });
    
    // Check if all required parameters are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing required payment verification parameters');
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters'
      });
    }
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log('Signature verification:', isAuthentic ? 'Successful' : 'Failed');
    
    if (isAuthentic) {
      // Find payment record
      const payment = await Payment.findOne({ transactionId: razorpay_order_id });
      
      if (!payment) {
        console.error('Payment record not found for order ID:', razorpay_order_id);
        return res.status(404).json({
          success: false,
          message: 'Payment record not found'
        });
      }
      
      // Update payment record
      payment.status = 'completed';
      payment.transactionId = razorpay_payment_id;
      await payment.save();
      console.log('Payment record updated:', payment._id);
      
      // Update user payment status
      const updated = await User.findByIdAndUpdate(req.user._id, { hasPaid: true });
      console.log('User payment status updated:', updated ? 'Yes' : 'No');
      
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      console.error('Signature verification failed');
      res.status(400).json({
        success: false,
        message: 'Payment verification failed - invalid signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(400).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Process direct payment (for card and UPI options)
exports.processPayment = async (req, res) => {
  try {
    const { paymentMethod, amount } = req.body;
    
    console.log('Processing direct payment:', { amount, paymentMethod });
    
    // Check if user is present
    if (!req.user || !req.user._id) {
      console.error('User not found in request:', req.user);
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Validate amount
    if (!amount || amount < 1) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId: 'tx_' + Math.random().toString(36).substring(2)
    });
    
    await payment.save();
    console.log('Direct payment record created:', payment._id);
    
    // Update user payment status
    const updated = await User.findByIdAndUpdate(req.user._id, { hasPaid: true });
    console.log('User payment status updated:', updated ? 'Yes' : 'No');
    
    res.json({
      success: true,
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(400).json({
      success: false,
      message: 'Payment processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get payment status
exports.getPayment = async (req, res) => {
  try {
    // Check if payment ID is provided
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }
    
    // Find payment by ID
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      console.log('Payment not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Check if the payment belongs to the requesting user
    if (payment.userId.toString() !== req.user._id.toString()) {
      console.error('Unauthorized payment access attempt');
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to payment'
      });
    }
    
    console.log('Payment found:', payment._id);
    
    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to get payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all payments for current user
exports.getUserPayments = async (req, res) => {
  try {
    // Check if user is present
    if (!req.user || !req.user._id) {
      console.error('User not found in request:', req.user);
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Find all payments for the user
    const payments = await Payment.find({ userId: req.user._id }).sort({ paymentDate: -1 });
    
    console.log('User payments found:', payments.length);
    
    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to get user payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};