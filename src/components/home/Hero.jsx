import React, { useState, useEffect } from 'react';
import { Search, Home, ArrowRight } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { PROPERTY_TYPES } from '../../utils/constants';
import LocationAutocomplete from '../common/LocationAutocomplete';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const { searchParams, setSearchParams, performSearch } = useSearch();
  const navigate = useNavigate();
  
  const backgroundImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Update search params with current form values
    const params = {
      location: searchParams.location || '',
      propertyType: searchParams.propertyType || '',
      listingType: searchParams.listingType || '',
      minPrice: searchParams.minPrice || '',
      maxPrice: searchParams.maxPrice || '',
      bedrooms: searchParams.bedrooms || '',
      bathrooms: searchParams.bathrooms || '',
      amenities: searchParams.amenities || [],
      furnished: searchParams.furnished || '',
    };
    
    // Perform search with the params
    performSearch(params);
    // Navigate to properties page
    navigate('/properties');
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrowseAll = () => {
    const emptyParams = {
      location: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      furnished: '',
    };
    setSearchParams(emptyParams);
    performSearch(emptyParams);
    navigate('/properties');
  };

  return (
    <div className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

      <div className="container-custom relative z-10 text-white py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-display font-bold leading-tight mb-3 sm:mb-4 text-center sm:text-left">
            Find Your Dream Property in Nigeria
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 text-center sm:text-left">
            Discover the finest homes, apartments, and commercial spaces across Nigeria's prime locations.
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <LocationAutocomplete
                  value={searchParams.location}
                  onChange={(value) => handleInputChange('location', value)}
                  placeholder="Enter location..."
                />
              </div>

              <div className="relative">
                <Home className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <select 
                  className="w-full px-3 py-2.5 sm:py-3 pl-9 sm:pl-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none text-gray-900 bg-white text-sm sm:text-base appearance-none"
                  value={searchParams.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                >
                  <option value="">Property Type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₦"
                  className="w-full px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none text-gray-900 bg-white text-sm sm:text-base"
                  value={searchParams.minPrice}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max ₦"
                  className="w-full px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none text-gray-900 bg-white text-sm sm:text-base"
                  value={searchParams.maxPrice}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                />
              </div>

              <button 
                type="submit"
                className="btn-primary flex items-center justify-center space-x-2 w-full"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 flex justify-center sm:justify-start">
            <button
              onClick={handleBrowseAll}
              className="text-white/90 hover:text-white flex items-center space-x-2 text-sm sm:text-base transition-colors group"
            >
              <span>Browse All Properties</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="hidden xs:flex flex-wrap gap-4 sm:gap-6 mt-4 sm:mt-6 text-white/90 justify-center sm:justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"></div>
              <span className="text-xs sm:text-sm">500+ Properties</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"></div>
              <span className="text-xs sm:text-sm">50+ Agents</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"></div>
              <span className="text-xs sm:text-sm">10+ Locations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;