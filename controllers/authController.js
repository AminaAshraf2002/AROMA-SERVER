const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

// Create OAuth client without requiring audience verification
const client = new OAuth2Client();

// Debug info
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);

// Google authentication
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Debug token
    console.log('Token received:', token ? token.substring(0, 10) + '...' : 'None');
    
    // Validate input
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }
    
    // Verify Google token without specifying audience
    const ticket = await client.verifyIdToken({
      idToken: token
      // No audience specified to allow more flexible verification
    });
    
    const { 
      name, 
      email, 
      sub: googleId, 
      picture: profilePicture 
    } = ticket.getPayload();
    
    console.log('Google Auth Payload:', { name, email, googleId: googleId?.substring(0, 5) + '...' });
    
    // Validate payload
    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google authentication'
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { googleId },
        { email }
      ]
    });
    
    let isFirstTimeUser = false;
    
    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        profilePicture
      });
      
      await user.save();
      isFirstTimeUser = true;
      console.log('New user created:', user._id);
    } else if (!user.googleId) {
      // Update existing user with Google ID if not already set
      user.googleId = googleId;
      user.profilePicture = profilePicture;
      await user.save();
      console.log('Existing user updated with Google ID:', user._id);
    } else {
      console.log('Existing user found:', user._id);
    }
    
    // Generate JWT token
    const authToken = jwt.sign(
      { 
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d'
      }
    );
    
    res.json({
      success: true,
      token: authToken,
      isFirstTimeUser: !user.countryCode,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        countryCode: user.countryCode,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    
    // Differentiate between different types of errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Google token has expired'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Complete profile (add country code)
exports.completeProfile = async (req, res) => {
  try {
    const { countryCode } = req.body;
    
    // Validate input
    if (!countryCode) {
      return res.status(400).json({
        success: false,
        message: 'Country code is required'
      });
    }
    
    // Validate country code format (optional)
    const countryCodeRegex = /^[A-Z]{2}$/;
    if (!countryCodeRegex.test(countryCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid country code format'
      });
    }
    
    // Update user with country code
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { 
        countryCode,
        profileCompleted: true 
      },
      { 
        new: true,
        runValidators: true 
      }
    );
    
    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        countryCode: updatedUser.countryCode,
        profileCompleted: updatedUser.profileCompleted
      }
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};