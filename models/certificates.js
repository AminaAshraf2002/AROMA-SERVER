// routes/certificates.js
const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// Get certificate info
router.get('/', auth, async (req, res) => {
  try {
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
});

// Download certificate as PDF
router.get('/download', auth, async (req, res) => {
  try {
    const quizResult = await QuizResult.findOne({ userId: req.user._id });
    
    if (!quizResult) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Create PDF
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${quizResult.certificateId}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add green border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#6ec007');
    
    // Add content to the PDF
    doc.fontSize(30).text('CERTIFICATE OF COMPLETION', { align: 'center' });
    doc.moveDown();
    doc.fontSize(15).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(25).text(req.user.name, { align: 'center' });
    doc.moveDown();
    doc.fontSize(15).text('has successfully completed', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('Level 1: Fundamentals of Aroma Research', { align: 'center' });
    doc.moveDown();
    doc.fontSize(15).text('with a score of', { align: 'center' });
    doc.moveDown();
    doc.fontSize(25).text(`${quizResult.score}%`, { align: 'center' });
    doc.moveDown(2);
    
    // Add date
    const date = new Date(quizResult.completedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.fontSize(12).text(date, { align: 'center' });
    
    // Add certificate ID
    doc.moveDown();
    doc.fontSize(10).text(`Certificate ID: ${quizResult.certificateId}`, { align: 'center' });
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to generate certificate'
    });
  }
});

module.exports = router;