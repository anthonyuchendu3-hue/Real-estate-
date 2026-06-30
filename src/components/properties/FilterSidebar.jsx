import React, { useState, useEffect } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { PROPERTY_TYPES, LISTING_TYPES, NIGERIAN_STATES, AMENITIES } from '../../utils/constants';

const FilterSidebar = () => {
  const { searchParams, setSearchParams, performSearch } = useSearch();
  const [localParams, setLocalParams] = useState(searchParams);

  useEffect(() => {
    setLocalParams(searchParams);
  }, [searchParams]);

  const handleInputChange = (field, value) => {
    setLocalParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setLocalParams(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleApplyFilters = () => {
    setSearchParams(localParams);
    performSearch(localParams);
  };

  const handleClearFilters = () => {
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
    setLocalParams(emptyParams);
    setSearchParams(emptyParams);
    performSearch(emptyParams);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select 
          className="input-field"
          value={localParams.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {NIGERIAN_STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select 
          className="input-field"
          value={localParams.propertyType}
          onChange={(e) => handleInputChange('propertyType', e.target.value)}
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Listing Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Type
        </label>
        <select 
          className="input-field"
          value={localParams.listingType}
          onChange={(e) => handleInputChange('listingType', e.target.value)}
        >
          <option value="">All</option>
          {LISTING_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (₦)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input-field"
            value={localParams.minPrice}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="input-field"
            value={localParams.maxPrice}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <select 
          className="input-field"
          value={localParams.bedrooms}
          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bathrooms
        </label>
        <select 
          className="input-field"
          value={localParams.bathrooms}
          onChange={(e) => handleInputChange('bathrooms', e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Amenities
        </label>
        <div className="space-y-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity.label} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={localParams.amenities.includes(amenity.label)}
                onChange={() => handleAmenityToggle(amenity.label)}
              />
              <span className="text-gray-700">{amenity.icon} {amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnished
        </label>
        <select 
          className="input-field"
          value={localParams.furnished}
          onChange={(e) => handleInputChange('furnished', e.target.value)}
        >
          <option value="">Any</option>
          <option value="furnished">Furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Apply Button */}
      <button 
        className="w-full btn-primary"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;