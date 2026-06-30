import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
import { locations, popularLocations } from '../../data/locations';

const LocationAutocomplete = ({ value, onChange, placeholder = 'Enter location...' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const wrapperRef = useRef(null);

  // Get all locations from the locations data
  const allLocations = Object.values(locations).flat();
  const allStates = Object.keys(locations);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '');
    }
  }, [value]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);

    if (value.length > 0) {
      const searchTerm = value.toLowerCase();
      const filtered = [...allLocations, ...allStates].filter(location =>
        location.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filtered.slice(0, 10));
      setIsOpen(true);
    } else {
      setSuggestions(popularLocations.slice(0, 5));
      setIsOpen(true);
    }
  };

  const handleSelectLocation = (location) => {
    setInputValue(location);
    onChange(location);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none text-gray-900 bg-white"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue.length === 0) {
              setSuggestions(popularLocations.slice(0, 5));
              setIsOpen(true);
            }
          }}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {suggestions.map((location, index) => (
            <button
              key={`${location}-${index}`}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors text-gray-700"
              onClick={() => handleSelectLocation(location)}
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{location}</span>
              {popularLocations.includes(location) && (
                <span className="ml-auto text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  Popular
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;