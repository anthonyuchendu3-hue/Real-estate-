import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../api/adminApi';
import { 
  Check, X, Eye, Search, RefreshCw, XCircle, CheckCircle, Clock, 
  User, MapPin, DollarSign, Home, Bed, Bath, Square, Calendar, 
  Building2, Mail, Phone, AlertCircle, Ban, Unlock, Lock,
  PlusCircle, Trash2, Archive, RotateCcw
} from 'lucide-react';

const PropertiesManagement = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [trashProperties, setTrashProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('active');

  useEffect(() => {
    fetchAllProperties();
  }, []);

  useEffect(() => {
    // When viewMode changes, just filter the already loaded data
    // No need to refetch
  }, [viewMode]);

  // ===== FETCH ALL PROPERTIES (Both Active and Trash) =====
  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      setMessage('');
      console.log('📊 Fetching all properties...');
      
      const [propertiesRes, trashRes] = await Promise.all([
        adminApi.get('/admin/properties'),
        adminApi.get('/admin/properties/trash')
      ]);
      
      setProperties(propertiesRes.data || []);
      setTrashProperties(trashRes.data || []);
      
      console.log('📥 Active properties:', propertiesRes.data?.length || 0);
      console.log('🗑️ Trashed properties:', trashRes.data?.length || 0);
    } catch (error) {
      console.error('Error fetching properties:', error);
      if (error.response?.status === 401) {
        setMessage('⚠️ Session expired. Please login again.');
      } else {
        setMessage('❌ Failed to load properties');
      }
      setProperties([]);
      setTrashProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== REFRESH BOTH LISTS =====
  const refreshAllProperties = async () => {
    try {
      const [propertiesRes, trashRes] = await Promise.all([
        adminApi.get('/admin/properties'),
        adminApi.get('/admin/properties/trash')
      ]);
      
      setProperties(propertiesRes.data || []);
      setTrashProperties(trashRes.data || []);
      
      console.log('🔄 Refreshed - Active:', propertiesRes.data?.length || 0, 'Trash:', trashRes.data?.length || 0);
    } catch (error) {
      console.error('Error refreshing properties:', error);
    }
  };

  // ===== DELETE PROPERTY (Move to Trash) =====
  const deleteProperty = async (id) => {
    const reason = prompt('Enter reason for deleting this property:');
    if (reason === null) return;

    if (!reason.trim()) {
      setMessage('❌ Deletion reason is required');
      return;
    }

    if (!window.confirm('Are you sure you want to move this property to trash?')) return;

    try {
      setActionLoading(true);
      setMessage('');
      
      console.log(`🗑️ Deleting property: ${id}`);
      const response = await adminApi.delete(`/admin/properties/${id}`, {
        data: { reason: reason.trim() }
      });
      
      if (response.data.success) {
        setMessage('🗑️ Property moved to trash successfully!');
        await refreshAllProperties();
        if (showModal) {
          setShowModal(false);
          setSelectedProperty(null);
        }
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      if (error.response?.status === 404) {
        setMessage('❌ Property not found');
      } else if (error.response?.status === 400) {
        setMessage('❌ ' + (error.response?.data?.message || 'Invalid request'));
      } else {
        setMessage('❌ Failed to delete property: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ===== RESTORE PROPERTY =====
  const restoreProperty = async (id) => {
    if (!window.confirm('Are you sure you want to restore this property?')) return;

    try {
      setActionLoading(true);
      setMessage('');
      
      console.log(`♻️ Restoring property: ${id}`);
      const response = await adminApi.patch(`/admin/properties/${id}/restore`);
      
      if (response.data.success) {
        setMessage('♻️ Property restored successfully!');
        await refreshAllProperties();
        if (showModal) {
          setShowModal(false);
          setSelectedProperty(null);
        }
      }
    } catch (error) {
      console.error('Error restoring property:', error);
      if (error.response?.status === 404) {
        setMessage('❌ Property not found');
      } else if (error.response?.status === 400) {
        setMessage('❌ ' + (error.response?.data?.message || 'Invalid request'));
      } else {
        setMessage('❌ Failed to restore property: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ===== PERMANENTLY DELETE PROPERTY =====
  const permanentDeleteProperty = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to permanently delete this property? This action cannot be undone!')) return;

    try {
      setActionLoading(true);
      setMessage('');
      
      console.log(`💀 Permanently deleting property: ${id}`);
      const response = await adminApi.delete(`/admin/properties/${id}/permanent`);
      
      if (response.data.success) {
        setMessage('💀 Property permanently deleted!');
        await refreshAllProperties();
        if (showModal) {
          setShowModal(false);
          setSelectedProperty(null);
        }
      }
    } catch (error) {
      console.error('Error permanently deleting property:', error);
      if (error.response?.status === 404) {
        setMessage('❌ Property not found');
      } else if (error.response?.status === 400) {
        setMessage('❌ ' + (error.response?.data?.message || 'Invalid request'));
      } else {
        setMessage('❌ Failed to permanently delete property: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const approveProperty = async (id) => {
    if (actionLoading) return;
    setActionLoading(true);
    setMessage('');

    try {
      console.log(`✅ Approving property: ${id}`);
      const response = await adminApi.patch(`/admin/properties/${id}/approve`, {});
      console.log('📥 Approve response:', response.data);
      
      if (response.data.success) {
        setMessage('✅ Property approved successfully!');
        await refreshAllProperties();
        if (showModal) {
          const updatedProperty = properties.find(p => p._id === id);
          if (updatedProperty) {
            setSelectedProperty(updatedProperty);
          }
        }
      } else {
        setMessage('❌ Failed to approve property');
      }
    } catch (error) {
      console.error('❌ Error approving property:', error);
      setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const rejectProperty = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    if (actionLoading) return;
    setActionLoading(true);
    setMessage('');

    try {
      console.log(`❌ Rejecting property: ${id}`);
      const response = await adminApi.patch(`/admin/properties/${id}/reject`, { reason });
      console.log('📥 Reject response:', response.data);
      
      if (response.data.success) {
        setMessage('❌ Property rejected successfully!');
        await refreshAllProperties();
        if (showModal) {
          setShowModal(false);
          setSelectedProperty(null);
        }
      } else {
        setMessage('❌ Failed to reject property');
      }
    } catch (error) {
      console.error('❌ Error rejecting property:', error);
      setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const blockProperty = async (id) => {
    const reason = prompt('Enter reason for blocking this property:');
    if (!reason) return;

    if (actionLoading) return;
    setActionLoading(true);
    setMessage('');

    try {
      console.log(`🚫 Blocking property: ${id}`);
      const response = await adminApi.patch(`/admin/properties/${id}/block`, { reason });
      console.log('📥 Block response:', response.data);
      
      if (response.data.success) {
        setMessage('🚫 Property blocked successfully!');
        await refreshAllProperties();
        if (showModal) {
          const updatedProperty = properties.find(p => p._id === id);
          if (updatedProperty) {
            setSelectedProperty(updatedProperty);
          }
        }
      } else {
        setMessage('❌ Failed to block property');
      }
    } catch (error) {
      console.error('❌ Error blocking property:', error);
      setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const unblockProperty = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this property?')) return;

    if (actionLoading) return;
    setActionLoading(true);
    setMessage('');

    try {
      console.log(`✅ Unblocking property: ${id}`);
      const response = await adminApi.patch(`/admin/properties/${id}/unblock`);
      console.log('📥 Unblock response:', response.data);
      
      if (response.data.success) {
        setMessage('✅ Property unblocked successfully!');
        await refreshAllProperties();
        if (showModal) {
          const updatedProperty = properties.find(p => p._id === id);
          if (updatedProperty) {
            setSelectedProperty(updatedProperty);
          }
        }
      } else {
        setMessage('❌ Failed to unblock property');
      }
    } catch (error) {
      console.error('❌ Error unblocking property:', error);
      setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePropertyDetails = () => {
    setShowModal(false);
    setSelectedProperty(null);
    document.body.style.overflow = 'unset';
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      blocked: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayProperties = viewMode === 'trash' ? trashProperties : properties;
  const totalActive = properties.length;
  const totalTrash = trashProperties.length;

  const filteredProperties = displayProperties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter;
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.agent?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {viewMode === 'trash' ? '🗑️ Trash' : 'Properties'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {viewMode === 'trash' 
              ? `Trashed properties (${totalTrash})` 
              : `Manage all properties (${totalActive})`
            }
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle View Mode - Using Buttons instead of icons */}
          <button
            onClick={() => {
              setViewMode(viewMode === 'active' ? 'trash' : 'active');
              refreshAllProperties();
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'trash'
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {viewMode === 'trash' ? `Active Properties (${totalActive})` : `Trash (${totalTrash})`}
          </button>

          {viewMode === 'active' && (
            <button
              onClick={() => navigate('/properties/add')}
              className="btn-primary flex items-center space-x-2 text-sm py-2 px-4"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}

          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>

          {viewMode === 'active' && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="blocked">Blocked</option>
            </select>
          )}

          <button
            onClick={refreshAllProperties}
            className="p-1.5 sm:p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400' :
          message.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400' :
          message.includes('🚫') ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400' :
          message.includes('🗑️') ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400' :
          message.includes('♻️') ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400' :
          message.includes('💀') ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400' :
          'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
        }`}>
          {message}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="text-left text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase">
                <th className="px-3 sm:px-6 py-2 sm:py-3">Title</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 hidden sm:table-cell">Agent</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 hidden md:table-cell">Price</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 hidden lg:table-cell">Created</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3">Status</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    {viewMode === 'trash' ? 'Trash is empty' : 'No properties found'}
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr key={property._id} className="text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-900 dark:text-white font-medium truncate max-w-[80px] sm:max-w-none">
                      {property.title}
                      {property.isDeleted && (
                        <span className="ml-2 text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                          Deleted
                        </span>
                      )}
                      {property.isBlocked && !property.isDeleted && (
                        <span className="ml-2 text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 hidden sm:table-cell text-gray-600 dark:text-gray-400">
                      {property.agent?.name || 'Unknown'}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                      ₦{property.price?.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 hidden lg:table-cell text-gray-500 dark:text-gray-400 text-[10px]">
                      {formatDate(property.createdAt)}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4">
                      {property.isDeleted ? (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Trashed
                        </span>
                      ) : (
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadge(property.status)}`}>
                          {property.status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4">
                      <div className="flex flex-wrap gap-1">
                        <button 
                          onClick={() => openPropertyDetails(property)}
                          className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          View
                        </button>

                        {property.isDeleted ? (
                          <>
                            <button 
                              onClick={() => restoreProperty(property._id)}
                              disabled={actionLoading}
                              className="text-green-500 hover:text-green-700 text-xs px-2 py-1 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
                              title="Restore"
                            >
                              Restore
                            </button>
                            <button 
                              onClick={() => permanentDeleteProperty(property._id)}
                              disabled={actionLoading}
                              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Permanently Delete"
                            >
                              Delete Permanently
                            </button>
                          </>
                        ) : (
                          <>
                            {property.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => approveProperty(property._id)}
                                  disabled={actionLoading}
                                  className="text-green-500 hover:text-green-700 text-xs px-2 py-1 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
                                  title="Approve"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => rejectProperty(property._id)}
                                  disabled={actionLoading}
                                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                                  title="Reject"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {property.status === 'approved' && !property.isBlocked && (
                              <button 
                                onClick={() => blockProperty(property._id)}
                                disabled={actionLoading}
                                className="text-orange-500 hover:text-orange-700 text-xs px-2 py-1 rounded hover:bg-orange-50 transition-colors disabled:opacity-50"
                                title="Block"
                              >
                                Block
                              </button>
                            )}
                            {property.isBlocked && (
                              <button 
                                onClick={() => unblockProperty(property._id)}
                                disabled={actionLoading}
                                className="text-green-500 hover:text-green-700 text-xs px-2 py-1 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
                                title="Unblock"
                              >
                                Unblock
                              </button>
                            )}
                            <button 
                              onClick={() => deleteProperty(property._id)}
                              disabled={actionLoading}
                              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Move to Trash"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== PROPERTY DETAILS MODAL ===== */}
      {showModal && selectedProperty && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePropertyDetails();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start z-10">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {selectedProperty.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {selectedProperty.location}
                </p>
              </div>
              <button 
                onClick={closePropertyDetails}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Status Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${getStatusBadge(selectedProperty.status)}`}>
                  {selectedProperty.status}
                </span>
                {selectedProperty.verified && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Verified
                  </span>
                )}
                {selectedProperty.isBlocked && (
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center">
                    <Ban className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Blocked
                  </span>
                )}
                {selectedProperty.isDeleted && (
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    In Trash
                  </span>
                )}
              </div>

              {/* Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Images</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt={`Property ${i + 1}`} 
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(img, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Block Reason */}
              {selectedProperty.blockedReason && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Block Reason</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{selectedProperty.blockedReason}</p>
                </div>
              )}

              {/* Deleted Reason */}
              {selectedProperty.deletedReason && (
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Deleted Reason</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedProperty.deletedReason}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Bedrooms</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedProperty.bedrooms || 0}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Bathrooms</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedProperty.bathrooms || 0}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <Square className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sqft</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedProperty.sqft || 0}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Year Built</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedProperty.yearBuilt || 'N/A'}</p>
                </div>
              </div>

              {/* Description */}
              {selectedProperty.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedProperty.amenities.map((amenity, idx) => (
                      <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent Info */}
              {selectedProperty.agent && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Agent Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2 text-primary-600" />
                      {selectedProperty.agent.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2 text-primary-600" />
                      {selectedProperty.agent.agency || 'Independent Agent'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2 text-primary-600" />
                      {selectedProperty.agent.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-2 text-primary-600" />
                      {selectedProperty.agent.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Price & Listing Type */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
                    ₦{selectedProperty.price?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Listing Type</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white capitalize">
                    {selectedProperty.listingType || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(selectedProperty.createdAt)}</span>
                </div>
                {selectedProperty.deletedAt && (
                  <div className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400 mt-1">
                    <Trash2 className="w-4 h-4" />
                    <span>Deleted: {formatDate(selectedProperty.deletedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-2 sm:gap-3">
              {selectedProperty.isDeleted ? (
                <>
                  <button
                    onClick={() => restoreProperty(selectedProperty._id)}
                    disabled={actionLoading}
                    className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => permanentDeleteProperty(selectedProperty._id)}
                    disabled={actionLoading}
                    className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Permanently Delete</span>
                  </button>
                </>
              ) : (
                <>
                  {selectedProperty.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveProperty(selectedProperty._id)}
                        disabled={actionLoading}
                        className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectProperty(selectedProperty._id)}
                        disabled={actionLoading}
                        className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {selectedProperty.status === 'approved' && !selectedProperty.isBlocked && (
                    <button
                      onClick={() => blockProperty(selectedProperty._id)}
                      disabled={actionLoading}
                      className="flex-1 min-w-[100px] bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Ban className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Block</span>
                    </button>
                  )}

                  {selectedProperty.isBlocked && (
                    <button
                      onClick={() => unblockProperty(selectedProperty._id)}
                      disabled={actionLoading}
                      className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Unblock</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteProperty(selectedProperty._id)}
                    disabled={actionLoading}
                    className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Move to Trash</span>
                  </button>
                </>
              )}

              <button
                onClick={closePropertyDetails}
                className="flex-1 min-w-[100px] bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesManagement;