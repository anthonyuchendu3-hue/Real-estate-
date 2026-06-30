import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Building2, MapPin, 
  Calendar, ArrowRight, Star, Clock, Users,
  Home, LandPlot, Briefcase, DollarSign,
  ChevronRight, BarChart3, Zap, Lightbulb,
  Newspaper, BookOpen, Award, Shield,
  Search, Heart, Phone, Mail, MessageCircle
} from 'lucide-react';

const MarketInsights = () => {
  const [activeTab, setActiveTab] = useState('trends');

  const marketStats = [
    { label: 'Average Property Price', value: '₦185M', change: '+12.5%', trend: 'up' },
    { label: 'Properties Listed', value: '2,847', change: '+8.3%', trend: 'up' },
    { label: 'Properties Sold', value: '1,234', change: '-2.1%', trend: 'down' },
    { label: 'Average Days on Market', value: '45', change: '-15.4%', trend: 'up' },
  ];

  const areaGuides = [
    {
      name: 'Ikoyi, Lagos',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
      price: '₦350M+',
      description: 'Luxury neighborhood with waterfront properties and premium amenities.',
      properties: 245
    },
    {
      name: 'Maitama, Abuja',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      price: '₦280M+',
      description: 'Diplomatic area with spacious homes and top security.',
      properties: 187
    },
    {
      name: 'Victoria Island, Lagos',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
      price: '₦300M+',
      description: 'Business hub with luxury apartments and ocean views.',
      properties: 312
    },
    {
      name: 'Lekki, Lagos',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
      price: '₦150M+',
      description: 'Fast-growing area with modern developments and beaches.',
      properties: 423
    },
  ];

  const articles = [
    {
      title: 'Top 5 Real Estate Investment Trends in Nigeria 2026',
      category: 'Market Trends',
      date: 'June 15, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600'
    },
    {
      title: 'How to Choose the Perfect Location for Your Family Home',
      category: 'Home Buying Tips',
      date: 'June 10, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600'
    },
    {
      title: 'Understanding Property Appreciation in Nigerian Cities',
      category: 'Investment Tips',
      date: 'June 5, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'
    },
  ];

  const investmentTips = [
    {
      icon: MapPin,
      title: 'Location Matters',
      description: 'Choose properties in growing areas with good infrastructure and amenities.'
    },
    {
      icon: Building2,
      title: 'Property Type Selection',
      description: 'Consider rental yields, appreciation potential, and maintenance costs.'
    },
    {
      icon: DollarSign,
      title: 'Budget Planning',
      description: 'Factor in all costs: purchase price, legal fees, taxes, and renovations.'
    },
    {
      icon: Shield,
      title: 'Due Diligence',
      description: 'Verify property documents, survey plans, and land titles before purchase.'
    },
  ];

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <BarChart3 className="w-64 h-64 text-white" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Market Insights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              Nigerian Real Estate Market Insights
            </h1>
            <p className="text-lg sm:text-xl text-primary-100/80 leading-relaxed">
              Stay informed with the latest market trends, area guides, and expert investment advice.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/properties" className="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
                <span>Browse Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
                <span>Read Articles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Statistics */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {marketStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center justify-center space-x-1 text-sm mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {[
              { id: 'trends', label: 'Market Trends', icon: TrendingUp },
              { id: 'guides', label: 'Area Guides', icon: MapPin },
              { id: 'tips', label: 'Investment Tips', icon: Lightbulb },
              { id: 'articles', label: 'Articles & News', icon: Newspaper },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8 sm:py-12">
        <div className="container-custom">
          {/* Market Trends Tab */}
          {activeTab === 'trends' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">Current Market Trends</h2>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Updated June 2026
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">Trend {item}</span>
                      <span className="text-green-600 text-sm font-semibold">+{12 + item * 3}%</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Rising Demand in Lagos Suburbs</h3>
                    <p className="text-sm text-gray-600">Properties in Lekki, Ajah, and Magodo are seeing increased interest from buyers.</p>
                    <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                      <span>Read More</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Area Guides Tab */}
          {activeTab === 'guides' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">Area Guides</h2>
                <Link to="/properties" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  View All Areas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {areaGuides.map((area, index) => (
                  <div key={index} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={area.image} 
                        alt={area.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-lg">{area.name}</h3>
                        <p className="text-white/80 text-sm">{area.properties} properties</p>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary-600">
                        {area.price}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{area.description}</p>
                      <div className="mt-3 flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Explore Area</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investment Tips Tab */}
          {activeTab === 'tips' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">Investment Tips</h2>
                <span className="text-sm text-gray-500">Expert advice for smart investing</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {investmentTips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex items-start space-x-4">
                      <div className="bg-primary-100 rounded-lg p-3 flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">Latest Articles & News</h2>
                <span className="text-sm text-gray-500">Stay updated with real estate news</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <div key={index} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {article.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Read Article</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Ready to Make Your Move?
            </h2>
            <p className="text-primary-100 mb-6">
              Browse thousands of verified properties across Nigeria and find your dream home today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/properties" className="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
                <span>Start Searching</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketInsights;