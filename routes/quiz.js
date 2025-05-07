// routes/quiz.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// Get quiz questions
router.get('/', auth, quizController.getQuizQuestions);

// Submit quiz answers
router.post('/submit', auth, quizController.submitQuiz);

module.exports = router;