// controllers/certificateController.js
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const { generateCertificate } = require('../utils/certificateGenerator');

// Get certificate info
exports.getCertificate = async (req, res) => {
  try {
    // Check if user has completed the quiz
    if (!req.user.quizCompleted) {
      return res.status(403).json({ message: 'Quiz completion required for certificate' });
    }
    
    const quizResult = await QuizResult.findOne({ userId: req.user._id });
    
    if (!quizResult) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({
      success: true,
      certificate: {
        userName: req.user.name,
        score: quizResult.score,
        certificateId: quizResult.certificateId,
        completedAt: quizResult.completedAt
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to get certificate'
    });
  }
};

// Download certificate as PDF
exports.downloadCertificate = async (req, res) => {
  try {
    // Check if user has completed the quiz
    if (!req.user.quizCompleted) {
      return res.status(403).json({ message: 'Quiz completion required for certificate' });
    }
    
    const quizResult = await QuizResult.findOne({ userId: req.user._id });
    
    if (!quizResult) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Generate certificate PDF using the utility function
    generateCertificate({
      userName: req.user.name,
      score: quizResult.score,
      certificateId: quizResult.certificateId,
      completedAt: quizResult.completedAt
    }, res);
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to generate certificate'
    });
  }
};