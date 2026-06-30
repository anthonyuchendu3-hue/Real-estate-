// admin/src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../api/adminApi';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    console.log('🔍 Checking localStorage...');
    console.log('📝 Token:', token ? 'Exists' : 'Not found');
    console.log('📝 User data:', userData ? 'Exists' : 'Not found');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin') {
          setAdmin(user);
          console.log('✅ Session restored for:', user.email);
        }
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔑 Logging in:', email);
      
      const response = await adminApi.post('/auth/signin', { email, password });
      console.log('📥 Response:', response.data);

      const { token, user } = response.data;

      // Check if user is admin
      if (user.role !== 'admin') {
        console.log('❌ User is not admin. Role:', user.role);
        return { 
          success: false, 
          message: 'Access denied. Admin only.' 
        };
      }

      // Save to localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      // Update state
      setAdmin(user);
      
      console.log('✅ Login successful!');
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    console.log('👤 Logging out...');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      loading,
      login,
      logout,
      isAuthenticated: !!admin
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};