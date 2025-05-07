// routes/payments.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Create Razorpay order
router.post('/create-order', auth, paymentController.createOrder);

// Verify Razorpay payment
router.post('/verify', auth, paymentController.verifyPayment);

// Process direct payment (card, UPI)
router.post('/', auth, paymentController.processPayment);

// Get specific payment
router.get('/:id', auth, paymentController.getPayment);

// Get all user payments
router.get('/', auth, paymentController.getUserPayments);

module.exports = router;