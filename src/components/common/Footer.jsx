import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, ArrowRight, CheckCircle, PlusCircle } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1500);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 transition-colors duration-300">
      <div className="container-custom py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <Link to="/" className="inline-flex items-center justify-center sm:justify-start space-x-2 mb-4 sm:mb-6 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-display font-bold text-white">
                Prime<span className="text-primary-400">Estate</span>
              </span>
            </Link>
            <p className="mb-4 text-xs sm:text-sm leading-relaxed text-gray-400">
              Nigeria's premier real estate marketplace connecting buyers, sellers, and renters with trusted agents.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:scale-110 transform"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:scale-110 transform"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:scale-110 transform"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:scale-110 transform"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:scale-110 transform"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link to="/properties" className="hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/area-guides" className="hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Area Guides
                </Link>
              </li>
              <li>
                <Link to="/market-insights" className="hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Market Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/list-property" 
                  className="text-primary-400 hover:text-primary-300 transition-colors duration-200 hover:translate-x-1 inline-flex items-center space-x-1 font-medium"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Your Property</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Property Types</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="text-gray-400 cursor-default">
                Luxury Homes
              </li>
              <li className="text-gray-400 cursor-default">
                Apartments
              </li>
              <li className="text-gray-400 cursor-default">
                Land/Plots
              </li>
              <li className="text-gray-400 cursor-default">
                Commercial
              </li>
              <li className="text-gray-400 cursor-default">
                Shortlets
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start justify-center sm:justify-start space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Plot 123, Ahmadu Bello Way, Victoria Island, Lagos</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+2348001234567" className="text-gray-400 hover:text-primary-400 transition-colors">
                  +234 800 123 4567
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@primeestate.ng" className="text-gray-400 hover:text-primary-400 transition-colors">
                  info@primeestate.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              Get the latest property listings and market insights delivered to your inbox.
            </p>
            
            {isSubscribed ? (
              <div className="flex items-center justify-center space-x-2 text-green-400 bg-green-900/20 rounded-lg p-3 max-w-md mx-auto">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm"
                  required
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary text-sm py-2 sm:py-2.5 px-4 sm:px-6 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-400">
          <p>&copy; {currentYear} PrimeEstate Nigeria. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/terms" className="hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;