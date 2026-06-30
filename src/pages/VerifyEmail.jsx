// frontend/pages/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log('📤 Sending token to backend:', token);
        
        // Use full URL directly (bypass proxy)
        const response = await axios.post('http://localhost:5000/api/auth/verify-email', { 
          token: token.trim() 
        });
        
        console.log('📥 Backend response:', response.data);
        
        if (response.data.success) {
          setStatus('success');
          setMessage('Email verified successfully! 🎉');
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed');
        }
      } catch (error) {
        console.error('❌ Verification error:', error);
        console.error('📝 Response:', error.response?.data);
        console.error('📝 Status:', error.response?.status);
        
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
        setErrorDetails(error.response?.data?.details || '');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verifying...</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we verify your email.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Verified! ✅</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting you to login page...</p>
            
            <Link
              to="/login"
              className="btn-primary inline-flex items-center space-x-2 mt-6"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
            {errorDetails && (
              <p className="text-sm text-red-400 mt-2">{errorDetails}</p>
            )}
            
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  window.location.href = '/resend-verification?email=kmick9693@gmail.com';
                }}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Resend verification email
              </button>
              <Link
                to="/signup"
                className="btn-secondary w-full text-center"
              >
                Back to Sign Up
              </Link>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Already have an account? Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;