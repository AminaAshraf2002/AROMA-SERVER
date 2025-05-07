// utils/certificateGenerator.js
const PDFDocument = require('pdfkit');

/**
 * Generates a certificate PDF
 * @param {Object} data - Certificate data
 * @param {string} data.userName - User's name
 * @param {number} data.score - Score percentage
 * @param {string} data.certificateId - Unique certificate ID
 * @param {Date} data.completedAt - Date when quiz was completed
 * @param {Object} res - Express response object to pipe PDF to
 */
const generateCertificate = (data, res) => {
  // Create PDF document
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4'
  });
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificate-${data.certificateId}.pdf`);
  
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
  doc.fontSize(25).text(data.userName, { align: 'center' });
  doc.moveDown();
  doc.fontSize(15).text('has successfully completed', { align: 'center' });
  doc.moveDown();
  doc.fontSize(20).text('Level 1: Fundamentals of Aroma Research', { align: 'center' });
  doc.moveDown();
  doc.fontSize(15).text('with a score of', { align: 'center' });
  doc.moveDown();
  doc.fontSize(25).text(`${data.score}%`, { align: 'center' });
  doc.moveDown(2);
  
  // Add date
  const date = new Date(data.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.fontSize(12).text(date, { align: 'center' });
  
  // Add signatures
  doc.fontSize(14);
  doc.text('Dr. Sarah Johnson', 200, 500, { align: 'center' });
  doc.fontSize(12);
  doc.text('Director, Aroma Research Centre', 200, 520, { align: 'center' });
  
  doc.fontSize(14);
  doc.text('Prof. Michael Lee', 600, 500, { align: 'center' });
  doc.fontSize(12);
  doc.text('Chief Academic Officer', 600, 520, { align: 'center' });
  
  // Add certificate ID
  doc.moveDown(2);
  doc.fontSize(10).text(`Certificate ID: ${data.certificateId}`, { align: 'center' });
  
  // Finalize PDF
  doc.end();
};

module.exports = { generateCertificate };