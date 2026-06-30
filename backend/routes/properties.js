// backend/routes/properties.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');
const User = require('../models/User');
const { notifyNewProperty } = require('../services/notificationService');

// ===== CHECK IF USER CAN ADD PROPERTY =====
const canAddProperty = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: `Your account has been blocked. Reason: ${user.blockedReason || 'Violation of terms'}`
      });
    }

    if (user.isFlagged) {
      return res.status(403).json({
        success: false,
        isFlagged: true,
        message: 'Your account has been flagged. You cannot add properties. Please contact support.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Can add property check error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ===== GET ALL PROPERTIES - PUBLIC =====
router.get('/', async (req, res) => {
  try {
    // Show all approved properties (ignore blocked status)
    const properties = await Property.find({ status: 'approved' });
    console.log(`📊 Returning ${properties.length} approved properties`);
    res.json(properties);
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== GET SINGLE PROPERTY - PUBLIC =====
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching property with ID: ${id}`);
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid property ID format' });
    }
    
    const property = await Property.findOne({ 
      _id: id, 
      status: 'approved'
    });
    
    if (!property) {
      console.log(`❌ Property not found or not approved: ${id}`);
      return res.status(404).json({ message: 'Property not found' });
    }
    
    console.log(`✅ Property found: ${property.title}`);
    res.json(property);
  } catch (error) {
    console.error('❌ Error fetching property:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== CREATE PROPERTY - RESTRICTED =====
router.post('/', canAddProperty, async (req, res) => {
  try {
    console.log('📝 Creating new property listing...');
    
    const userId = req.user ? req.user._id : null;
    
    const propertyData = {
      ...req.body,
      status: 'pending',
      verified: false,
      isBlocked: false,
      createdAt: new Date()
    };
    
    if (userId) {
      propertyData.agent = {
        ...propertyData.agent,
        _id: userId
      };
    }
    
    const property = new Property(propertyData);
    const savedProperty = await property.save();
    
    console.log(`✅ Property created: ${savedProperty.title} (ID: ${savedProperty._id}) - STATUS: ${savedProperty.status}`);
    
    await notifyNewProperty(savedProperty);
    
    res.status(201).json({
      success: true,
      message: 'Property submitted for admin approval! It will appear on the website once approved.',
      property: savedProperty
    });
  } catch (error) {
    console.error('❌ Error creating property:', error);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors 
    });
  }
});

module.exports = router;