// models/QuizResult.js
const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    type: [Number],  // Array of selected answer indices
    default: []      // Default to empty array
  },
  score: {
    type: Number,
    required: true,
    default: 0       // Default score to 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0       // Default correct answers to 0
  },
  totalQuestions: {
    type: Number,
    default: 50
  },
  certificateId: {
    type: String,
    sparse: true // Only index documents that have this field
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'expired'],
    default: 'in-progress'
  },
  passed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // Time spent in seconds
    default: 0
  },
  userName: {
    type: String, // Store user's name at time of quiz completion for certificate
    required: true
  }
});

// Create index for more efficient queries
QuizResultSchema.index({ userId: 1, status: 1 });
QuizResultSchema.index({ certificateId: 1 }, { unique: true, sparse: true });

// Method to calculate if user passed (could be used when saving)
QuizResultSchema.methods.calculatePassed = function() {
  return this.score >= 70; // Pass threshold is 70%
};

// Method to generate certificate ID
QuizResultSchema.methods.generateCertificateId = function() {
  if (this.passed) {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    return `ARC-${randomId}-L1`;
  }
  return null;
};

// Pre-save middleware to set passed status and certificateId
QuizResultSchema.pre('save', function(next) {
  // If the quiz is being marked as completed
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
    this.passed = this.calculatePassed();
    
    // Generate certificate ID only for passing scores
    if (this.passed && !this.certificateId) {
      this.certificateId = this.generateCertificateId();
    }
    
    // Calculate time spent
    if (this.startedAt && this.completedAt) {
      this.timeSpent = Math.floor((this.completedAt - this.startedAt) / 1000);
    }
  }
  next();
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);