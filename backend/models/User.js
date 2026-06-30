const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'user' 
  },
  phone: { 
    type: String 
  },
  agency: { 
    type: String 
  },
  emailVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { 
    type: String 
  },
  verificationTokenExpiry: { 
    type: Date 
  },
  phoneVerified: { 
    type: Boolean, 
    default: false 
  },
  phoneOTP: { 
    type: String 
  },
  phoneOTPExpiry: { 
    type: Date 
  },
  trustScore: { 
    type: Number, 
    default: 0 
  },
  totalListings: { 
    type: Number, 
    default: 0 
  },
  completedDeals: { 
    type: Number, 
    default: 0 
  },
  isVerifiedAgent: { 
    type: Boolean, 
    default: false 
  },
  flags: { 
    type: Number, 
    default: 0 
  },
  isFlagged: { 
    type: Boolean, 
    default: false 
  },
  flagReason: { 
    type: String 
  },
  flaggedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  flaggedAt: { 
    type: Date 
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
  blockedReason: { 
    type: String 
  },
  blockedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  blockedAt: { 
    type: Date 
  },
  
  // ===== SOFT DELETE FIELDS =====
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedReason: { type: String },
  
  favorites: { 
    type: [String], 
    default: [] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Calculate trust score
userSchema.methods.calculateTrustScore = function() {
  let score = 0;
  if (this.emailVerified) score += 15;
  if (this.phoneVerified) score += 15;
  if (this.isVerifiedAgent) score += 20;
  if (this.completedDeals > 0) score += Math.min(this.completedDeals * 3, 30);
  if (this.totalListings > 5) score += 10;
  score -= this.flags * 5;
  if (this.isBlocked) score = 0;
  if (this.isFlagged) score = Math.max(0, score - 20);
  if (this.isDeleted) score = 0;
  this.trustScore = Math.max(0, Math.min(100, score));
  return this.trustScore;
};

module.exports = mongoose.model('User', userSchema);