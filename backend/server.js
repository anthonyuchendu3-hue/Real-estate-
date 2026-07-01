// ===== DNS FIX =====
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
// ==================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== CORS CONFIGURATION FOR RENDER =====
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://primeestate-frontend.onrender.com',
  'https://primeestate-admin.onrender.com',
  'https://real-estaet.netlify.app', // ← ADDED YOUR NETLIFY URL
  'https://real-estate21111.netlify.app', // ← ADDED YOUR OTHER NETLIFY URL
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

console.log('🌐 Allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('🚫 CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  console.log('📋 Origin:', req.headers.origin);
  next();
});

// Import routes
const propertyRoutes = require('./routes/properties');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/primeestate', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
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
    environment: process.env.NODE_ENV || 'development',
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

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Auth routes available at: http://localhost:${PORT}/api/auth`);
  console.log(`🔑 Test route: http://localhost:${PORT}/api/test`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
});