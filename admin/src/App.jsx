import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PropertiesManagement from './pages/PropertiesManagement';
import AdminAddProperty from './pages/AdminAddProperty';
import UsersManagement from './pages/UsersManagement';
import Settings from './pages/Settings';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/common/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/properties" element={<PropertiesManagement />} />
            <Route path="/properties/add" element={<AdminAddProperty />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;