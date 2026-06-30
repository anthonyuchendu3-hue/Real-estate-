import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Formspree endpoint
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzjpleb';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const data = await response.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Plot 123, Ahmadu Bello Way', 'Victoria Island, Lagos', 'Nigeria'],
      color: 'bg-blue-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+234 800 123 4567', '+234 802 234 5678'],
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@primeestate.ng', 'support@primeestate.ng'],
      color: 'bg-purple-500'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 3:00 PM', 'Sunday: Closed'],
      color: 'bg-orange-500'
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', href: '#', color: 'hover:bg-blue-600' },
    { icon: FaTwitter, label: 'Twitter', href: '#', color: 'hover:bg-sky-500' },
    { icon: FaInstagram, label: 'Instagram', href: '#', color: 'hover:bg-pink-600' },
    { icon: FaYoutube, label: 'YouTube', href: '#', color: 'hover:bg-red-600' },
    { icon: FaLinkedin, label: 'LinkedIn', href: '#', color: 'hover:bg-blue-700' },
  ];

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white py-12 sm:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Contact Us
            </h1>
            <p className="text-primary-100 text-base sm:text-lg">
              Have questions or need assistance? We're here to help you find your dream property.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-md">
                  <div className="flex items-start space-x-3">
                    <div className={`${info.color} rounded-lg p-2 flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 dark:text-gray-400 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                Connect With Us
              </h3>
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-white ${social.color} transition-all duration-300 hover:scale-110`}
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Fill in the form below and we'll get back to you as soon as possible.
              </p>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300 text-sm">
                    Thank you! Your message has been sent successfully.
                  </span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+234 800 123 4567"
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="What is this about?"
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us how we can help you..."
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Find Us Here
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visit our office in Victoria Island, Lagos
              </p>
            </div>
            <div className="relative h-64 sm:h-80 w-full bg-gray-200 dark:bg-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.424636044184!2d3.415519574509443!3d6.451479293595481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b1f1c2b1c2b%3A0x1c2b1c2b1c2b1c2b!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PrimeEstate Office Location"
                className="dark:opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;