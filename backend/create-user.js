const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define User schema directly
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  agency: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing user first
    const deleted = await User.deleteOne({ email: 'admin@primeestate.ng' });
    console.log(`🗑️ Deleted ${deleted.deletedCount} existing user(s)`);

    // Hash password
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('🔑 Password:', plainPassword);
    console.log('🔐 Hashed:', hashedPassword);

    // Create new user
    const user = new User({
      name: 'Admin User',
      email: 'admin@primeestate.ng',
      password: hashedPassword,
      role: 'admin',
      phone: '+234 800 123 4567',
      agency: 'PrimeEstate Admin'
    });

    await user.save();
    console.log('✅ User created successfully!');
    console.log('📧 Email: admin@primeestate.ng');
    console.log('🔑 Password: admin123');
    
    // Verify the user was created
    const checkUser = await User.findOne({ email: 'admin@primeestate.ng' });
    if (checkUser) {
      console.log('✅ Verification: User found in database');
      console.log('📋 Name:', checkUser.name);
      console.log('📧 Email:', checkUser.email);
      console.log('🔒 Has password:', !!checkUser.password);
    } else {
      console.log('❌ Verification: User NOT found!');
    }
    
    await mongoose.connection.close();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
  }
}

createUser();