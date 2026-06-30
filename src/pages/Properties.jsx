import React, { useState, useEffect } from 'react';
import { useSearch } from '../contexts/SearchContext';
import PropertyCard from '../components/properties/PropertyCard';
import { Grid, List, ArrowLeft, Home, Heart, User, ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [viewMode, setViewMode] = useState('grid');
  const { searchResults, performSearch, allProperties, isSearching } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;
  const [isMobile, setIsMobile] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleShowAuthPrompt = () => {
    setShowAuthPrompt(true);
  };

  const closeAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    performSearch();
  }, []);

  // Make sure each property has a valid ID
  const properties = (searchResults.length > 0 ? searchResults : allProperties).map(property => ({
    ...property,
    _id: property._id || property.id || `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    id: property.id || property._id,
  }));

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Prompt Modal Component
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
              state={{ from: '/properties' }}
              onClick={closeAuthPrompt}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <User className="w-4 h-4" />
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              state={{ from: '/properties' }}
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
                state={{ from: '/properties' }} 
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

  if (isSearching && properties.length === 0) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container-custom py-4 sm:py-8">
          <div className="mb-4 sm:hidden">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            </div>
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 w-16 h-10"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 sm:h-56 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom py-4 sm:py-8">
        <div className="mb-4 sm:hidden">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
            <Home className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" />
          </Link>
        </div>

        <div className="hidden sm:block mb-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Properties
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {properties.length} properties found
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              View:
            </span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 shadow-md text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 shadow-md text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {properties.length === 0 && !isSearching ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No properties found</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Go Back Home</span>
            </Link>
          </div>
        ) : (
          <>
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
                : 'grid-cols-1 gap-4'
            }`}>
              {currentProperties.map((property) => (
                viewMode === 'grid' ? (
                  <PropertyCard key={property._id || property.id} property={property} onShowAuthPrompt={handleShowAuthPrompt} />
                ) : (
                  <div key={property._id || property.id} className="card flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                      <img
                        src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <PropertyCard property={property} onShowAuthPrompt={handleShowAuthPrompt} />
                    </div>
                  </div>
                )
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center flex-wrap gap-1 sm:gap-2 mt-8 sm:mt-10">
                <button
                  className="px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 sm:px-4 py-2 text-sm border rounded-lg transition-colors ${
                      currentPage === index + 1
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  className="px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}

            {isMobile && (
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Home</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <AuthPrompt />
    </div>
  );
};

export default Properties;