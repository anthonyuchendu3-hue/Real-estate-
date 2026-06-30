import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, ChevronDown, Search, Filter, 
  Building2, Home, LandPlot, Briefcase,
  Star, Users, TrendingUp, Clock,
  ArrowRight, Heart, Share2
} from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

const AreaGuides = () => {
  const navigate = useNavigate();
  const { setSearchParams, performSearch } = useSearch();
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const cities = [
    { id: 'lagos', name: 'Lagos', count: '245 properties' },
    { id: 'abuja', name: 'Abuja', count: '187 properties' },
    { id: 'rivers', name: 'Port Harcourt', count: '98 properties' },
    { id: 'ibadan', name: 'Ibadan', count: '76 properties' },
    { id: 'benin', name: 'Benin City', count: '54 properties' },
    { id: 'enugu', name: 'Enugu', count: '43 properties' },
    { id: 'kano', name: 'Kano', count: '38 properties' },
    { id: 'awka', name: 'Awka', count: '32 properties' },
  ];

  const propertyTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'luxury', label: 'Luxury Homes' },
    { id: 'apartment', label: 'Apartments' },
    { id: 'house', label: 'Houses' },
    { id: 'land', label: 'Land/Plots' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'shortlet', label: 'Shortlets' },
  ];

  const areaGuides = [
    {
      id: 1,
      city: 'Lagos',
      area: 'Ikoyi',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      price: '₦79M',
      propertyType: '2 Bedroom Terrace (Semi Finished)',
      description: '2 lines available in this prestigious neighborhood with waterfront views.',
      features: ['Waterfront Views', 'Gated Community', '24/7 Security', 'Swimming Pool'],
      properties: 245,
      rating: 4.8,
      trend: '+12.5%'
    },
    {
      id: 2,
      city: 'Abuja',
      area: 'Maitama',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      price: '₦95M',
      propertyType: '4 Bedroom Detached Duplex',
      description: 'Prime location in Abuja\'s diplomatic area with spacious homes.',
      features: ['Diplomatic Zone', 'Large Gardens', 'CCTV', 'Generator'],
      properties: 187,
      rating: 4.9,
      trend: '+15.2%'
    },
    {
      id: 3,
      city: 'Lagos',
      area: 'Victoria Island',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      price: '₦120M',
      propertyType: '3 Bedroom Luxury Apartment',
      description: 'Ocean views and premium amenities in the heart of VI.',
      features: ['Ocean Views', 'Gym', 'Pool', '24/7 Security'],
      properties: 312,
      rating: 4.7,
      trend: '+8.3%'
    },
    {
      id: 4,
      city: 'Lagos',
      area: 'Lekki',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      price: '₦65M',
      propertyType: '3 Bedroom Bungalow',
      description: 'Fast-growing area with modern developments and beaches.',
      features: ['Beach Access', 'Modern Infrastructure', 'Schools Nearby'],
      properties: 423,
      rating: 4.6,
      trend: '+18.7%'
    },
    {
      id: 5,
      city: 'Rivers',
      area: 'Port Harcourt',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      price: '₦45M',
      propertyType: '3 Bedroom Flat',
      description: 'Oil city with growing real estate opportunities.',
      features: ['Business Hub', 'Good Roads', 'Security', 'Schools'],
      properties: 98,
      rating: 4.4,
      trend: '+6.8%'
    },
    {
      id: 6,
      city: 'Abuja',
      area: 'Asokoro',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      price: '₦110M',
      propertyType: '5 Bedroom Mansion',
      description: 'Exclusive area with government and diplomatic residences.',
      features: ['Diplomatic Zone', 'Large Plots', 'Premium Security', 'Luxury Homes'],
      properties: 156,
      rating: 4.9,
      trend: '+14.1%'
    },
    {
      id: 7,
      city: 'Ibadan',
      area: 'Ring Road',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      price: '₦25M',
      propertyType: '4 Bedroom Bungalow',
      description: 'Affordable homes in the heart of the city.',
      features: ['City Center', 'Accessible', 'Schools', 'Hospitals'],
      properties: 76,
      rating: 4.3,
      trend: '+5.2%'
    },
    {
      id: 8,
      city: 'Enugu',
      area: 'Independence Layout',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      price: '₦35M',
      propertyType: '3 Bedroom Detached House',
      description: 'Spacious homes in the capital of the East.',
      features: ['Peaceful Area', 'Good Roads', 'Schools', 'Markets'],
      properties: 43,
      rating: 4.2,
      trend: '+7.3%'
    },
  ];

  // Handle Explore Area click - sets search params and navigates
  const handleExploreArea = (area, city) => {
    // Set search params with location
    const searchParams = {
      location: area,
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      furnished: '',
    };
    
    // Update search context
    setSearchParams(searchParams);
    performSearch(searchParams);
    
    // Navigate to properties page
    navigate('/properties');
  };

  // Handle city filter click
  const handleCityFilter = (city) => {
    setSelectedCity(city);
    if (city !== 'all') {
      const searchParams = {
        location: city.charAt(0).toUpperCase() + city.slice(1),
        propertyType: '',
        listingType: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: '',
        amenities: [],
        furnished: '',
      };
      setSearchParams(searchParams);
      performSearch(searchParams);
      navigate('/properties');
    } else {
      navigate('/properties');
    }
  };

  const filteredGuides = areaGuides.filter(guide => {
    const cityMatch = selectedCity === 'all' || guide.city.toLowerCase() === selectedCity;
    const typeMatch = selectedType === 'all' || guide.propertyType.toLowerCase().includes(selectedType);
    return cityMatch && typeMatch;
  });

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white py-12 sm:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10">
              <MapPin className="w-4 h-4" />
              <span>Area Guides</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Explore Nigerian Cities & Neighborhoods
            </h1>
            <p className="text-primary-100/80 text-lg">
              Discover the best areas to live, invest, and grow your real estate portfolio
            </p>
          </div>
        </div>
      </section>

      {/* Quick Explore Cities */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Explore:</span>
            <button
              onClick={() => handleCityFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCity === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Area Guides
            </button>
            {['Lagos', 'Abuja', 'Rivers'].map((city, index) => (
              <button
                key={index}
                onClick={() => handleCityFilter(city.toLowerCase())}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCity === city.toLowerCase()
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-4 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex-1"></div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{filteredGuides.length} properties found</span>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select 
                  className="input-field"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="all">All Cities</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select 
                  className="input-field"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Min" className="input-field w-1/2" />
                  <input type="text" placeholder="Max" className="input-field w-1/2" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Area Guides Grid */}
      <section className="py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={guide.image} 
                    alt={guide.area}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold text-xl">{guide.price}</span>
                        <p className="text-white/80 text-xs">{guide.propertyType}</p>
                      </div>
                      <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-semibold">{guide.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* City Tag */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {guide.city}
                  </div>

                  {/* Trend Badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {guide.trend}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {guide.area}
                    </h3>
                    <span className="text-xs text-gray-500">{guide.properties} properties</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{guide.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {guide.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                    {guide.features.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        +{guide.features.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleExploreArea(guide.area, guide.city)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      Explore Area
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-gray-400 hover:text-primary-600 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredGuides.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Area Guides Found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-3">
              Need Help Finding the Right Area?
            </h2>
            <p className="text-primary-100 mb-6">
              Our expert agents can help you find the perfect location for your needs
            </p>
            <Link to="/contact" className="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
              <span>Contact an Agent</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AreaGuides;