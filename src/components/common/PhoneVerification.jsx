// frontend/components/common/PhoneVerification.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Check, X, Loader } from 'lucide-react';

const PhoneVerification = ({ onVerified, className = '' }) => {
  const [step, setStep] = useState('request'); // request, verify, success
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  const requestOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/request-phone-otp', { phone });
      if (response.data.success) {
        setStep('verify');
        // Start timer for resend
        setTimer(60);
        const interval = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-phone', { otp });
      if (response.data.success) {
        setStep('success');
        if (onVerified) onVerified();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className={`flex items-center space-x-2 text-green-600 dark:text-green-400 ${className}`}>
        <Check className="w-5 h-5" />
        <span>Phone verified successfully!</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {step === 'request' && (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number (e.g., 08012345678)"
              className="flex-1 input-field"
              disabled={loading}
            />
          </div>
          <button
            onClick={requestOTP}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <span>Send Verification Code</span>
            )}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to {phone}
          </p>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter OTP"
              maxLength={6}
              className="flex-1 input-field text-center text-lg tracking-widest"
              disabled={loading}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <span>Verify</span>
              )}
            </button>
            <button
              onClick={requestOTP}
              disabled={timer > 0 || loading}
              className="btn-secondary text-sm"
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;