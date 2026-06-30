import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

// Create the context
const SearchContext = createContext();

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Search Provider component
export const SearchProvider = ({ children }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    furnished: '',
  });
  const [isSearching, setIsSearching] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsSearching(true);
    try {
      const response = await axios.get('http://localhost:5000/api/properties');
      setAllProperties(response.data);
      setSearchResults(response.data);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setAllProperties([]);
      setSearchResults([]);
      setDataLoaded(true);
    } finally {
      setIsSearching(false);
    }
  };

  const performSearch = useCallback((params = searchParams) => {
    setIsSearching(true);
    
    let results = [...allProperties];

    const hasFilters = params.location || 
                      params.propertyType || 
                      params.listingType || 
                      params.minPrice || 
                      params.maxPrice || 
                      params.bedrooms || 
                      params.bathrooms || 
                      (params.amenities && params.amenities.length > 0) || 
                      params.furnished;

    if (!hasFilters) {
      setSearchResults(allProperties);
      setIsSearching(false);
      return;
    }

    if (params.location) {
      const locationLower = params.location.toLowerCase();
      results = results.filter(p => 
        p.location?.toLowerCase().includes(locationLower) ||
        p.location?.split(',')[0].toLowerCase().includes(locationLower)
      );
    }

    if (params.propertyType) {
      results = results.filter(p => p.propertyType === params.propertyType || p.type === params.propertyType);
    }

    if (params.listingType) {
      results = results.filter(p => p.listingType === params.listingType);
    }

    if (params.minPrice) {
      results = results.filter(p => p.price >= parseInt(params.minPrice));
    }
    if (params.maxPrice) {
      results = results.filter(p => p.price <= parseInt(params.maxPrice));
    }

    if (params.bedrooms) {
      results = results.filter(p => p.bedrooms >= parseInt(params.bedrooms));
    }

    if (params.bathrooms) {
      results = results.filter(p => p.bathrooms >= parseInt(params.bathrooms));
    }

    if (params.amenities && params.amenities.length > 0) {
      results = results.filter(p => 
        params.amenities.every(amenity => 
          p.amenities?.includes(amenity) || p.selectedAmenities?.includes(amenity)
        )
      );
    }

    if (params.furnished) {
      const isFurnished = params.furnished === 'furnished';
      results = results.filter(p => p.furnished === isFurnished);
    }

    setSearchResults(results);
    setIsSearching(false);
  }, [searchParams, allProperties]);

  const clearSearch = useCallback(() => {
    setSearchParams({
      location: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      furnished: '',
    });
    setSearchResults(allProperties);
    setIsSearching(false);
  }, [allProperties]);

  return (
    <SearchContext.Provider value={{
      searchParams,
      setSearchParams,
      searchResults,
      setSearchResults,
      isSearching,
      performSearch,
      clearSearch,
      allProperties,
      dataLoaded,
      fetchProperties,
    }}>
      {children}
    </SearchContext.Provider>
  );
};

// Also export the context if needed
export { SearchContext };