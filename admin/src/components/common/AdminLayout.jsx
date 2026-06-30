import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminApi from '../../api/adminApi';
import { 
  LayoutDashboard, Building2, Users, Settings, 
  LogOut, Bell, Search, Menu, X, Moon, Sun,
  ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, AlertCircle, UserPlus,
  ChevronUp, PlusCircle
} from 'lucide-react';

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ===== SCROLL TO TOP =====
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(progress);
      
      if (scrollTop > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // ===== FETCH NOTIFICATIONS =====
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await adminApi.get('/admin/notifications');
      console.log('📥 Notifications received:', response.data);
      
      if (response.data && response.data.length > 0) {
        const mappedNotifications = response.data.map(notif => {
          let Icon = Bell;
          let color = 'text-gray-500';
          let bg = 'bg-gray-100 dark:bg-gray-700';
          
          switch (notif.type) {
            case 'pending':
              Icon = Clock;
              color = 'text-yellow-500';
              bg = 'bg-yellow-50 dark:bg-yellow-900/20';
              break;
            case 'approved':
              Icon = CheckCircle;
              color = 'text-green-500';
              bg = 'bg-green-50 dark:bg-green-900/20';
              break;
            case 'rejected':
              Icon = XCircle;
              color = 'text-red-500';
              bg = 'bg-red-50 dark:bg-red-900/20';
              break;
            case 'user':
              Icon = UserPlus;
              color = 'text-blue-500';
              bg = 'bg-blue-50 dark:bg-blue-900/20';
              break;
            case 'info':
              Icon = AlertCircle;
              color = 'text-purple-500';
              bg = 'bg-purple-50 dark:bg-purple-900/20';
              break;
            default:
              Icon = Bell;
              color = 'text-gray-500';
              bg = 'bg-gray-100 dark:bg-gray-700';
          }
          
          return {
            ...notif,
            id: notif._id || notif.id,
            icon: Icon,
            color: color,
            bg: bg,
            time: new Date(notif.createdAt).toLocaleString()
          };
        });
        
        setNotifications(mappedNotifications);
        const unread = mappedNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Add touch support
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminTheme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = async (id) => {
    try {
      await adminApi.patch(`/admin/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      const remainingUnread = notifications.filter(n => n.id !== id && !n.read).length;
      setUnreadCount(remainingUnread);
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await adminApi.patch('/admin/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
    }
  };

  // ===== FIX: Handle notification click for both desktop and mobile =====
  const handleNotificationClick = (notification, e) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🔔 Notification clicked:', notification.title);
    
    // Mark as read first
    markAsRead(notification.id);
    
    // Close the dropdown
    setNotificationsOpen(false);
    
    // Navigate after a small delay to allow the dropdown to close
    if (notification.link) {
      setTimeout(() => {
        navigate(notification.link);
      }, 150);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/properties', icon: Building2, label: 'Properties' },
    { path: '/properties/add', icon: PlusCircle, label: 'Add Property' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/properties/add') {
      return location.pathname === '/properties/add';
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  // ===== NOTIFICATION DROPDOWN - MOBILE FRIENDLY =====
  const NotificationDropdown = () => (
    <div className="absolute right-0 mt-2 w-screen max-w-[calc(100vw-2rem)] sm:w-96 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto max-h-[60vh]">
        {loadingNotifications ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
            <p className="text-xs mt-1">New notifications will appear here</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id || notification._id}
                onClick={(e) => handleNotificationClick(notification, e)}
                onTouchEnd={(e) => {
                  // Handle touch events for mobile
                  e.preventDefault();
                  handleNotificationClick(notification, e);
                }}
                className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer active:bg-gray-100 dark:active:bg-gray-700 ${
                  !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${notification.bg} flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center sticky bottom-0 bg-white dark:bg-gray-800">
        <button
          onClick={() => setNotificationsOpen(false)}
          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ===== MOBILE HEADER ===== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-14 flex items-center justify-between px-3 shadow-sm transition-colors duration-300">
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="ml-2 flex items-center">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="ml-1.5 text-lg font-bold text-gray-900 dark:text-white">
              Prime<span className="text-primary-600">Admin</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {/* ===== MOBILE NOTIFICATION BELL WITH DROPDOWN ===== */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {/* Mobile Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-screen max-w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto max-h-[60vh]">
                  {loadingNotifications ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm">Loading notifications...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                      <p className="text-xs mt-1">New notifications will appear here</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={notification.id || notification._id}
                          onClick={(e) => handleNotificationClick(notification, e)}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            handleNotificationClick(notification, e);
                          }}
                          className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer active:bg-gray-100 dark:active:bg-gray-700 ${
                            !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                          }`}
                          style={{ touchAction: 'manipulation' }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${notification.bg} flex-shrink-0 mt-0.5`}>
                              <Icon className={`w-4 h-4 ${notification.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center sticky bottom-0 bg-white dark:bg-gray-800">
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {admin?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </header>

      {/* ===== MOBILE SIDEBAR ===== */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
              Prime<span className="text-primary-600">Admin</span>
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-7rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                <span className={`text-sm font-medium ${active ? 'text-primary-600 dark:text-primary-400' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center overflow-hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Prime<span className="text-primary-600">Admin</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                {sidebarOpen && <span className={`font-medium ${active ? 'text-primary-600 dark:text-primary-400' : ''}`}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-400" />
                  {sidebarOpen && <span className="text-sm text-gray-600 dark:text-gray-300">Light Mode</span>}
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  {sidebarOpen && <span className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>}
                </>
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 items-center justify-between px-6 fixed top-0 right-0 left-0 z-20 transition-colors duration-300" style={{ left: sidebarOpen ? '16rem' : '5rem' }}>
          <div className="flex items-center flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors duration-300"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            
            {/* ===== DESKTOP NOTIFICATION BELL WITH DROPDOWN ===== */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Desktop Notification Dropdown */}
              {notificationsOpen && <NotificationDropdown />}
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-14 lg:pt-16">
          <div className="p-3 sm:p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ===== SCROLL TO TOP BUTTON ===== */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="Scroll to top"
        >
          <div className="relative">
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray={`${scrollProgress * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default AdminLayout;