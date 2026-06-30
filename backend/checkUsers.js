const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/primeestate');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const users = db.collection('users');

    const total = await users.countDocuments();
    console.log(`📊 Total users in database: ${total}`);

    if (total === 0) {
      console.log('\n❌ No users found!');
      console.log('You need to create an admin user first.');
    } else {
      const sample = await users.findOne({});
      console.log('\n📝 Sample user:', sample.email);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();