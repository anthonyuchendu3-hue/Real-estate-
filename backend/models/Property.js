const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyType: { type: String, required: true },
  listingType: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  toilets: { type: Number, default: 0 },
  sqft: { type: Number, default: 0 },
  yearBuilt: { type: Number, default: 0 },
  furnished: { type: String, default: 'unfurnished' },
  amenities: [{ type: String }],
  images: [{ type: String }],
  virtualTour: { type: String, default: '' },
  
  agent: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    agency: { type: String, required: true }
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'flagged', 'blocked'], 
    default: 'pending' 
  },
  adminNotes: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectedReason: { type: String },
  
  // ===== SOFT DELETE FIELDS =====
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedReason: { type: String },
  
  isBlocked: { type: Boolean, default: false },
  blockedReason: { type: String },
  blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blockedAt: { type: Date },
  
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);