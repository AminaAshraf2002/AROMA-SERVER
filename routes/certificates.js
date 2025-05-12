// routes/certificates.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// Get certificate by ID
router.get('/:certificateId', auth, quizController.getCertificate);

// Download certificate by ID
router.get('/:certificateId/download', auth, quizController.downloadCertificate);

module.exports = router;
