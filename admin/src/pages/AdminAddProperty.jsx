import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../api/adminApi';
import { 
  PlusCircle, X, Upload, MapPin, Bed, Bath, Square, 
  DollarSign, Calendar, Home, Building, LandPlot, Hotel,
  Check, AlertCircle, Image, Trash2, ArrowLeft
} from 'lucide-react';
import { PROPERTY_TYPES, LISTING_TYPES, NIGERIAN_STATES, AMENITIES } from '../utils/constants';

const AdminAddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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
    virtualTour: '',
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    agencyName: '',
    status: 'approved',
    verified: true
  });

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

  const uploadImages = async (images) => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image.file);
    });

    try {
      const response = await adminApi.post('/upload/', formData, {
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
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.title || !formData.description || !formData.propertyType || 
        !formData.listingType || !formData.price || !formData.state || !formData.address) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (uploadedImages.length === 0) {
      setError('Please upload at least one property image.');
      setLoading(false);
      return;
    }

    try {
      // Upload images first
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
          name: formData.agentName || 'Admin',
          phone: formData.agentPhone || '+234 800 000 0000',
          email: formData.agentEmail || 'admin@primeestate.ng',
          agency: formData.agencyName || 'PrimeEstate Admin'
        },
        status: formData.status || 'approved',
        verified: formData.verified !== false
      };

      console.log('📤 Sending property data with admin token...');
      const response = await adminApi.post('/properties', propertyData);
      
      if (response.status === 201 || response.status === 200) {
        console.log('✅ Property added successfully!');
        setSuccess(true);
        // Reset form
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
          virtualTour: '',
          agentName: '',
          agentPhone: '',
          agentEmail: '',
          agencyName: '',
          status: 'approved',
          verified: true
        });
        setUploadedImages([]);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/properties');
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Error adding property:', err);
      console.error('📝 Response data:', err.response?.data);
      console.error('📝 Status:', err.response?.status);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to add property. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/properties')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <PlusCircle className="w-6 h-6 text-primary-600" />
              <span>Add New Property</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a new property listing as an admin
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-center space-x-3">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>Property added successfully! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Luxury 4-Bedroom Duplex in Ikoyi"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="price"
                  placeholder="Enter price in Naira"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the property in detail..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
        </div>

        {/* Location */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            <span>Location</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location / Area
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Ikoyi, Victoria Island"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
            <Home className="w-5 h-5 text-primary-600" />
            <span>Features</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Bed className="w-4 h-4 inline mr-1" /> Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.toilets}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Square className="w-4 h-4 inline mr-1" /> Sq Ft
              </label>
              <input
                type="number"
                name="sqft"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.sqft}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" /> Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                placeholder="2023"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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

        {/* Amenities */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Amenities
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {AMENITIES.map((amenity) => (
              <button
                key={amenity.label}
                type="button"
                className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  formData.selectedAmenities.includes(amenity.label)
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => handleAmenityToggle(amenity.label)}
              >
                <span className="block text-xl mb-0.5">{amenity.icon}</span>
                {amenity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
            <Image className="w-5 h-5 text-primary-600" />
            <span>Images <span className="text-red-500">*</span></span>
          </h3>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="adminImageUpload"
              onChange={handleImageUpload}
            />
            <label htmlFor="adminImageUpload" className="cursor-pointer">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                PNG, JPG, JPEG up to 10MB each (Max 10 images)
              </p>
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Virtual Tour */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Virtual Tour (Optional)
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Virtual Tour URL
            </label>
            <input
              type="url"
              name="virtualTour"
              placeholder="https://your-virtual-tour-link.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={formData.virtualTour}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Agent Info */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
            <Building className="w-5 h-5 text-primary-600" />
            <span>Agent / Realtor Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agent Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="agentName"
                placeholder="Full name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.agentEmail}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Admin Settings */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center space-x-2">
            <Check className="w-5 h-5 text-primary-600" />
            <span>Admin Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="approved">Approved (Live)</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verification
              </label>
              <select
                name="verified"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.verified}
                onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.value === 'true' }))}
              >
                <option value="true">Verified ✓</option>
                <option value="false">Not Verified</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== SUBMIT BUTTONS - FIXED ===== */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
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
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProperty;