import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, ShoppingBag, Trash2, HeartOff, 
  Video, Home, MapPin, Bed, Bath, Square,
  Play, X, Maximize2, Minimize2
} from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import PropertyCard from '../components/properties/PropertyCard';
import { formatCurrencyShort } from '../utils/formatCurrency';
import { FaYoutube } from 'react-icons/fa';

const Favorites = () => {
  const { favorites, clearFavorites, favoriteCount, toggleFavorite } = useFavorites();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if a property is a video property
  const isVideoProperty = (property) => {
    if (!property) return false;
    return !!(property.videoId || 
              property.isVideo === true || 
              (property._id && typeof property._id === 'string' && property._id.startsWith('video_')) ||
              (property.id && typeof property.id === 'string' && property.id.startsWith('video_')));
  };

  const openVideoModal = (property) => {
    setSelectedVideo(property);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  // Handle unsave from favorites
  const handleUnsave = (property, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🗑️ Unsave clicked for:', property.title);
    toggleFavorite(property);
  };

  // Render a video card with unsave button
  const VideoCard = ({ property }) => {
    const isFavorite = true; // Always true since it's in favorites list
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="relative h-48 sm:h-56 overflow-hidden cursor-pointer group">
          <img
            src={property.images?.[0] || property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {/* Play Button Overlay */}
          <div 
            onClick={() => openVideoModal(property)}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <div className="bg-red-600/90 hover:bg-red-600 rounded-full p-4 transform scale-90 group-hover:scale-110 transition-all duration-300">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
          
          {/* Video Badge */}
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Video</span>
          </div>

          {/* Unsave Button - Top Right */}
          <div className="absolute top-3 right-3 z-20 flex flex-col items-end space-y-1">
            <button
              onClick={(e) => handleUnsave(property, e)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-1"
              aria-label="Remove from favorites"
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>Unsave</span>
            </button>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-baseline justify-between">
                <span className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrencyShort(property.price)}
                </span>
                <button
                  onClick={(e) => handleUnsave(property, e)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center space-x-0.5 transition-colors"
                >
                  <Heart className="w-3 h-3 fill-current" />
                  <span>Saved</span>
                  <span className="text-[10px] ml-0.5">✕</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
            <div className="flex items-center space-x-1">
              <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{property.bedrooms || 0} beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{property.bathrooms || 0} baths</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{property.sqft || 0} sqft</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Video className="w-3 h-3" />
              <span>Video Tour Available</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleUnsave(property, e)}
                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center space-x-0.5 transition-colors"
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>Unsave</span>
              </button>
              <button
                onClick={() => openVideoModal(property)}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Watch</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
              My Favorites
            </h1>
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              {favoriteCount}
            </span>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center space-x-1 text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <HeartOff className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start saving properties you love by clicking the heart icon on any property.
            </p>
            <Link
              to="/properties"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Properties</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {favorites.map((property) => {
                const propertyId = property._id || property.id || Math.random().toString();
                const isVideo = isVideoProperty(property);
                
                if (isVideo) {
                  return <VideoCard key={propertyId} property={property} />;
                }
                return <PropertyCard key={propertyId} property={property} />;
              })}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                You have <span className="font-semibold text-red-500">{favoriteCount}</span> saved {favoriteCount === 1 ? 'property' : 'properties'}
              </span>
              <button
                onClick={clearFavorites}
                className="text-red-500 hover:text-red-700 font-medium transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Favorites</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* YouTube Video Modal */}
      {isModalOpen && selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeVideoModal();
            }
          }}
        >
          <div className="relative w-full max-w-5xl">
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 sm:-top-14 right-0 text-white hover:text-red-500 transition-colors p-2 group"
              aria-label="Close video"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors hidden sm:inline">
                  Close
                </span>
                <div className="bg-red-600 hover:bg-red-700 rounded-full p-2 sm:p-3 transition-colors shadow-lg">
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </button>

            <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 pr-16 sm:pr-20">
              {selectedVideo.videoTitle || selectedVideo.title}
            </h3>

            <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={getYouTubeEmbedUrl(selectedVideo.videoId)}
                title={selectedVideo.videoTitle || selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-gray-300 transition-colors p-1"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <div className="w-px h-6 bg-white/20"></div>
                <button
                  onClick={closeVideoModal}
                  className="text-white hover:text-red-500 transition-colors flex items-center space-x-2 p-1"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Close</span>
                </button>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">{selectedVideo.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-300">{selectedVideo.location}</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-base sm:text-lg font-bold text-primary-400">
                    {formatCurrencyShort(selectedVideo.price)}
                    <span className="text-xs sm:text-sm font-normal text-gray-300 ml-1">/ {selectedVideo.priceType || 'day'}</span>
                  </span>
                  <Link
                    to={`/property/${selectedVideo.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                    onClick={closeVideoModal}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <button
              onClick={closeVideoModal}
              className="sm:hidden w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Close Video</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;