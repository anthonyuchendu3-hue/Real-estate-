import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../properties/PropertyCard';
import { properties } from '../../data/properties';
import { Heart, User, ArrowRight, Check, X } from 'lucide-react';

const FeaturedProperties = () => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Get featured properties and ensure they have proper _id
  const featuredProperties = properties.slice(0, 6).map(property => ({
    ...property,
    _id: property._id || String(property.id),
  }));

  const handleShowAuthPrompt = () => {
    setShowAuthPrompt(true);
  };

  const closeAuthPrompt = () => {
    setShowAuthPrompt(false);
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
              state={{ from: '/' }}
              onClick={closeAuthPrompt}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <User className="w-4 h-4" />
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              state={{ from: '/' }}
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
                state={{ from: '/' }} 
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

  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        {/* Header - Fixed mobile layout */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
              Featured Properties
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Handpicked premium properties across Nigeria
            </p>
          </div>
          <Link 
            to="/properties" 
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold text-sm flex items-center space-x-1 transition-colors group shrink-0 self-start sm:self-auto"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard 
              key={property.id || property._id} 
              property={property} 
              onShowAuthPrompt={handleShowAuthPrompt}
            />
          ))}
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <AuthPrompt />
    </section>
  );
};

export default FeaturedProperties;