const express = require('express');
const router = express.Router();
const cors = require('cors');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); 

// Use the same CORS options as in your main file
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'https://aroma-swart.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Handle preflight request for specific auth routes
router.options('/google', cors(corsOptions));

// Google authentication with CORS enabled
router.post('/google', cors(corsOptions), (req, res) => {
  return authController.googleAuth(req, res);
});

// Complete profile (add country code)
router.post('/complete-profile', auth, (req, res) => {
  return authController.completeProfile(req, res);
});

module.exports = router;