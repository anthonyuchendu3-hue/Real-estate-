import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Bed, Bath, Square, Calendar, 
  Phone, Mail, MessageCircle, Heart, 
  Share2, ChevronLeft, ChevronRight,
  Check, Star, Building2, User
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { properties as allProperties } from '../data/properties';

// Video properties data (only for the HomesWithVideos section)
const VIDEO_PROPERTIES = [
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
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'],
    videoId: 'dQw4w9WgXcQ',
    videoTitle: '1 Bedroom Apartment Tour - Ikeja GRA',
    featured: true,
    type: 'Apartment',
    isVideo: true,
    verified: true,
    furnished: true,
    listingType: 'shortlet',
    description: 'Beautiful 1 bedroom apartment in the heart of Ikeja GRA. Fully furnished with modern amenities.',
    amenities: ['Air Conditioning', 'WiFi', 'Security', 'Parking', 'Gym'],
    agent: {
      name: 'PrimeEstate Agent',
      phone: '+2348001234567',
      email: 'agent@primeestate.ng',
      agency: 'PrimeEstate'
    },
    status: 'Featured'
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
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600'],
    videoId: 'dQw4w9WgXcQ',
    videoTitle: 'Mini Flat Tour - Shonibare Estate',
    featured: false,
    type: 'Mini Flat',
    isVideo: true,
    verified: true,
    furnished: true,
    listingType: 'shortlet',
    description: 'Cozy mini flat perfect for short stays. Located in a quiet estate with 24/7 security.',
    amenities: ['WiFi', 'Security', 'Water Supply', 'TV'],
    agent: {
      name: 'PrimeEstate Agent',
      phone: '+2348001234567',
      email: 'agent@primeestate.ng',
      agency: 'PrimeEstate'
    }
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
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'],
    videoId: 'dQw4w9WgXcQ',
    videoTitle: '2 Bedroom Mini Flat Tour - Ikeja',
    featured: false,
    type: 'Mini Flat',
    isVideo: true,
    verified: true,
    furnished: true,
    listingType: 'shortlet',
    description: 'Spacious 2 bedroom mini flat with modern finishes. Close to shopping centers and restaurants.',
    amenities: ['Air Conditioning', 'WiFi', 'Security', 'Parking', 'Balcony'],
    agent: {
      name: 'PrimeEstate Agent',
      phone: '+2348001234567',
      email: 'agent@primeestate.ng',
      agency: 'PrimeEstate'
    }
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
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'],
    videoId: 'dQw4w9WgXcQ',
    videoTitle: 'Superior Mini Flat Tour',
    featured: false,
    type: 'Mini Flat',
    isVideo: true,
    verified: true,
    furnished: true,
    listingType: 'shortlet',
    description: 'Superior mini flat with premium finishes. Perfect for business travelers and couples.',
    amenities: ['Air Conditioning', 'WiFi', 'Security', 'Kitchen', 'Living Room'],
    agent: {
      name: 'PrimeEstate Agent',
      phone: '+2348001234567',
      email: 'agent@primeestate.ng',
      agency: 'PrimeEstate'
    }
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
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'],
    videoId: 'dQw4w9WgXcQ',
    videoTitle: 'Luxury Apartment Tour - VI',
    featured: true,
    type: 'Luxury Apartment',
    isVideo: true,
    verified: true,
    furnished: true,
    listingType: 'shortlet',
    description: 'Stunning 3 bedroom luxury apartment in Victoria Island. Ocean views with premium amenities.',
    amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Concierge', 'Ocean View'],
    agent: {
      name: 'PrimeEstate Agent',
      phone: '+2348001234567',
      email: 'agent@primeestate.ng',
      agency: 'PrimeEstate'
    },
    status: 'Hot Deal'
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
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'],
    videoId: 'dQw4w9WgXcQ',
    videoTitle: 'Studio Apartment Tour - Lekki',
    featured: false,
    type: 'Studio',
    isVideo: true,
    verified: true,
    furnished: true,
    listingType: 'shortlet',
    description: 'Modern studio apartment in the heart of Lekki. Perfect for singles or couples.',
    amenities: ['WiFi', 'Security', 'AC', 'Kitchenette'],
    agent: {
      name: 'PrimeEstate Agent',
      phone: '+2348001234567',
      email: 'agent@primeestate.ng',
      agency: 'PrimeEstate'
    }
  }
];

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!id) {
        setError('No property ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching property with ID:', id);
        console.log('🔍 ID type:', typeof id);
        
        // ===== STEP 1: Check if it's a video property (starts with 'video_') =====
        if (id.startsWith('video_')) {
          console.log('🎬 This is a video property ID');
          const videoProperty = VIDEO_PROPERTIES.find(p => p._id === id);
          if (videoProperty) {
            console.log('✅ Found video property:', videoProperty.title);
            setProperty(videoProperty);
            setIsFavorite(isFavorited(videoProperty._id));
            setIsLoading(false);
            return;
          }
        }
        
        // ===== STEP 2: Check if it's a real property from the data file =====
        // First check if the ID exists in our local properties data
        const localProperty = allProperties.find(p => {
          // Check by _id or id
          const pId = p._id || String(p.id);
          return pId === id || String(p.id) === id;
        });
        
        if (localProperty) {
          console.log('🏠 Found property in local data:', localProperty.title);
          // Add _id if it doesn't have one
          const propertyWithId = {
            ...localProperty,
            _id: localProperty._id || String(localProperty.id),
            images: localProperty.images || [localProperty.image]
          };
          setProperty(propertyWithId);
          setIsFavorite(isFavorited(propertyWithId._id));
          setIsLoading(false);
          return;
        }
        
        // ===== STEP 3: Try to fetch from API =====
        // Check if it's a valid MongoDB ObjectId (24 hex chars)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        
        if (isValidObjectId) {
          console.log('🔄 Trying API for ObjectId:', id);
          try {
            const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
            console.log('✅ Found property in API:', response.data.title);
            setProperty(response.data);
            setIsFavorite(isFavorited(id));
            setIsLoading(false);
            return;
          } catch (apiError) {
            console.error('❌ API Error:', apiError.response?.status);
            if (apiError.response?.status === 404) {
              setError('Property not found.');
            } else {
              throw apiError;
            }
          }
        }
        
        // ===== STEP 4: Check if numeric ID matches a video property (fallback) =====
        const numericId = parseInt(id);
        if (!isNaN(numericId) && numericId >= 1 && numericId <= 6) {
          console.log('🎬 Checking video properties as fallback for ID:', numericId);
          const videoProperty = VIDEO_PROPERTIES.find(p => p.id === numericId);
          if (videoProperty) {
            console.log('✅ Found video property by numeric ID (fallback):', videoProperty.title);
            setProperty(videoProperty);
            setIsFavorite(isFavorited(videoProperty._id));
            setIsLoading(false);
            return;
          }
        }
        
        // ===== If we get here, property wasn't found =====
        setError('Property not found. It may have been removed or the ID is invalid.');
        
      } catch (error) {
        console.error('❌ Error fetching property:', error);
        if (error.response) {
          setError(error.response.data?.message || `Failed to load property (${error.response.status})`);
        } else if (error.request) {
          setError('Unable to connect to server. Please check your internet connection.');
        } else {
          setError('Failed to load property details. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, isFavorited]);

  const nextImage = () => {
    if (property && property.images) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      navigate('/signup', { state: { from: `/property/${id}` } });
      return;
    }
    
    if (property && !isToggling) {
      setIsToggling(true);
      
      const propertyToSave = {
        ...property,
        _id: property._id || `video_${property.id}`,
        id: property.id,
        images: property.images || [property.image],
        isVideo: property.isVideo || !!property.videoId
      };
      
      toggleFavorite(propertyToSave);
      setIsFavorite(!isFavorite);
      
      setTimeout(() => {
        setIsToggling(false);
      }, 300);
    }
  };

  // WhatsApp function
  const openWhatsApp = (phoneNumber, propertyTitle) => {
    const cleanNumber = phoneNumber?.replace(/[^0-9+]/g, '') || '';
    const message = `Hello, I'm interested in the property: ${propertyTitle}. I found it on PrimeEstate. Can you please provide more information?`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  };

  // Phone call function
  const makePhoneCall = (phoneNumber) => {
    const cleanNumber = phoneNumber?.replace(/[^0-9+]/g, '') || '';
    window.location.href = `tel:${cleanNumber}`;
  };

  // Share function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading property...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/properties')}
            className="btn-primary inline-block"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Property Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="btn-primary inline-block">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  // Check if it's a video property
  const isVideoProperty = property.isVideo || property.videoId;

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Properties</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
          {/* Image Gallery or Video */}
          <div className="relative h-64 sm:h-96 md:h-[500px]">
            {isVideoProperty && property.videoId ? (
              // Show YouTube video for video properties
              <div className="w-full h-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${property.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={property.videoTitle || property.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              // Show image gallery for regular properties
              <>
                <img
                  src={property.images?.[currentImage] || property.image || 'https://via.placeholder.com/800x500'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {currentImage + 1} / {property.images?.length || 1}
                </div>
              </>
            )}

            {/* Video Badge */}
            {isVideoProperty && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                <span>▶</span>
                <span>Video Tour</span>
              </div>
            )}

            {/* Action Buttons - Heart & Share */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button 
                onClick={handleFavoriteToggle}
                disabled={isToggling}
                className={`bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isFavorite ? 'bg-red-500 dark:bg-red-500' : ''
                } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                title={isFavorite ? 'Click to unsave' : 'Click to save'}
              >
                <Heart className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'text-white fill-current' : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                }`} />
              </button>
              
              {isFavorite && (
                <button 
                  onClick={handleFavoriteToggle}
                  disabled={isToggling}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  aria-label="Unsave property"
                >
                  ✕ Unsave
                </button>
              )}
              
              <button 
                onClick={handleShare}
                className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Share property"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(property.price)}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {property.listingType === 'sale' ? 'For Sale' : 
                   property.listingType === 'rent' ? 'For Rent' : 'Shortlet'}
                </span>
                {isFavorite && (
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <Heart className="w-3 h-3 text-red-500 fill-current" />
                    <span className="text-xs text-red-500 font-medium">Saved</span>
                    <button
                      onClick={handleFavoriteToggle}
                      disabled={isToggling}
                      className="text-[10px] text-red-400 hover:text-red-600 transition-colors underline ml-1"
                    >
                      Unsave
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm px-3 py-1 rounded-full">
                {property.type || 'Property'}
              </span>
              {property.verified && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm px-3 py-1 rounded-full flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Verified
                </span>
              )}
              {property.status && (
                <span className={`text-white text-sm px-3 py-1 rounded-full ${
                  property.status === 'Just Listed' ? 'bg-green-500' :
                  property.status === 'Hot Deal' ? 'bg-red-500' :
                  property.status === 'Featured' ? 'bg-amber-500' :
                  'bg-yellow-500'
                }`}>
                  {property.status}
                </span>
              )}
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm px-3 py-1 rounded-full">
                {property.furnished ? 'Furnished' : 'Unfurnished'}
              </span>
              {isVideoProperty && (
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm px-3 py-1 rounded-full flex items-center">
                  <span>▶</span>
                  <span className="ml-1">Video Tour</span>
                </span>
              )}
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Bed className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                <p className="font-semibold text-gray-900 dark:text-white">{property.bedrooms || 0}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Bath className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
                <p className="font-semibold text-gray-900 dark:text-white">{property.bathrooms || 0}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Square className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Square Feet</p>
                <p className="font-semibold text-gray-900 dark:text-white">{property.sqft || 0}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Year Built</p>
                <p className="font-semibold text-gray-900 dark:text-white">{property.yearBuilt || 'N/A'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{property.description || 'No description available.'}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Section */}
            {property.agent && (
              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <span className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Agent</span>
                  </span>
                </h3>
                
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    {/* Agent Avatar */}
                    <div className="flex items-center space-x-4 sm:space-x-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white flex-shrink-0 shadow-md">
                        {property.agent.name?.charAt(0) || 'A'}
                      </div>
                      <div className="sm:hidden">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                          {property.agent.name || 'Agent'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{property.agent.agency || 'Agency'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Agent Details */}
                    <div className="flex-1">
                      <div className="hidden sm:block">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                          {property.agent.name || 'Agent'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{property.agent.agency || 'Agency'}</span>
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700/50 rounded-lg px-3 py-2">
                          <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                          <span>{property.agent.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700/50 rounded-lg px-3 py-2">
                          <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                          <span className="truncate">{property.agent.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => makePhoneCall(property.agent.phone)}
                        className="btn-primary text-sm py-2.5 px-5 flex items-center justify-center space-x-2 rounded-lg"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Agent</span>
                      </button>
                      <button 
                        onClick={() => openWhatsApp(property.agent.phone, property.title)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 px-5 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm hover:shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Agent Rating */}
                  {property.agent.rating && (
                    <div className="flex items-center space-x-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(property.agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">
                        {property.agent.rating}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({property.agent.reviews || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;