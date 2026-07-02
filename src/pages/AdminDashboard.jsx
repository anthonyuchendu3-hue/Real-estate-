import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Check, X, Eye, Search, Filter, 
  Clock, Users, Home, TrendingUp,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

// ===== FIX: Use environment variable for API URL =====
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// =====================================================

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, propertiesRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/properties/pending`),
        axios.get(`${API_BASE}/api/admin/properties`),
        axios.get(`${API_BASE}/api/admin/users`)
      ]);

      setPendingProperties(pendingRes.data.properties);
      setAllProperties(propertiesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const approveProperty = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/properties/${id}/approve`);
      await fetchData();
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const rejectProperty = async (id) => {
    const reasonText = prompt('Reason for rejection:');
    if (!reasonText) return;
    
    try {
      await axios.patch(`${API_BASE}/api/admin/properties/${id}/reject`, { reason: reasonText });
      await fetchData();
    } catch (error) {
      console.error('Error rejecting property:', error);
    }
  };

  const flagUser = async (id) => {
    const reason = prompt('Reason for flagging this user:');
    if (!reason) return;
    
    try {
      await axios.post(`${API_BASE}/api/admin/users/${id}/flag`, { reason });
      await fetchData();
    } catch (error) {
      console.error('Error flagging user:', error);
    }
  };

  const verifyAgent = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/users/${id}/verify-agent`);
      await fetchData();
    } catch (error) {
      console.error('Error verifying agent:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage properties, users, and listings
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingProperties.length}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {allProperties.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.length}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {allProperties.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({pendingProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'properties'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingProperties.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">No pending properties!</p>
              </div>
            ) : (
              pendingProperties.map(property => (
                <div key={property._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Agent: {property.agent.name} • {property.agent.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Location: {property.location} • Price: ₦{property.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Submitted: {new Date(property.createdAt).toLocaleString()}
                      </p>
                      {property.images && property.images.length > 0 && (
                        <div className="flex space-x-2 mt-2">
                          {property.images.slice(0, 3).map((img, i) => (
                            <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded" />
                          ))}
                          {property.images.length > 3 && (
                            <span className="text-xs text-gray-500">+{property.images.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => approveProperty(property._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectProperty(property._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {allProperties.map(property => (
                    <tr key={property._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{property.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{property.agent.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">₦{property.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          property.status === 'approved' ? 'bg-green-100 text-green-700' :
                          property.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          property.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-primary-600 hover:text-primary-700 text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.emailVerified ? '✅ Verified' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-medium ${
                          user.trustScore >= 70 ? 'text-green-600' :
                          user.trustScore >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {user.trustScore || 0}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => verifyAgent(user._id)}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            disabled={user.isVerifiedAgent}
                          >
                            {user.isVerifiedAgent ? 'Verified' : 'Verify Agent'}
                          </button>
                          <button
                            onClick={() => flagUser(user._id)}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Flag
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;