const Notification = require('../models/Notification');
const User = require('../models/User');

// ===== CREATE NOTIFICATION =====
const createNotification = async (userId, type, title, message, link = '/properties', relatedId = null) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      link,
      relatedId,
      read: false
    });
    await notification.save();
    console.log(`✅ Notification created: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Create notification error:', error);
    return null;
  }
};

// ===== GET NOTIFICATIONS =====
const getNotifications = async (userId, limit = 50) => {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return notifications;
  } catch (error) {
    console.error('❌ Get notifications error:', error);
    return [];
  }
};

// ===== GET UNREAD COUNT =====
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ userId, read: false });
    return count;
  } catch (error) {
    console.error('❌ Get unread count error:', error);
    return 0;
  }
};

// ===== MARK AS READ =====
const markAsRead = async (userId, notificationId) => {
  try {
    const result = await Notification.updateOne(
      { _id: notificationId, userId },
      { read: true }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('❌ Mark as read error:', error);
    return false;
  }
};

// ===== MARK ALL AS READ =====
const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('❌ Mark all as read error:', error);
    return false;
  }
};

// ===== DELETE OLD NOTIFICATIONS =====
const deleteOldNotifications = async (days = 30) => {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    await Notification.deleteMany({ createdAt: { $lt: cutoff }, read: true });
  } catch (error) {
    console.error('❌ Delete old notifications error:', error);
  }
};

// ===== NOTIFY ADMIN ABOUT NEW PROPERTY =====
const notifyNewProperty = async (property) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const title = 'New Property Pending Approval';
    const message = `"${property.title}" by ${property.agent?.name || 'Unknown'} needs your review.`;
    const link = '/properties'; // Changed from '/admin/properties'
    const relatedId = property._id;
    
    for (const admin of admins) {
      await createNotification(admin._id, 'pending', title, message, link, relatedId);
    }
    return true;
  } catch (error) {
    console.error('❌ Notify new property error:', error);
    return false;
  }
};

// ===== NOTIFY ADMIN ABOUT PROPERTY APPROVAL =====
const notifyPropertyApproved = async (property) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const title = 'Property Approved';
    const message = `"${property.title}" has been approved and is now live.`;
    const link = '/properties'; // Changed from '/admin/properties'
    const relatedId = property._id;
    
    for (const admin of admins) {
      await createNotification(admin._id, 'approved', title, message, link, relatedId);
    }
    return true;
  } catch (error) {
    console.error('❌ Notify property approved error:', error);
    return false;
  }
};

// ===== NOTIFY ADMIN ABOUT PROPERTY REJECTION =====
const notifyPropertyRejected = async (property) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const title = 'Property Rejected';
    const message = `"${property.title}" was rejected.`;
    const link = '/properties'; // Changed from '/admin/properties'
    const relatedId = property._id;
    
    for (const admin of admins) {
      await createNotification(admin._id, 'rejected', title, message, link, relatedId);
    }
    return true;
  } catch (error) {
    console.error('❌ Notify property rejected error:', error);
    return false;
  }
};

// ===== NOTIFY ADMIN ABOUT NEW USER =====
const notifyNewUser = async (user) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const title = 'New User Registered';
    const message = `${user.name} (${user.email}) has created an account.`;
    const link = '/users'; // Changed from '/admin/users'
    const relatedId = user._id;
    
    for (const admin of admins) {
      await createNotification(admin._id, 'user', title, message, link, relatedId);
    }
    return true;
  } catch (error) {
    console.error('❌ Notify new user error:', error);
    return false;
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteOldNotifications,
  notifyNewProperty,
  notifyPropertyApproved,
  notifyPropertyRejected,
  notifyNewUser
};