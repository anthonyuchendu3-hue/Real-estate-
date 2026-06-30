const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { 
  notifyNewProperty, 
  notifyPropertyApproved, 
  notifyPropertyRejected,
  notifyNewUser,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} = require('../services/notificationService');

// ===== MIDDLEWARE: Check if user is admin =====
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Admin middleware error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ============================================================
// ===== ADMIN NOTIFICATIONS =====
// ============================================================
router.get('/notifications', isAdmin, async (req, res) => {
  try {
    const notifications = await getNotifications(req.user._id);
    res.json(notifications);
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/notifications/unread-count', isAdmin, async (req, res) => {
  try {
    const count = await getUnreadCount(req.user._id);
    res.json({ count });
  } catch (error) {
    console.error('❌ Get unread count error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.patch('/notifications/:id/read', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await markAsRead(req.user._id, id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Mark notification error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.patch('/notifications/read-all', isAdmin, async (req, res) => {
  try {
    await markAllAsRead(req.user._id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Mark all notifications error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== USER NOTIFICATIONS (for frontend users) =====
// ============================================================
router.get('/user/notifications', async (req, res) => {
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

    console.log(`📨 Found ${notifications.length} user notifications for ${user.email}`);
    res.json(notifications);
  } catch (error) {
    console.error('❌ Get user notifications error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.patch('/user/notifications/:id/read', async (req, res) => {
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

    console.log(`✅ User notification ${id} marked as read`);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('❌ Mark notification read error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.patch('/user/notifications/read-all', async (req, res) => {
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

    await Notification.updateMany(
      { userId: user._id, read: false },
      { read: true }
    );

    console.log(`✅ All user notifications marked as read for ${user.email}`);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('❌ Mark all notifications read error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== PROPERTIES =====
// ============================================================
router.get('/properties/pending', isAdmin, async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending', isDeleted: false })
      .populate('agent', 'name email phone agency')
      .sort({ createdAt: -1 });
    
    res.json({
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error('❌ Get pending properties error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/properties', isAdmin, async (req, res) => {
  try {
    const { status, search, includeDeleted } = req.query;
    const filter = {};
    
    // Default: only show non-deleted properties
    if (includeDeleted !== 'true') {
      filter.isDeleted = false;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'agent.name': { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    const properties = await Property.find(filter)
      .populate('agent', 'name email phone agency')
      .sort({ createdAt: -1 });
    
    res.json(properties);
  } catch (error) {
    console.error('❌ Get properties error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== GET TRASHED PROPERTIES - MUST BE BEFORE /:id =====
router.get('/properties/trash', isAdmin, async (req, res) => {
  try {
    console.log('🗑️ Fetching trashed properties...');
    const properties = await Property.find({ isDeleted: true })
      .populate('agent', 'name email phone agency')
      .sort({ deletedAt: -1 });
    
    console.log(`✅ Found ${properties.length} trashed properties`);
    res.json(properties);
  } catch (error) {
    console.error('❌ Get trash properties error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== GET PROPERTY BY ID - MUST BE AFTER /trash =====
router.get('/properties/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid property ID format' });
    }
    
    const property = await Property.findById(id)
      .populate('agent', 'name email phone agency');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('❌ Get property error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== DELETE PROPERTY (Soft Delete - Move to Trash) =====
router.delete('/properties/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    console.log(`🗑️ Attempting to delete property: ${id}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`❌ Invalid property ID format: ${id}`);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid property ID format' 
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      console.log(`❌ Property not found: ${id}`);
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }

    // Check if already deleted
    if (property.isDeleted) {
      console.log(`⚠️ Property already in trash: ${property.title}`);
      return res.status(400).json({ 
        success: false,
        message: 'Property is already in trash' 
      });
    }

    property.isDeleted = true;
    property.deletedAt = new Date();
    property.deletedBy = req.user._id;
    property.deletedReason = reason || 'No reason provided';
    await property.save();

    console.log(`✅ Property moved to trash: ${property.title} (${property._id})`);
    res.json({ 
      success: true, 
      message: 'Property moved to trash',
      property 
    });
  } catch (error) {
    console.error('❌ Delete property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== RESTORE PROPERTY FROM TRASH =====
router.patch('/properties/:id/restore', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`♻️ Attempting to restore property: ${id}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid property ID format' 
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }

    if (!property.isDeleted) {
      return res.status(400).json({ 
        success: false,
        message: 'Property is not in trash' 
      });
    }

    property.isDeleted = false;
    property.deletedAt = undefined;
    property.deletedBy = undefined;
    property.deletedReason = undefined;
    await property.save();

    console.log(`✅ Property restored from trash: ${property.title} (${property._id})`);
    res.json({ 
      success: true, 
      message: 'Property restored successfully',
      property 
    });
  } catch (error) {
    console.error('❌ Restore property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== PERMANENTLY DELETE PROPERTY =====
router.delete('/properties/:id/permanent', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`💀 Attempting to permanently delete property: ${id}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid property ID format' 
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }

    await property.deleteOne();

    console.log(`✅ Property permanently deleted: ${property.title} (${property._id})`);
    res.json({ 
      success: true, 
      message: 'Property permanently deleted',
      property 
    });
  } catch (error) {
    console.error('❌ Permanent delete property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== APPROVE PROPERTY =====
router.patch('/properties/:id/approve', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const adminNotes = req.body?.adminNotes || '';

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.isBlocked) {
      property.isBlocked = false;
      property.blockedReason = undefined;
      property.blockedBy = undefined;
      property.blockedAt = undefined;
    }

    property.status = 'approved';
    property.approvedBy = req.user._id;
    property.approvedAt = new Date();
    property.adminNotes = adminNotes;
    property.verified = true;
    await property.save();

    await notifyPropertyApproved(property);

    try {
      const userNotification = new Notification({
        userId: property.agent._id,
        type: 'property_approved',
        title: '✅ Property Approved!',
        message: `Your property "${property.title}" has been approved and is now live on PrimeEstate.`,
        link: `/property/${property._id}`,
        propertyId: property._id,
        read: false
      });
      await userNotification.save();
      console.log(`📧 User approval notification saved for ${property.agent.email}`);
    } catch (userNotifError) {
      console.error('❌ Failed to create user approval notification:', userNotifError);
    }

    try {
      if (property.agent && property.agent._id) {
        const agent = await User.findById(property.agent._id);
        if (agent && typeof agent.calculateTrustScore === 'function') {
          agent.totalListings = (agent.totalListings || 0) + 1;
          agent.calculateTrustScore();
          await agent.save();
        }
      }
    } catch (agentError) {
      console.log('⚠️ Could not update agent trust score:', agentError.message);
    }

    console.log(`✅ Property approved: ${property.title}`);
    res.json({ 
      success: true, 
      message: 'Property approved successfully!',
      property 
    });
  } catch (error) {
    console.error('❌ Approve property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== REJECT PROPERTY =====
router.patch('/properties/:id/reject', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = 'rejected';
    property.rejectedReason = reason;
    await property.save();

    await notifyPropertyRejected(property);

    try {
      const userNotification = new Notification({
        userId: property.agent._id,
        type: 'property_rejected',
        title: '❌ Property Rejected',
        message: `Your property "${property.title}" was rejected. Reason: ${reason}`,
        link: `/property/${property._id}`,
        propertyId: property._id,
        read: false
      });
      await userNotification.save();
      console.log(`📧 User rejection notification saved for ${property.agent.email}`);
    } catch (userNotifError) {
      console.error('❌ Failed to create user rejection notification:', userNotifError);
    }

    console.log(`❌ Property rejected: ${property.title}`);
    res.json({ 
      success: true, 
      message: 'Property rejected successfully',
      property 
    });
  } catch (error) {
    console.error('❌ Reject property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

router.patch('/properties/:id/block', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    if (!reason) {
      return res.status(400).json({ message: 'Block reason is required' });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isBlocked = true;
    property.blockedReason = reason;
    property.blockedBy = req.user._id;
    property.blockedAt = new Date();
    property.status = 'blocked';
    await property.save();

    console.log(`🚫 Property blocked: ${property.title}`);
    res.json({ 
      success: true, 
      message: 'Property blocked successfully',
      property 
    });
  } catch (error) {
    console.error('❌ Block property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

router.patch('/properties/:id/unblock', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isBlocked = false;
    property.blockedReason = undefined;
    property.blockedBy = undefined;
    property.blockedAt = undefined;
    property.status = 'approved';
    await property.save();

    console.log(`✅ Property unblocked: ${property.title}`);
    res.json({ 
      success: true, 
      message: 'Property unblocked successfully',
      property 
    });
  } catch (error) {
    console.error('❌ Unblock property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ============================================================
// ===== USERS =====
// ============================================================

// ===== GET ACTIVE USERS (NOT DELETED) =====
router.get('/users', isAdmin, async (req, res) => {
  try {
    // Only show users that are NOT deleted
    // This excludes users where isDeleted is true
    const users = await User.find({
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    })
      .select('-password -verificationToken -phoneOTP')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${users.length} active users`);
    res.json(users);
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== GET TRASHED USERS (DELETED) =====
router.get('/users/trash', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true })
      .select('-password -verificationToken -phoneOTP')
      .sort({ deletedAt: -1 });
    
    console.log(`🗑️ Found ${users.length} trashed users`);
    res.json(users);
  } catch (error) {
    console.error('❌ Get trash users error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== GET USER BY ID =====
router.get('/users/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(id)
      .select('-password -verificationToken -phoneOTP');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===== DELETE USER (Move to Trash) =====
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    console.log(`🗑️ Attempting to delete user: ${id}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`❌ Invalid user ID format: ${id}`);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log(`❌ User not found: ${id}`);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    if (user.isDeleted) {
      return res.status(400).json({ 
        success: false,
        message: 'User is already in trash' 
      });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    user.deletedReason = reason || 'No reason provided';
    user.calculateTrustScore();
    await user.save();

    console.log(`✅ User moved to trash: ${user.email} (${user._id})`);
    res.json({ 
      success: true, 
      message: 'User moved to trash',
      user 
    });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== RESTORE USER =====
router.patch('/users/:id/restore', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`♻️ Attempting to restore user: ${id}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`❌ Invalid user ID format: ${id}`);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log(`❌ User not found: ${id}`);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (!user.isDeleted) {
      return res.status(400).json({ 
        success: false,
        message: 'User is not in trash' 
      });
    }

    user.isDeleted = false;
    user.deletedAt = undefined;
    user.deletedBy = undefined;
    user.deletedReason = undefined;
    user.calculateTrustScore();
    await user.save();

    console.log(`✅ User restored from trash: ${user.email} (${user._id})`);
    res.json({ 
      success: true, 
      message: 'User restored successfully',
      user 
    });
  } catch (error) {
    console.error('❌ Restore user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== PERMANENTLY DELETE USER =====
router.delete('/users/:id/permanent', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`💀 Attempting to permanently delete user: ${id}`);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`❌ Invalid user ID format: ${id}`);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log(`❌ User not found: ${id}`);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await user.deleteOne();

    console.log(`✅ User permanently deleted: ${user.email} (${user._id})`);
    res.json({ 
      success: true, 
      message: 'User permanently deleted',
      user 
    });
  } catch (error) {
    console.error('❌ Permanent delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== BLOCK USER =====
router.patch('/users/:id/block', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    if (!reason) {
      return res.status(400).json({ message: 'Block reason is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = true;
    user.blockedReason = reason;
    user.blockedBy = req.user._id;
    user.blockedAt = new Date();
    user.calculateTrustScore();
    await user.save();

    console.log(`🚫 User blocked: ${user.email}`);
    res.json({ 
      success: true, 
      message: 'User blocked successfully',
      user 
    });
  } catch (error) {
    console.error('❌ Block user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== UNBLOCK USER =====
router.patch('/users/:id/unblock', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = false;
    user.blockedReason = undefined;
    user.blockedBy = undefined;
    user.blockedAt = undefined;
    user.calculateTrustScore();
    await user.save();

    console.log(`✅ User unblocked: ${user.email}`);
    res.json({ 
      success: true, 
      message: 'User unblocked successfully',
      user 
    });
  } catch (error) {
    console.error('❌ Unblock user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== FLAG USER =====
router.post('/users/:id/flag', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Flag reason is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.flags = (user.flags || 0) + 1;
    user.flagReason = reason;
    user.flaggedBy = req.user._id;
    user.flaggedAt = new Date();
    
    if (user.flags >= 3) {
      user.isFlagged = true;
      user.isBlocked = true;
      user.blockedReason = `Flagged (${user.flags} flags): ${reason}`;
      user.blockedBy = req.user._id;
      user.blockedAt = new Date();
      
      console.log(`🚩 User flagged (${user.flags} flags) and blocked: ${user.email}`);
    } else {
      console.log(`🚩 User flagged (${user.flags} flags): ${user.email}`);
    }
    
    user.calculateTrustScore();
    await user.save();

    res.json({ 
      success: true, 
      message: user.flags >= 3 
        ? 'User flagged and blocked' 
        : `User flagged (${user.flags}/3)`,
      user 
    });
  } catch (error) {
    console.error('❌ Flag user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== UNFLAG USER =====
router.post('/users/:id/unflag', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wasFlagged = user.isFlagged;
    const wasBlocked = user.isBlocked;
    
    user.isFlagged = false;
    user.flags = 0;
    user.flagReason = undefined;
    user.flaggedBy = undefined;
    user.flaggedAt = undefined;
    
    if (wasBlocked && wasFlagged) {
      user.isBlocked = false;
      user.blockedReason = undefined;
      user.blockedBy = undefined;
      user.blockedAt = undefined;
    }
    
    user.calculateTrustScore();
    await user.save();

    console.log(`✅ User unflagged: ${user.email}`);
    res.json({ 
      success: true, 
      message: 'User unflagged successfully',
      user 
    });
  } catch (error) {
    console.error('❌ Unflag user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

// ===== VERIFY AGENT =====
router.patch('/users/:id/verify-agent', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerifiedAgent = true;
    user.calculateTrustScore();
    await user.save();

    console.log(`✅ Agent verified: ${user.email}`);
    res.json({ 
      success: true, 
      message: 'Agent verified successfully',
      user 
    });
  } catch (error) {
    console.error('❌ Verify agent error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ===== STATS =====
// ============================================================
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments({ isDeleted: false });
    const pendingProperties = await Property.countDocuments({ status: 'pending', isDeleted: false });
    const approvedProperties = await Property.countDocuments({ status: 'approved', isDeleted: false });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected', isDeleted: false });
    const blockedProperties = await Property.countDocuments({ isBlocked: true, isDeleted: false });
    const deletedProperties = await Property.countDocuments({ isDeleted: true });
    
    // Active users (not deleted)
    const totalUsers = await User.countDocuments({
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    });
    
    const verifiedUsers = await User.countDocuments({ 
      emailVerified: true,
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    });
    
    const flaggedUsers = await User.countDocuments({ 
      isFlagged: true,
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    });
    
    const blockedUsers = await User.countDocuments({ 
      isBlocked: true,
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    });
    
    // Trashed users
    const deletedUsers = await User.countDocuments({ isDeleted: true });

    const recentProperties = await Property.find({ isDeleted: false })
      .populate('agent', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        blockedProperties,
        deletedProperties,
        totalUsers,
        verifiedUsers,
        flaggedUsers,
        blockedUsers,
        deletedUsers
      },
      recentProperties
    });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message
    });
  }
});

module.exports = router;