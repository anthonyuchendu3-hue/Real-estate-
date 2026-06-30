const mongoose = require('mongoose');
require('dotenv').config();

async function fixAllProperties() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/primeestate');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const properties = db.collection('properties');

    // Count before
    const total = await properties.countDocuments();
    console.log(`📊 Total properties in database: ${total}`);

    if (total === 0) {
      console.log('❌ No properties found in database!');
      console.log('You need to add properties first.');
      process.exit(0);
    }

    const pending = await properties.countDocuments({ status: 'pending' });
    const approved = await properties.countDocuments({ status: 'approved' });
    const trashed = await properties.countDocuments({ isDeleted: true });
    const notTrashed = await properties.countDocuments({ isDeleted: false });

    console.log(`\n📋 Before update:`);
    console.log(`  Total: ${total}`);
    console.log(`  Pending: ${pending}`);
    console.log(`  Approved: ${approved}`);
    console.log(`  Trashed (isDeleted: true): ${trashed}`);
    console.log(`  Not Trashed (isDeleted: false): ${notTrashed}`);

    // FIX ALL PROPERTIES - make them approved and not deleted
    const result = await properties.updateMany(
      {},
      { $set: { status: 'approved', isDeleted: false } }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} properties`);

    // Count after
    const newTotal = await properties.countDocuments();
    const newApproved = await properties.countDocuments({ status: 'approved', isDeleted: false });
    console.log(`\n📊 After update:`);
    console.log(`  Total: ${newTotal}`);
    console.log(`  Approved & Not Deleted: ${newApproved}`);

    // Show sample properties
    const samples = await properties.find({}).limit(3).toArray();
    console.log('\n📝 Sample properties:');
    samples.forEach((p, i) => {
      console.log(`  ${i+1}. ${p.title} - Status: ${p.status}, isDeleted: ${p.isDeleted}`);
    });

    console.log('\n✅ Done! Refresh your admin panel now.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllProperties();