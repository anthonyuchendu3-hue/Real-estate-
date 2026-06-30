import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Menu, X, Heart, PlusCircle, LogOut, ArrowRight, Check } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const navigate = useNavigate();
  const { clearSearch } = useSearch();
  const { user, logout } = useAuth();
  const { favoriteCount } = useFavorites();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    { path: '/area-guides', label: 'Area Guides' },
    { path: '/market-insights', label: 'Market Insights' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    if (clearSearch) clearSearch();
    navigate(path);
  };

  const handleAddProperty = () => {
    setIsMenuOpen(false);
    if (clearSearch) clearSearch();
    
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    
    if (user.isBlocked || user.isFlagged) {
      return;
    }
    
    navigate('/list-property');
  };

  const handleFavorites = () => {
    setIsMenuOpen(false);
    if (clearSearch) clearSearch();
    
    if (user) {
      navigate('/favorites');
    } else {
      setShowAuthPrompt(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  // Auth Prompt Modal
  const AuthPrompt = () => {
    if (!showAuthPrompt) return null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeAuthPrompt();
          }
        }}
      >
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 text-center animate-scale-up relative">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            Add Your Property
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            To list your property on PrimeEstate, please create an account or log in.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            It's free and takes less than a minute!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              state={{ from: '/list-property' }}
              onClick={closeAuthPrompt}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <User className="w-4 h-4" />
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              state={{ from: '/list-property' }}
              onClick={closeAuthPrompt}
              className="btn-secondary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <span>Log In</span>
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                state={{ from: '/list-property' }} 
                onClick={closeAuthPrompt}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Log in here
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Check className="w-3 h-3 text-green-500" />
              <span>Free to list</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-3 h-3 text-green-500" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-3 h-3 text-green-500" />
              <span>Trusted platform</span>
            </div>
          </div>

          <button
            onClick={closeAuthPrompt}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const isUserRestricted = user && (user.isBlocked || user.isFlagged);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* ===== LOGO ===== */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group"
              onClick={() => clearSearch && clearSearch()}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              
              <div className="flex flex-col leading-none">
                <span className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold tracking-tight text-primary-600 dark:text-primary-400">
                  Prime
                </span>
                <span className="text-sm sm:text-base md:text-lg font-display font-semibold text-gray-700 dark:text-gray-300 -mt-0.5 tracking-wide">
                  Estate
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors text-sm xl:text-base"
                  onClick={() => clearSearch && clearSearch()}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ===== DESKTOP RIGHT ACTIONS ===== */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <ThemeToggle />
              
              {/* ===== NOTIFICATION BELL - ONLY SHOW WHEN USER IS LOGGED IN ===== */}
              {user && <NotificationBell />}

              {/* Add Property Button - Always show for everyone */}
              {user ? (
                <button 
                  onClick={handleAddProperty}
                  className={`btn-primary text-xs lg:text-sm py-1.5 lg:py-2 px-3 lg:px-5 flex items-center space-x-1 ${
                    isUserRestricted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isUserRestricted}
                  title={isUserRestricted ? 'Your account is restricted' : 'Add a new property'}
                >
                  <PlusCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden xl:inline">Add Property</span>
                  <span className="xl:hidden">Add</span>
                </button>
              ) : (
                <button 
                  onClick={handleAddProperty}
                  className="btn-primary text-xs lg:text-sm py-1.5 lg:py-2 px-3 lg:px-5 flex items-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden xl:inline">Add Property</span>
                  <span className="xl:hidden">Add</span>
                </button>
              )}

              {/* Show badge only for the blocked/flagged user */}
              {isUserRestricted && (
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full flex items-center space-x-1">
                  {user.isBlocked ? '🚫 Blocked' : '🚩 Flagged'}
                </span>
              )}

              {/* Favorites Button with Count */}
              <button 
                onClick={handleFavorites}
                className="p-1.5 lg:p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
                aria-label="Favorites"
              >
                <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] lg:text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/signup" className="btn-primary text-xs lg:text-sm py-1.5 lg:py-2 px-3 lg:px-5">
                  Sign Up
                </Link>
              )}
            </div>

            {/* ===== MOBILE RIGHT ACTIONS ===== */}
            <div className="flex items-center space-x-2 md:hidden">
              <ThemeToggle />
              
              {/* ===== MOBILE NOTIFICATION BELL - ONLY SHOW WHEN USER IS LOGGED IN ===== */}
              {user && <NotificationBell />}

              {/* Add Property Button - Always show for everyone */}
              {user ? (
                <button 
                  onClick={handleAddProperty}
                  className={`btn-primary text-xs py-1.5 px-3 flex items-center space-x-1 ${
                    isUserRestricted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isUserRestricted}
                  title={isUserRestricted ? 'Your account is restricted' : 'Add a new property'}
                  aria-label="Add Property"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="text-xs">Add</span>
                </button>
              ) : (
                <button 
                  onClick={handleAddProperty}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1"
                  aria-label="Add Property"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="text-xs">Add</span>
                </button>
              )}

              {/* If user is blocked or flagged, show small badge */}
              {isUserRestricted && (
                <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                  {user.isBlocked ? '🚫' : '🚩'}
                </span>
              )}

              <button
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* ===== MOBILE MENU ===== */}
          {isMenuOpen && (
            <div className="md:hidden py-3 sm:py-4 border-t border-gray-100 dark:border-gray-800">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className="block w-full text-left py-2.5 sm:py-3 px-3 sm:px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors text-sm sm:text-base"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800 px-3 sm:px-4 space-y-2 sm:space-y-3">
                
                {/* Add Property in Mobile Menu - Always show for everyone */}
                {user ? (
                  <button 
                    onClick={handleAddProperty}
                    className={`w-full btn-primary text-sm sm:text-base py-2 sm:py-2.5 flex items-center justify-center space-x-2 ${
                      isUserRestricted ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isUserRestricted}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Property</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleAddProperty}
                    className="w-full btn-primary text-sm sm:text-base py-2 sm:py-2.5 flex items-center justify-center space-x-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Property</span>
                  </button>
                )}

                {/* If blocked/flagged, show message in mobile menu */}
                {isUserRestricted && (
                  <div className="w-full text-center text-xs text-red-500 dark:text-red-400 py-2 px-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {user.isBlocked ? '🚫 Account Blocked' : '🚩 Account Flagged'}
                  </div>
                )}

                <button
                  onClick={handleFavorites}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                  {favoriteCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {favoriteCount}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      👤 {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center space-x-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/signup"
                    className="block w-full text-center btn-primary text-sm sm:text-base py-2 sm:py-2.5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthPrompt />
    </>
  );
};

export default Navbar;