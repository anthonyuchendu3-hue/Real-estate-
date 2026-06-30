import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, ArrowRight, Check, X } from 'lucide-react';

const AuthPrompt = ({ isOpen, onClose, title, description, redirectTo }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 text-center animate-scale-up relative">
        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
          {title || 'Add Your Property'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {description || 'To list your property on PrimeEstate, please create an account or log in.'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          It's free and takes less than a minute!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/signup"
            state={{ from: redirectTo || '/' }}
            onClick={onClose}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
          >
            <User className="w-4 h-4" />
            <span>Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            state={{ from: redirectTo || '/' }}
            onClick={onClose}
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
              state={{ from: redirectTo || '/' }} 
              onClick={onClose}
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
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AuthPrompt;