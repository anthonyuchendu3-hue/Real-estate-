import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Home, Building, LandPlot, Hotel, 
  MapPin, Bed, Bath, Square, 
  DollarSign, Calendar, Check, 
  Upload, X, Plus, Trash2, PlusCircle, ArrowLeft,
  ArrowRight, User, Phone, Mail, Building2, Ban, Flag
} from 'lucide-react';
import { PROPERTY_TYPES, LISTING_TYPES, NIGERIAN_STATES, AMENITIES } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

const ListProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    listingType: '',
    price: '',
    location: '',
    address: '',
    state: '',
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    sqft: '',
    yearBuilt: '',
    furnished: '',
    selectedAmenities: [],
    images: [],
    virtualTour: '',
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    agencyName: '',
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // ===== AUTO-FILL AGENT FIELDS WHEN USER DATA IS AVAILABLE =====
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        agentName: user.name || '',
        agentPhone: user.phone || '',
        agentEmail: user.email || '',
        agencyName: user.agency || '',
      }));
    }
  }, [user]);

  // ===== CHECK IF USER IS BLOCKED OR FLAGGED =====
  if (user?.isBlocked || user?.isFlagged) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            {user?.isBlocked ? (
              <Ban className="w-12 h-12 text-red-600 dark:text-red-400" />
            ) : (
              <Flag className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            )}
          </div>
          
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {user?.isBlocked ? 'Account Blocked' : 'Account Flagged'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {user?.isBlocked 
              ? `Your account has been blocked. Reason: ${user.blockedReason || 'Violation of terms'}`
              : 'Your account has been flagged for suspicious activity. You cannot add properties. Please contact support.'}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            If you believe this is a mistake, please contact our support team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>
            <Link
              to="/contact"
              className="btn-secondary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== IF USER NOT LOGGED IN =====
  if (!user) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlusCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
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
              state={{ from: '/list-property' }}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <User className="w-4 h-4" />
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              state={{ from: '/list-property' }}
              className="btn-secondary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              <span>Log In</span>
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" state={{ from: '/list-property' }} className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
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
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const amenities = prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter(a => a !== amenity)
        : [...prev.selectedAmenities, amenity];
      return { ...prev, selectedAmenities: amenities };
    });
    setError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
    setError('');
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload images to Cloudinary
  const uploadImages = async (images) => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image.file);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let imageUrls = [];
      if (uploadedImages.length > 0) {
        imageUrls = await uploadImages(uploadedImages);
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        price: Number(formData.price),
        location: formData.location || formData.address || formData.state,
        address: formData.address,
        state: formData.state,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        toilets: Number(formData.toilets) || 0,
        sqft: Number(formData.sqft) || 0,
        yearBuilt: Number(formData.yearBuilt) || 0,
        furnished: formData.furnished,
        amenities: formData.selectedAmenities,
        images: imageUrls,
        virtualTour: formData.virtualTour || '',
        agent: {
          name: formData.agentName || user?.name || '',
          phone: formData.agentPhone || user?.phone || '',
          email: formData.agentEmail || user?.email || '',
          agency: formData.agencyName || user?.agency || ''
        },
        status: 'pending',
        verified: false
      };

      const response = await axios.post('http://localhost:5000/api/properties', propertyData);
      
      if (response.status === 201) {
        setShowSuccess(true);
        setFormData({
          title: '',
          description: '',
          propertyType: '',
          listingType: '',
          price: '',
          location: '',
          address: '',
          state: '',
          bedrooms: '',
          bathrooms: '',
          toilets: '',
          sqft: '',
          yearBuilt: '',
          furnished: '',
          selectedAmenities: [],
          images: [],
          virtualTour: '',
          agentName: user?.name || '',
          agentPhone: user?.phone || '',
          agentEmail: user?.email || '',
          agencyName: user?.agency || '',
        });
        setUploadedImages([]);
        setStep(1);
        
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/properties');
        }, 5000); // Increased to 5 seconds to allow reading
      }
    } catch (err) {
      console.error('Error submitting property:', err);
      setError(err.response?.data?.message || 'Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.description || !formData.propertyType || 
          !formData.listingType || !formData.price || !formData.state || !formData.address) {
        setError('Please fill in all required fields before proceeding.');
        return;
      }
    }
    if (step === 4) {
      if (uploadedImages.length === 0) {
        setError('Please upload at least one property image.');
        return;
      }
    }
    if (step === 5) {
      if (!formData.agentName || !formData.agentPhone || !formData.agentEmail || !formData.agencyName) {
        setError('Please fill in all agent contact details.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStepIndicator = () => {
    const steps = ['Property Details', 'Features', 'Amenities', 'Media', 'Contact'];
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((label, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > index + 1 ? 'bg-green-500 text-white' :
                  step === index + 1 ? 'bg-primary-600 text-white' :
                  'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {step > index + 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">{label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 ${
                  step > index + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Property Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Property Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="e.g., Luxury 4-Bedroom Duplex in Ikoyi"
          className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows="4"
          placeholder="Describe your property in detail..."
          className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            name="propertyType"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.propertyType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Property Type</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Listing Type <span className="text-red-500">*</span>
          </label>
          <select
            name="listingType"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.listingType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Listing Type</option>
            {LISTING_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Price (₦) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="number"
            name="price"
            placeholder="Enter price in Naira"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.state}
            onChange={handleInputChange}
            required
          >
            <option value="">Select State</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="e.g., 123, Ahmadu Bello Way"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Property Features</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Bed className="w-4 h-4 inline mr-1" /> Bedrooms
          </label>
          <input
            type="number"
            name="bedrooms"
            placeholder="0"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.bedrooms}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Bath className="w-4 h-4 inline mr-1" /> Bathrooms
          </label>
          <input
            type="number"
            name="bathrooms"
            placeholder="0"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.bathrooms}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Bath className="w-4 h-4 inline mr-1" /> Toilets
          </label>
          <input
            type="number"
            name="toilets"
            placeholder="0"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.toilets}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Square className="w-4 h-4 inline mr-1" /> Square Feet
          </label>
          <input
            type="number"
            name="sqft"
            placeholder="e.g., 450"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.sqft}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" /> Year Built
          </label>
          <input
            type="number"
            name="yearBuilt"
            placeholder="e.g., 2023"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.yearBuilt}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Furnished
          </label>
          <select
            name="furnished"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.furnished}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="furnished">Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Amenities</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Select all amenities available in your property</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {AMENITIES.map((amenity) => (
          <button
            key={amenity.label}
            type="button"
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
              formData.selectedAmenities.includes(amenity.label)
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => handleAmenityToggle(amenity.label)}
          >
            <span className="block text-2xl mb-1">{amenity.icon}</span>
            {amenity.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Media</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Property Images <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 sm:p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="imageUpload"
            onChange={handleImageUpload}
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              PNG, JPG, JPEG up to 10MB each
            </p>
          </label>
        </div>
        
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Property ${index + 1}`}
                  className="w-full h-24 sm:h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Virtual Tour URL (Optional)
        </label>
        <input
          type="url"
          name="virtualTour"
          placeholder="https://your-virtual-tour-link.com"
          className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={formData.virtualTour}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Contact Details</h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Your contact information has been auto-filled from your account. You can edit it below if needed.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Agent/Realtor Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="agentName"
            placeholder="Full name"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.agentName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Agency Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="agencyName"
            placeholder="Agency name"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.agencyName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="agentPhone"
            placeholder="+234 800 123 4567"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.agentPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="agentEmail"
            placeholder="agent@email.com"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.agentEmail}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Add Property
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Fill in the details below to add your property to PrimeEstate
            </p>
          </div>

          {/* ===== UPDATED SUCCESS MESSAGE ===== */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Property submitted successfully! 🎉</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Your property is now pending admin approval. You will be notified once it's approved.
                    Redirecting to properties page...
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8 transition-colors duration-300">
            {renderStepIndicator()}

            <div className="mb-6 sm:mb-8">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
              {step === 5 && renderStep5()}
            </div>

            {/* ===== BUTTONS ===== */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium transition-colors"
                >
                  ← Previous Step
                </button>
              )}
              
              {step < 5 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <span>Next Step →</span>
                </button>
              )}
              
              {step === 5 && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding Property...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      <span>Add Property</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListProperty;