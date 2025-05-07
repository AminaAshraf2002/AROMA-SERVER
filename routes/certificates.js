// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// Quiz routes
router.get('/questions', auth, quizController.getQuizQuestions);
router.post('/submit', auth, quizController.submitQuiz);

// Certificate routes
router.get('/certificate/:certificateId', auth, quizController.getCertificate);
router.get('/certificate/:certificateId/download', auth, quizController.downloadCertificate);

module.exports = router;