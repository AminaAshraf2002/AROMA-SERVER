// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); // Import the proper middleware

// Google authentication
router.post('/google', (req, res) => {
  return authController.googleAuth(req, res);
});

// Complete profile (add country code)
router.post('/complete-profile', auth, (req, res) => {
  return authController.completeProfile(req, res);
});

module.exports = router;