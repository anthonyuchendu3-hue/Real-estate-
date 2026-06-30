import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { formatCurrencyShort } from '../../utils/formatCurrency';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';

const PropertyCard = ({ property, onShowAuthPrompt }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  
  // Ensure we have a valid ID - use _id or id or generate one
  const propertyId = property?._id || property?.id;
  
  // If no ID, log warning and return null
  if (!propertyId) {
    console.warn('PropertyCard: No ID found for property:', property);
    return null;
  }
  
  const isFavorite = isFavorited(propertyId);

  const {
    title,
    location,
    price,
    bedrooms,
    bathrooms,
    sqft,
    images,
    status,
    verified,
    listingType,
    type,
  } = property;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('❤️ Favorite clicked for property:', propertyId);
    
    if (!user) {
      if (onShowAuthPrompt) {
        onShowAuthPrompt();
      }
      return;
    }
    
    // Make sure we have all required data
    const propertyToSave = {
      ...property,
      _id: propertyId,
      id: propertyId,
    };
    
    toggleFavorite(propertyToSave);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Just Listed': 'bg-green-500',
      'Hot Deal': 'bg-red-500',
      'Reduced Price': 'bg-yellow-500',
      'Featured': 'bg-amber-500',
    };
    return colors[status] || 'bg-primary-500';
  };

  const getTypeLabel = (type) => {
    const types = {
      luxury: 'Luxury',
      apartment: 'Apartment',
      house: 'House',
      land: 'Land',
      commercial: 'Commercial',
      shortlet: 'Shortlet',
    };
    return types[type] || type || 'Property';
  };

  const imageUrl = images && images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const linkId = propertyId;
  const linkUrl = `/property/${linkId}`;

  return (
    <Link to={linkUrl} className="block group h-full">
      <div className="card h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={title || 'Property'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
          
          {status && (
            <span className={`absolute top-2 sm:top-4 left-2 sm:left-4 ${getStatusColor(status)} text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}>
              {status}
            </span>
          )}

          {verified && (
            <span className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-blue-500 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center">
              ✓ Verified
            </span>
          )}

          <span className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {listingType === 'sale' ? 'For Sale' : listingType === 'rent' ? 'For Rent' : 'Shortlet'}
          </span>

          {/* Favorite Button */}
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10">
            <button 
              onClick={handleFavoriteClick}
              className={`rounded-full p-1.5 sm:p-2 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                isFavorite 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white hover:bg-gray-100 border border-gray-200'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
              ) : (
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1">
              {title || 'Property'}
            </h3>
            <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ml-2">
              {getTypeLabel(type)}
            </span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{location || 'Location not specified'}</span>
          </div>

          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2 sm:mb-3">
            {formatCurrencyShort(price || 0)}
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2 sm:pt-3 mt-auto">
            <div className="flex items-center space-x-1">
              <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{bedrooms || 0} beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{bathrooms || 0} baths</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{sqft || 0} sqm</span>
            </div>
          </div>
          
          {isFavorite && (
            <div className="mt-2 text-[10px] text-red-500 font-medium flex items-center space-x-1">
              <Heart className="w-3 h-3 fill-current" />
              <span>Saved</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;