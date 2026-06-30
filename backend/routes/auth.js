const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Property = require('../models/Property');
const Notification = require('../models/Notification'); // <-- ADD THIS
const { sendOTP, verifyOTP } = require('../config/verify');
const { sendVerificationEmail, sendWelcomeEmail } = require('../config/email');
const { notifyNewUser } = require('../services/notificationService');

// ===== GENERATE VERIFICATION TOKEN =====
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// ===== CHECK IF USER IS BLOCKED OR FLAGGED =====
const checkUserStatus = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return next();
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: `Your account has been blocked. Reason: ${user.blockedReason || 'Violation of terms'}`,
        blockedReason: user.blockedReason
      });
    }

    if (user.isFlagged) {
      return res.status(403).json({
        success: false,
        isFlagged: true,
        message: 'Your account has been flagged for suspicious activity. Please contact support.',
        flags: user.flags
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ User status check error:', error);
    next();
  }
};

// ===== CAN ADD PROPERTY CHECK =====
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

// ============================================================
// ===== USER NOTIFICATIONS =====
// ============================================================

// ===== GET USER NOTIFICATIONS =====
router.get('/notifications', checkUserStatus, async (req, res) => {
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

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`📨 Found ${notifications.length} notifications for user ${user.email}`);
    res.json(notifications);
  } catch (error) {
    console.error('❌ Get user notifications error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== MARK USER NOTIFICATION AS READ =====
router.patch('/notifications/:id/read', checkUserStatus, async (req, res) => {
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

    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, userId: user._id });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    console.log(`✅ Notification ${id} marked as read for user ${user.email}`);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('❌ Mark notification read error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== MARK ALL USER NOTIFICATIONS AS READ =====
router.patch('/notifications/read-all', checkUserStatus, async (req, res) => {
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

    const result = await Notification.updateMany(
      { userId: user._id, read: false },
      { read: true }
    );

    console.log(`✅ Marked ${result.modifiedCount} notifications as read for user ${user.email}`);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('❌ Mark all notifications read error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== SIGN UP WITH EMAIL VERIFICATION =====
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, agency } = req.body;
    console.log('📝 Signup attempt for:', email);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      agency: agency || '',
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry,
      phoneVerified: false,
      isBlocked: false,
      isFlagged: false,
      flags: 0,
      favorites: []
    });

    await user.save();
    console.log('✅ User created successfully:', email);

    await notifyNewUser(user);

    try {
      await sendVerificationEmail(email, verificationToken, name);
      console.log('📧 Verification email sent via SendGrid');
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email for verification link.',
      requiresVerification: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== VERIFY EMAIL =====
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    console.log('🔍 Verifying email with token:', token);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired verification token' 
      });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log('📧 Welcome email sent via SendGrid');
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
    }

    console.log('✅ Email verified for:', user.email);

    res.json({
      success: true,
      message: 'Email verified successfully! Please login to continue.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== RESEND VERIFICATION EMAIL =====
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = generateVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, verificationToken, user.name);

    res.json({ 
      success: true,
      message: 'Verification email sent successfully!' 
    });
  } catch (error) {
    console.error('❌ Resend verification error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== SIGN IN WITH BLOCK/FLAG CHECK =====
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔍 Login attempt:', email);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      console.log('🚫 User is blocked:', email);
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: `Your account has been blocked. Reason: ${user.blockedReason || 'Violation of terms'}`,
        blockedReason: user.blockedReason
      });
    }

    if (user.isFlagged) {
      console.log('🚩 User is flagged:', email);
      return res.status(403).json({
        success: false,
        isFlagged: true,
        message: 'Your account has been flagged for suspicious activity. Please contact support.',
        flags: user.flags
      });
    }

    if (!user.emailVerified) {
      console.log('❌ Email not verified:', email);
      return res.status(403).json({ 
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
        email: user.email
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        agency: user.agency,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        isBlocked: user.isBlocked,
        isFlagged: user.isFlagged,
        favorites: user.favorites || []
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== SEND OTP =====
router.post('/send-otp', checkUserStatus, async (req, res) => {
  try {
    const { phone } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await sendOTP(phone);
    if (result.success) {
      user.phoneOTP = result.sid;
      user.phoneOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      res.json({ success: true, message: 'OTP sent successfully' });
    } else {
      res.status(400).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== VERIFY OTP =====
router.post('/verify-otp', checkUserStatus, async (req, res) => {
  try {
    const { phone, code } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await verifyOTP(phone, code);
    if (result.success) {
      user.phoneVerified = true;
      user.phoneOTP = undefined;
      user.phoneOTPExpiry = undefined;
      await user.save();
      res.json({ success: true, message: 'Phone verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== GET CURRENT USER =====
router.get('/me', checkUserStatus, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      agency: user.agency,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      isBlocked: user.isBlocked,
      isFlagged: user.isFlagged,
      favorites: user.favorites || []
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ===== GET USER BY ID =====
router.get('/users/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { id } = req.params;
    const user = await User.findById(id).select('-password -verificationToken -phoneOTP');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== LOGOUT =====
router.post('/logout', checkUserStatus, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ===== UPDATE FAVORITES =====
router.post('/favorites', checkUserStatus, async (req, res) => {
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

    const { propertyId, action } = req.body;
    
    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    if (action === 'add') {
      if (!user.favorites.includes(propertyId)) {
        user.favorites.push(propertyId);
        await user.save();
        console.log(`✅ Added ${propertyId} to favorites for ${user.email}`);
      } else {
        console.log(`⚠️ Property ${propertyId} already in favorites for ${user.email}`);
      }
    } else if (action === 'remove') {
      user.favorites = user.favorites.filter(id => id !== propertyId);
      await user.save();
      console.log(`✅ Removed ${propertyId} from favorites for ${user.email}`);
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "add" or "remove"' });
    }

    res.json({ 
      success: true, 
      message: `Property ${action}ed to favorites`,
      favorites: user.favorites 
    });
  } catch (error) {
    console.error('❌ Favorites error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== GET USER FAVORITES =====
router.get('/favorites', checkUserStatus, async (req, res) => {
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

    console.log(`📂 Fetching favorites for ${user.email}:`, user.favorites);
    
    if (!user.favorites || user.favorites.length === 0) {
      return res.json([]);
    }
    
    const favoriteProperties = [];
    for (const favId of user.favorites) {
      try {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(String(favId));
        if (!isValidObjectId) {
          console.log(`⚠️ Skipping invalid ID format: ${favId}`);
          continue;
        }
        
        const property = await Property.findOne({ 
          _id: favId,
          status: 'approved'
        });
        if (property) {
          favoriteProperties.push(property);
        } else {
          console.log(`⚠️ Property ${favId} not found or not approved`);
        }
      } catch (err) {
        console.error(`Error fetching property ${favId}:`, err.message);
      }
    }
    
    console.log(`✅ Returning ${favoriteProperties.length} favorite properties`);
    res.json(favoriteProperties);
  } catch (error) {
    console.error('❌ Get favorites error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;