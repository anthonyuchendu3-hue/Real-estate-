import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Heart, MapPin, Bed, Bath, Square, 
  ChevronLeft, ChevronRight, TrendingUp, 
  Maximize2, X, Minimize2, User, ArrowRight, Check
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { formatCurrencyShort } from '../../utils/formatCurrency';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomesWithVideos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const videoRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite, favorites } = useFavorites();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // REAL WORKING YOUTUBE VIDEO IDs
  const properties = [
    {
      _id: 'video_1',
      id: 1,
      title: '1 Bedroom Apartment',
      price: 95000,
      priceType: 'day',
      location: '2 Olatubosun Street, Shonibare Estate',
      area: 'Ikeja GRA, Ikeja Lagos',
      code: '9LXGG',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 450,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
      videoId: 'jNQXAC9IVRw', // Me at the zoo - Working
      videoTitle: '1 Bedroom Apartment Tour - Ikeja GRA',
      featured: true,
      type: 'Apartment',
    },
    {
      _id: 'video_2',
      id: 2,
      title: 'Mini Flat Room and Parlour',
      price: 95000,
      priceType: 'day',
      location: '2 Olatubosun Street, Shonibare Estate',
      area: 'Ikeja Lagos',
      code: '8KACN',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 350,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
      videoId: 'jNQXAC9IVRw', // Me at the zoo - Working
      videoTitle: 'Mini Flat Tour - Shonibare Estate',
      featured: false,
      type: 'Mini Flat',
    },
    {
      _id: 'video_3',
      id: 3,
      title: '2 Bedroom Mini Flat',
      price: 142500,
      priceType: 'day',
      location: '2 Olatubosun Street, Shonibare Estate',
      area: 'Ikeja GRA, Ikeja Lagos',
      code: 'OKACK',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 550,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
      videoId: 'jNQXAC9IVRw', // Me at the zoo - Working
      videoTitle: '2 Bedroom Mini Flat Tour - Ikeja',
      featured: false,
      type: 'Mini Flat',
    },
    {
      _id: 'video_4',
      id: 4,
      title: 'Mini Flat Superior Room and Parlour',
      price: 110000,
      priceType: 'day',
      location: '2 Olatubosun Street, Shonibare Estate',
      area: 'Ikeja GRA, Ikeja Lagos',
      code: '3KACS',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 400,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      videoId: 'jNQXAC9IVRw', // Me at the zoo - Working
      videoTitle: 'Superior Mini Flat Tour',
      featured: false,
      type: 'Mini Flat',
    },
    {
      _id: 'video_5',
      id: 5,
      title: '3 Bedroom Luxury Apartment',
      price: 250000,
      priceType: 'day',
      location: 'Victoria Island, Lagos',
      area: 'Victoria Island, Lagos',
      code: '7TGHJ',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 800,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
      videoId: 'jNQXAC9IVRw', // Me at the zoo - Working
      videoTitle: 'Luxury Apartment Tour - VI',
      featured: true,
      type: 'Luxury Apartment',
    },
    {
      _id: 'video_6',
      id: 6,
      title: 'Studio Apartment Shortlet',
      price: 75000,
      priceType: 'day',
      location: 'Lekki Phase 1, Lagos',
      area: 'Lekki, Lagos',
      code: '5PLMN',
      bedrooms: 0,
      bathrooms: 1,
      sqft: 300,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
      videoId: 'jNQXAC9IVRw', // Me at the zoo - Working
      videoTitle: 'Studio Apartment Tour - Lekki',
      featured: false,
      type: 'Studio',
    },
  ];

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const [itemsToShow, setItemsToShow] = useState(getVisibleItems());

  function getVisibleItems() {
    const width = window.innerWidth;
    if (width < 640) return itemsPerView.mobile;
    if (width < 1024) return itemsPerView.tablet;
    return itemsPerView.desktop;
  }

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getVisibleItems());
    };
    window.addEventListener('resize', handleResize);
    
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeVideoModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsToShow >= properties.length ? 0 : prev + itemsToShow
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsToShow < 0 ? properties.length - itemsToShow : prev - itemsToShow
    );
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

  const visibleProperties = properties.slice(currentIndex, currentIndex + itemsToShow);

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  // Show Auth Prompt
  const handleShowAuthPrompt = () => {
    setShowAuthPrompt(true);
  };

  const closeAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  // ===== FAVORITES FUNCTIONS =====
  const handleFavoriteClick = (property, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent duplicate toggles
    if (isToggling) {
      console.log('⏳ Already toggling, skipping...');
      return;
    }
    
    console.log('❤️ Heart clicked for:', property.title);
    
    if (!user) {
      // Show auth prompt instead of navigating
      handleShowAuthPrompt();
      return;
    }
    
    setIsToggling(true);
    
    const propertyId = property._id || `video_${property.id}`;
    
    const propertyData = {
      _id: propertyId,
      id: property.id,
      title: property.title,
      price: property.price,
      priceType: property.priceType,
      location: property.location,
      area: property.area,
      code: property.code,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      images: [property.image],
      type: property.type,
      listingType: 'shortlet',
      verified: false,
      furnished: true,
      status: property.featured ? 'Featured' : '',
      videoId: property.videoId,
      videoTitle: property.videoTitle,
      isVideo: true,
      featured: property.featured,
      agent: {
        name: 'PrimeEstate Agent',
        phone: '+234 800 123 4567',
        email: 'agent@primeestate.ng',
        agency: 'PrimeEstate'
      },
      description: `Video tour of ${property.title} in ${property.area}`
    };
    
    console.log('📹 Toggling favorite for video property:', propertyData.title);
    toggleFavorite(propertyData);
    
    // Reset toggle state after a delay
    setTimeout(() => {
      setIsToggling(false);
    }, 500);
  };

  const isVideoFavorited = (property) => {
    if (!property) return false;
    const id = property._id || `video_${property.id}`;
    return isFavorited(id);
  };

  // Handle unsave from the "Saved" label
  const handleUnsaveClick = (property, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent duplicate toggles
    if (isToggling) {
      console.log('⏳ Already toggling, skipping...');
      return;
    }
    
    if (!user) {
      handleShowAuthPrompt();
      return;
    }
    
    setIsToggling(true);
    
    const propertyId = property._id || `video_${property.id}`;
    
    const propertyData = {
      _id: propertyId,
      id: property.id,
      title: property.title,
      isVideo: true
    };
    
    console.log('🗑️ Unsave clicked for:', property.title);
    toggleFavorite(propertyData);
    
    // Reset toggle state after a delay
    setTimeout(() => {
      setIsToggling(false);
    }, 500);
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
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 text-center animate-scale-up">
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

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors duration-300">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FaYoutube className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
                Homes with Videos
              </h2>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
                NEW
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Watch virtual tours of these amazing properties on YouTube
            </p>
          </div>
          <Link 
            to="/properties" 
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm flex items-center space-x-1 mt-2 sm:mt-0 transition-colors group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {visibleProperties.map((property) => {
              const isFavorite = isVideoFavorited(property);
              
              return (
                <div 
                  key={property.id} 
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                >
                  {/* Image Container */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* ===== PLAY BUTTON - ALWAYS VISIBLE ON MOBILE ===== */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 cursor-pointer
                        ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      onClick={() => openVideoModal(property)}
                    >
                      <div className={`bg-red-600/90 hover:bg-red-600 rounded-full 
                        ${isMobile ? 'p-6 sm:p-5' : 'p-4 sm:p-5'} 
                        transform scale-90 group-hover:scale-110 transition-all duration-300 shadow-2xl`}
                      >
                        <Play className={`${isMobile ? 'w-10 h-10' : 'w-6 h-6 sm:w-8 sm:h-8'} text-white fill-current ml-1`} />
                      </div>
                    </div>

                    {/* Mobile Tap Hint */}
                    {isMobile && (
                      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                        Tap to Watch
                      </div>
                    )}

                    {/* "Watch Video" Badge */}
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 z-10">
                      <FaYoutube className="w-3.5 h-3.5" />
                      <span>Watch Video</span>
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3 z-20 flex flex-col items-end space-y-1">
                      <button 
                        onClick={(e) => handleFavoriteClick(property, e)}
                        disabled={isToggling}
                        className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110
                          ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{
                          backgroundColor: isFavorite ? '#ef4444' : '#ffffff',
                          border: isFavorite ? '2px solid #ef4444' : '1px solid #d1d5db',
                          width: '32px',
                          height: '32px',
                        }}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        title={isFavorite ? 'Click to unsave' : 'Click to save'}
                      >
                        <Heart 
                          size={18}
                          style={{
                            color: isFavorite ? '#ffffff' : '#ef4444',
                            fill: isFavorite ? '#ffffff' : 'none',
                          }}
                        />
                      </button>
                      
                      {isFavorite && (
                        <button
                          onClick={(e) => handleUnsaveClick(property, e)}
                          disabled={isToggling}
                          className={`bg-red-500 hover:bg-red-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap
                            ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                          aria-label="Unsave property"
                        >
                          ✕ Unsave
                        </button>
                      )}
                    </div>

                    {property.featured && (
                      <div className="absolute top-3 right-14 sm:right-16 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
                              {formatCurrencyShort(property.price)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ {property.priceType}</span>
                          </div>
                          {isFavorite && (
                            <button
                              onClick={(e) => handleUnsaveClick(property, e)}
                              disabled={isToggling}
                              className={`text-xs text-red-500 font-medium flex items-center space-x-0.5 hover:text-red-700 transition-colors group/unsave
                                ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Click to unsave"
                            >
                              <Heart className="w-3 h-3 fill-current" />
                              <span className="group-hover/unsave:underline">Saved</span>
                              <span className="text-[10px] ml-0.5 opacity-0 group-hover/unsave:opacity-100 transition-opacity">✕</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-start text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 mr-1" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                      {property.area} • {property.code}
                    </p>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                      <div className="flex items-center space-x-1">
                        <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{property.sqft} sqft</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                        {property.type}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isFavorite && (
                          <button
                            onClick={(e) => handleUnsaveClick(property, e)}
                            disabled={isToggling}
                            className={`text-xs text-red-500 hover:text-red-700 font-medium flex items-center space-x-0.5 transition-colors
                              ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Heart className="w-3 h-3 fill-current" />
                            <span>Saved</span>
                          </button>
                        )}
                        <button
                          onClick={() => openVideoModal(property)}
                          className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center space-x-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                        >
                          <FaYoutube className="w-3.5 h-3.5" />
                          <span>Watch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {properties.length > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 z-10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 z-10"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </>
          )}
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">50+</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Video Tours</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">200+</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Happy Guests</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">4.8★</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Average Rating</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">24/7</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Support</div>
          </div>
        </div>
      </div>

      {/* YouTube Video Modal */}
      {isModalOpen && selectedVideo && (
        <div 
          ref={modalRef}
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
              {selectedVideo.videoTitle}
            </h3>

            <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full"
                src={getYouTubeEmbedUrl(selectedVideo.videoId)}
                title={selectedVideo.videoTitle}
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
                    <span className="text-xs sm:text-sm font-normal text-gray-300 ml-1">/ {selectedVideo.priceType}</span>
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

      {/* Auth Prompt Modal */}
      <AuthPrompt />
    </section>
  );
};

export default HomesWithVideos;