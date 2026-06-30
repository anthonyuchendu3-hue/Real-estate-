import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../api/adminApi';
import { Building2, CheckCircle, XCircle, Clock, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('📊 Fetching dashboard data...');
      const response = await adminApi.get('/admin/properties');
      console.log('📥 Response:', response.data);
      
      const properties = response.data || [];
      
      const pending = properties.filter(p => p.status === 'pending');
      const approved = properties.filter(p => p.status === 'approved');
      const rejected = properties.filter(p => p.status === 'rejected');

      setStats({
        totalProperties: properties.length,
        pendingProperties: pending.length,
        approvedProperties: approved.length,
        rejectedProperties: rejected.length,
        totalUsers: 0,
      });

      setRecentProperties(properties.slice(0, 5));
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Properties', 
      value: stats.totalProperties, 
      icon: Building2, 
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Pending', 
      value: stats.pendingProperties, 
      icon: Clock, 
      bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      title: 'Approved', 
      value: stats.approvedProperties, 
      icon: CheckCircle, 
      bgLight: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'Rejected', 
      value: stats.rejectedProperties, 
      icon: XCircle, 
      bgLight: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Welcome back, Admin!</p>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
          <span className="hidden xs:inline">Last updated:</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-1.5 sm:p-2 md:p-3 rounded-lg`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Properties */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Properties</h2>
          <Link to="/properties" className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="text-left text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase">
                <th className="px-3 sm:px-4 py-2 sm:py-3">Title</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">Status</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 hidden md:table-cell">Price</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentProperties.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 sm:px-4 py-6 sm:py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No properties found
                  </td>
                </tr>
              ) : (
                recentProperties.map((property) => (
                  <tr key={property._id} className="text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 dark:text-white font-medium truncate max-w-[80px] sm:max-w-none">
                      {property.title}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                        property.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 hidden md:table-cell text-gray-600 dark:text-gray-400">
                      ₦{property.price?.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;