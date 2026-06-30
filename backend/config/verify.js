// backend/config/verify.js
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

async function sendOTP(phoneNumber) {
  try {
    const cleanNumber = phoneNumber.trim();
    
    const verification = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: cleanNumber,
        channel: 'sms'
      });
    
    console.log(`✅ OTP sent to ${cleanNumber}, Status: ${verification.status}`);
    return { success: true, status: verification.status, sid: verification.sid };
  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    return { success: false, error: error.message };
  }
}

async function verifyOTP(phoneNumber, code) {
  try {
    const cleanNumber = phoneNumber.trim();
    
    const verificationCheck = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks
      .create({
        to: cleanNumber,
        code: code
      });
    
    return { 
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status,
      sid: verificationCheck.sid
    };
  } catch (error) {
    console.error('❌ Error verifying OTP:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendOTP, verifyOTP };