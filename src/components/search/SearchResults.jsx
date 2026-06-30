import React, { useEffect } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import PropertyCard from '../properties/PropertyCard';
import { Search, X } from 'lucide-react';

const SearchResults = () => {
  const { searchResults, showResults, isSearching, clearSearch, searchParams } = useSearch();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showResults) {
        clearSearch();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showResults, clearSearch]);

  useEffect(() => {
    if (showResults) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showResults]);

  if (!showResults) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      clearSearch();
    }
  };

  // Handle property card click - close overlay and navigate
  const handlePropertyClick = () => {
    clearSearch();
  };

  return (
    <div 
      className="fixed inset-0 z-40 bg-black/50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="min-h-screen px-3 sm:px-4 py-3 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-3 sm:p-4 md:p-6 relative">
            {/* Header with Close Button */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div className="pr-8 sm:pr-0">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {isSearching ? 'Searching...' : `${searchResults.length} properties found`}
                  {searchParams.location && !isSearching && ` in ${searchParams.location}`}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-3">
                <button
                  onClick={clearSearch}
                  className="p-2 sm:p-3 bg-red-50 hover:bg-red-100 rounded-full transition-colors group flex-shrink-0 border-2 border-red-200 hover:border-red-300"
                  aria-label="Close search results"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 group-hover:text-red-700 transition-colors" />
                </button>
              </div>
            </div>

            {/* Results */}
            {isSearching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 sm:h-56 bg-gray-200"></div>
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {searchResults.map((property) => (
                  <div key={property.id} onClick={handlePropertyClick}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 px-4">
                  Try adjusting your search criteria or location
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 btn-primary"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;