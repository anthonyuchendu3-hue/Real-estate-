// backend/config/email.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send verification email
async function sendVerificationEmail(email, token, name) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
      <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #3b705c; font-size: 28px;">🏠 PrimeEstate</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 16px;">Welcome to PrimeEstate, ${name || 'there'}! 👋</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Thank you for signing up! Please verify your email address to get started.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; background-color: #3b705c; color: white; padding: 14px 32px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          This link will expire in <strong>24 hours</strong>.
        </p>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 16px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px;">
        <p>© 2024 PrimeEstate. All rights reserved.</p>
        <p>Built with ❤️ in Nigeria</p>
      </div>
    </div>
  `;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'trenchkidarizona1@gmail.com',
    subject: 'Verify Your Email - PrimeEstate',
    html: html
  };

  try {
    await sgMail.send(msg);
    console.log('📧 Verification email sent via SendGrid');
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid error:', error.message);
    if (error.response) {
      console.error('📝 Error details:', error.response.body);
    }
    return { success: false, error: error.message };
  }
}

// Send welcome email
async function sendWelcomeEmail(email, name) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
      <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #3b705c; font-size: 28px;">🏠 PrimeEstate</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 16px;">Welcome to PrimeEstate, ${name || 'there'}! 🎉</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Your account has been successfully verified! You're now ready to:
        </p>
        
        <ul style="color: #4b5563; font-size: 16px; line-height: 2; padding-left: 20px;">
          <li>🏠 Browse thousands of properties</li>
          <li>❤️ Save your favorite listings</li>
          <li>📝 List your own properties</li>
          <li>📱 Connect with agents instantly</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/properties" 
             style="display: inline-block; background-color: #3b705c; color: white; padding: 14px 32px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Start Exploring
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px;">
        <p>© 2024 PrimeEstate. All rights reserved.</p>
      </div>
    </div>
  `;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'trenchkidarizona1@gmail.com',
    subject: 'Welcome to PrimeEstate! 🎉',
    html: html
  };

  try {
    await sgMail.send(msg);
    console.log('📧 Welcome email sent via SendGrid');
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid welcome email error:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendVerificationEmail, sendWelcomeEmail };