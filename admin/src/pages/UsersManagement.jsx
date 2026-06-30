import React, { useState, useEffect } from 'react';
import adminApi from '../api/adminApi';
import { 
  Search, Eye, Mail, Phone, Calendar,
  Trash2, Archive, RotateCcw, RefreshCw
} from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [trashUsers, setTrashUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState('active');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // ===== FETCH ALL USERS (Both Active and Trash) =====
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setMessage('');
      console.log('📊 Fetching all users...');
      
      const [usersRes, trashRes] = await Promise.all([
        adminApi.get('/admin/users'),
        adminApi.get('/admin/users/trash')
      ]);
      
      setUsers(usersRes.data || []);
      setTrashUsers(trashRes.data || []);
      
      console.log('📥 Active users:', usersRes.data?.length || 0);
      console.log('🗑️ Trashed users:', trashRes.data?.length || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        setMessage('⚠️ Session expired. Please login again.');
      } else {
        setMessage('❌ Failed to load users');
      }
      setUsers([]);
      setTrashUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== REFRESH BOTH LISTS =====
  const refreshAllUsers = async () => {
    try {
      const [usersRes, trashRes] = await Promise.all([
        adminApi.get('/admin/users'),
        adminApi.get('/admin/users/trash')
      ]);
      
      setUsers(usersRes.data || []);
      setTrashUsers(trashRes.data || []);
      
      console.log('🔄 Refreshed - Active:', usersRes.data?.length || 0, 'Trash:', trashRes.data?.length || 0);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  // ===== DELETE USER (Move to Trash) =====
  const deleteUser = async (id) => {
    const reason = prompt('Enter reason for deleting this user:');
    if (reason === null) return;

    if (!reason.trim()) {
      setMessage('❌ Deletion reason is required');
      return;
    }

    if (!window.confirm('Are you sure you want to move this user to trash?')) return;

    try {
      setActionLoading(true);
      setMessage('');
      
      console.log(`🗑️ Deleting user: ${id}`);
      const response = await adminApi.delete(`/admin/users/${id}`, {
        data: { reason: reason.trim() }
      });
      
      if (response.data.success) {
        setMessage('🗑️ User moved to trash successfully!');
        await refreshAllUsers();
        if (showModal) {
          setShowModal(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 404) {
        setMessage('❌ User not found');
      } else if (error.response?.status === 400) {
        setMessage('❌ ' + (error.response?.data?.message || 'Invalid request'));
      } else {
        setMessage('❌ Failed to delete user: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ===== RESTORE USER =====
  const restoreUser = async (id) => {
    if (!window.confirm('Are you sure you want to restore this user?')) return;

    try {
      setActionLoading(true);
      setMessage('');
      
      console.log(`♻️ Restoring user: ${id}`);
      const response = await adminApi.patch(`/admin/users/${id}/restore`);
      
      if (response.data.success) {
        setMessage('♻️ User restored successfully!');
        await refreshAllUsers();
        if (showModal) {
          setShowModal(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error restoring user:', error);
      if (error.response?.status === 404) {
        setMessage('❌ User not found');
      } else if (error.response?.status === 400) {
        setMessage('❌ ' + (error.response?.data?.message || 'Invalid request'));
      } else {
        setMessage('❌ Failed to restore user: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ===== PERMANENTLY DELETE USER =====
  const permanentDeleteUser = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to permanently delete this user? This action cannot be undone!')) return;

    try {
      setActionLoading(true);
      setMessage('');
      
      console.log(`💀 Permanently deleting user: ${id}`);
      const response = await adminApi.delete(`/admin/users/${id}/permanent`);
      
      if (response.data.success) {
        setMessage('💀 User permanently deleted!');
        await refreshAllUsers();
        if (showModal) {
          setShowModal(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      if (error.response?.status === 404) {
        setMessage('❌ User not found');
      } else if (error.response?.status === 400) {
        setMessage('❌ ' + (error.response?.data?.message || 'Invalid request'));
      } else {
        setMessage('❌ Failed to permanently delete user: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ===== BLOCK USER =====
  const blockUser = async (id) => {
    const reason = prompt('Enter reason for blocking this user:');
    if (!reason) return;

    try {
      setActionLoading(true);
      const response = await adminApi.patch(`/admin/users/${id}/block`, { reason });
      if (response.data.success) {
        setMessage('✅ User blocked successfully!');
        await refreshAllUsers();
        if (showModal) {
          setShowModal(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      setMessage('❌ Failed to block user');
    } finally {
      setActionLoading(false);
    }
  };

  // ===== UNBLOCK USER =====
  const unblockUser = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;

    try {
      setActionLoading(true);
      const response = await adminApi.patch(`/admin/users/${id}/unblock`);
      if (response.data.success) {
        setMessage('✅ User unblocked successfully!');
        await refreshAllUsers();
        if (showModal) {
          setShowModal(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      setMessage('❌ Failed to unblock user');
    } finally {
      setActionLoading(false);
    }
  };

  // ===== FLAG USER =====
  const flagUser = async (id) => {
    const reason = prompt('Enter reason for flagging this user:');
    if (!reason) return;

    try {
      const response = await adminApi.post(`/admin/users/${id}/flag`, { reason });
      if (response.data.success) {
        setMessage('🚩 User flagged successfully!');
        await refreshAllUsers();
        if (showModal) {
          setShowModal(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error flagging user:', error);
      setMessage('❌ Failed to flag user');
    }
  };

  // ===== UNFLAG USER =====
  const unflagUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove the flag from this user?')) return;

    try {
      setActionLoading(true);
      const response = await adminApi.post(`/admin/users/${id}/unflag`);
      if (response.data.success) {
        setMessage('✅ User unflagged successfully!');
        await refreshAllUsers();
        if (showModal) {
          setShowModal(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error unflagging user:', error);
      setMessage('❌ Failed to unflag user');
    } finally {
      setActionLoading(false);
    }
  };

  // ===== VERIFY AGENT =====
  const verifyAgent = async (id) => {
    try {
      const response = await adminApi.patch(`/admin/users/${id}/verify-agent`);
      if (response.data.success) {
        setMessage('✅ Agent verified successfully!');
        await refreshAllUsers();
      }
    } catch (error) {
      console.error('Error verifying agent:', error);
      setMessage('❌ Failed to verify agent');
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeUserDetails = () => {
    setShowModal(false);
    setSelectedUser(null);
    document.body.style.overflow = 'unset';
  };

  const getTrustScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrustScoreBg = (score) => {
    if (score >= 70) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
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

  const displayUsers = viewMode === 'trash' ? trashUsers : users;
  const totalActive = users.length;
  const totalTrash = trashUsers.length;

  const filteredUsers = displayUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {viewMode === 'trash' ? 'Trash' : 'Users'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {viewMode === 'trash' 
              ? `Trashed users (${totalTrash})` 
              : `Manage all users (${totalActive})`
            }
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle View Mode */}
          <button
            onClick={() => {
              setViewMode(viewMode === 'active' ? 'trash' : 'active');
              refreshAllUsers();
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'trash'
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {viewMode === 'trash' ? `Active Users (${totalActive})` : `Trash (${totalTrash})`}
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>

          <button
            onClick={refreshAllUsers}
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
          message.includes('🚩') ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400' :
          message.includes('🗑️') ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400' :
          message.includes('♻️') ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400' :
          message.includes('💀') ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400' :
          'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
        }`}>
          {message}
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {viewMode === 'trash' ? 'Trash is empty' : 'No users found'}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* User Info */}
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 ${
                    user.isDeleted ? 'bg-gray-500' :
                    user.isBlocked ? 'bg-red-600' : 
                    user.isFlagged ? 'bg-yellow-600' : 
                    'bg-primary-600'
                  }`}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                      {user.isDeleted && (
                        <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                          Deleted
                        </span>
                      )}
                      {user.isBlocked && !user.isDeleted && (
                        <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                          Blocked
                        </span>
                      )}
                      {user.isFlagged && !user.isDeleted && (
                        <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                          Flagged
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-0.5">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        <Mail className="w-3 h-3 inline mr-1" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="w-3 h-3 inline mr-1" />
                          {user.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Joined: {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges & Actions - Simple Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {!user.isDeleted && (
                    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  )}

                  {!user.isDeleted && (
                    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getTrustScoreBg(user.trustScore)} ${getTrustScoreColor(user.trustScore)}`}>
                      {user.trustScore || 0}%
                    </span>
                  )}

                  <div className="flex flex-wrap gap-1">
                    <button 
                      onClick={() => openUserDetails(user)}
                      className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    >
                      View
                    </button>

                    {user.isDeleted ? (
                      <>
                        <button 
                          onClick={() => restoreUser(user._id)}
                          disabled={actionLoading}
                          className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                        >
                          Restore
                        </button>
                        <button 
                          onClick={() => permanentDeleteUser(user._id)}
                          disabled={actionLoading}
                          className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        {!user.isVerifiedAgent && (
                          <button 
                            onClick={() => verifyAgent(user._id)}
                            className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          >
                            Verify
                          </button>
                        )}
                        
                        {!user.isFlagged && (
                          <button 
                            onClick={() => flagUser(user._id)}
                            className="px-2 py-1 text-xs font-medium text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                          >
                            Flag
                          </button>
                        )}
                        
                        {user.isFlagged && (
                          <button 
                            onClick={() => unflagUser(user._id)}
                            className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          >
                            Unflag
                          </button>
                        )}
                        
                        {user.isBlocked ? (
                          <button 
                            onClick={() => unblockUser(user._id)}
                            className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button 
                            onClick={() => blockUser(user._id)}
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            Block
                          </button>
                        )}
                        <button 
                          onClick={() => deleteUser(user._id)}
                          disabled={actionLoading}
                          className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== USER DETAILS MODAL ===== */}
      {showModal && selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeUserDetails();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-up">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start z-10">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {selectedUser.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {selectedUser.email}
                </p>
              </div>
              <button 
                onClick={closeUserDetails}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Status */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedUser.isDeleted ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' :
                  selectedUser.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  selectedUser.isFlagged ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {selectedUser.isDeleted ? 'Deleted' : selectedUser.isBlocked ? 'Blocked' : selectedUser.isFlagged ? 'Flagged' : 'Active'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedUser.isVerifiedAgent ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {selectedUser.isVerifiedAgent ? 'Verified Agent' : 'User'}
                </span>
                {!selectedUser.isDeleted && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedUser.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedUser.emailVerified ? 'Email Verified' : 'Email Pending'}
                  </span>
                )}
              </div>

              {/* Block Reason */}
              {selectedUser.blockedReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">Block Reason</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{selectedUser.blockedReason}</p>
                </div>
              )}

              {/* Flag Reason */}
              {selectedUser.flagReason && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Flag Reason</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{selectedUser.flagReason}</p>
                </div>
              )}

              {/* Deleted Reason */}
              {selectedUser.deletedReason && (
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Deleted Reason</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.deletedReason}</p>
                </div>
              )}

              {/* User Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Agency</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.agency || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trust Score</p>
                  <p className={`text-sm font-semibold ${getTrustScoreColor(selectedUser.trustScore)}`}>
                    {selectedUser.trustScore || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Flags</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.flags || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Listings</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedUser.totalListings || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-2 sm:gap-3">
              {selectedUser.isDeleted ? (
                <>
                  <button
                    onClick={() => restoreUser(selectedUser._id)}
                    disabled={actionLoading}
                    className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => permanentDeleteUser(selectedUser._id)}
                    disabled={actionLoading}
                    className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Delete</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Unflag Button */}
                  {selectedUser.isFlagged && (
                    <button
                      onClick={() => unflagUser(selectedUser._id)}
                      disabled={actionLoading}
                      className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Unflag</span>
                    </button>
                  )}

                  {/* Flag Button */}
                  {!selectedUser.isFlagged && (
                    <button
                      onClick={() => flagUser(selectedUser._id)}
                      className="flex-1 min-w-[100px] bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm"
                    >
                      <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Flag</span>
                    </button>
                  )}

                  {/* Block/Unblock */}
                  {selectedUser.isBlocked ? (
                    <button
                      onClick={() => unblockUser(selectedUser._id)}
                      disabled={actionLoading}
                      className="flex-1 min-w-[100px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Unblock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser(selectedUser._id)}
                      disabled={actionLoading}
                      className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Ban className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Block</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(selectedUser._id)}
                    disabled={actionLoading}
                    className="flex-1 min-w-[100px] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Delete</span>
                  </button>
                </>
              )}

              <button
                onClick={closeUserDetails}
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

export default UsersManagement;