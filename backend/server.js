const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== CORS CONFIGURATION =====
// Use this simplified CORS setup instead of app.options('*', cors())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// No need for app.options('*', cors()) - cors() middleware handles preflight

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Import routes
const propertyRoutes = require('./routes/properties');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/primeestate')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'PrimeEstate API is running',
    routes: {
      auth: '/api/auth',
      properties: '/api/properties',
      upload: '/api/upload',
      admin: '/api/admin'
    }
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'PrimeEstate API is running',
    endpoints: {
      'GET /': 'API Status',
      'GET /api/test': 'Test all routes',
      'POST /api/auth/signup': 'Create account',
      'POST /api/auth/verify-email': 'Verify email',
      'POST /api/auth/resend-verification': 'Resend verification',
      'POST /api/auth/signin': 'Login',
      'GET /api/auth/me': 'Get current user',
      'POST /api/auth/logout': 'Logout',
      'POST /api/auth/favorites': 'Update favorites',
      'GET /api/auth/favorites': 'Get favorites',
      'GET /api/admin/notifications': 'Get admin notifications',
      'GET /api/admin/properties': 'Get all properties',
      'GET /api/admin/properties/pending': 'Get pending properties',
      'PATCH /api/admin/properties/:id/approve': 'Approve property',
      'PATCH /api/admin/properties/:id/reject': 'Reject property',
      'GET /api/admin/users': 'Get all users'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Auth routes available at: http://localhost:${PORT}/api/auth`);
  console.log(`🔑 Test route: http://localhost:${PORT}/api/test`);
  console.log(`🌐 CORS enabled for: http://localhost:5173, http://localhost:5174`);
});