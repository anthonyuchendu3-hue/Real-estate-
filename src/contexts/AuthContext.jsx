// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [toast, setToast] = useState(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const clearToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (token) {
      console.log('🔑 Token found in localStorage');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      console.log('🔑 No token found');
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      console.log('👤 Fetching user data...');
      const response = await axios.get('http://localhost:5000/api/auth/me');
      console.log('✅ User fetched:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // ===== SIGNUP =====
  const signup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
      const { user, requiresVerification, message } = response.data;
      
      console.log('✅ Signup successful:', user.email);
      
      setPendingEmail(user.email);
      setRequiresVerification(requiresVerification);
      
      showToast(message || 'Account created! Please verify your email.', 'success');
      
      return { 
        success: true, 
        requiresVerification: requiresVerification,
        user: user,
        email: user.email
      };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      showToast(message, 'error');
      return { 
        success: false, 
        message 
      };
    }
  };

  // ===== VERIFY EMAIL =====
  const verifyEmail = async (verificationToken) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', { 
        token: verificationToken 
      });
      
      const { user, message } = response.data;
      
      console.log('✅ Email verified:', user.email);
      
      setRequiresVerification(false);
      setPendingEmail('');
      
      showToast(message || 'Email verified! Please login.', 'success');
      
      return { 
        success: true, 
        user,
        message: 'Email verified! Please login to continue.'
      };
    } catch (error) {
      console.error('Verification error:', error);
      const message = error.response?.data?.message || 'Invalid or expired verification token.';
      showToast(message, 'error');
      return { 
        success: false, 
        message 
      };
    }
  };

  // ===== RESEND VERIFICATION =====
  const resendVerification = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification', { email });
      showToast(response.data.message || 'Verification email resent!', 'success');
      return { success: true };
    } catch (error) {
      console.error('Resend error:', error);
      const message = error.response?.data?.message || 'Failed to resend verification email.';
      showToast(message, 'error');
      return { 
        success: false, 
        message 
      };
    }
  };

  // ===== SIGN IN WITH BLOCK/FLAG CHECK =====
  const signin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', { email, password });
      const { token, user } = response.data;
      
      // Check if user is blocked
      if (user.isBlocked) {
        return { 
          success: false, 
          isBlocked: true,
          message: user.blockedReason || 'Your account has been blocked.' 
        };
      }

      // Check if user is flagged
      if (user.isFlagged) {
        return { 
          success: false, 
          isFlagged: true,
          message: 'Your account has been flagged for suspicious activity.' 
        };
      }
      
      console.log('✅ Login successful:', user.email);
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      setRequiresVerification(false);
      setPendingEmail('');
      
      showToast(`Welcome back ${user.name}! 👋`, 'success');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if response indicates block or flag
      if (error.response?.data?.isBlocked) {
        return { 
          success: false, 
          isBlocked: true,
          message: error.response.data.message 
        };
      }
      if (error.response?.data?.isFlagged) {
        return { 
          success: false, 
          isFlagged: true,
          message: error.response.data.message 
        };
      }
      
      if (error.response?.data?.requiresVerification) {
        const message = error.response?.data?.message || 'Please verify your email before logging in.';
        setPendingEmail(error.response?.data?.email || email);
        setRequiresVerification(true);
        showToast(message, 'info');
        return { 
          success: false, 
          requiresVerification: true,
          email: error.response?.data?.email || email,
          message 
        };
      }
      
      const message = error.response?.data?.message || 'Invalid email or password';
      showToast(message, 'error');
      return { 
        success: false, 
        message 
      };
    }
  };

  // ===== LOGOUT =====
  const logout = () => {
    const userName = user?.name || 'User';
    console.log('👤 Logging out...');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setRequiresVerification(false);
    setPendingEmail('');
    showToast(`Goodbye ${userName}! You have been logged out. 👋`, 'info');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      token,
      signup,
      signin,
      logout,
      verifyEmail,
      resendVerification,
      isAuthenticated: !!user,
      requiresVerification,
      pendingEmail,
      toast,
      showToast,
      clearToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};