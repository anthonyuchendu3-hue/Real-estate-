import React from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Search, 
  MessageSquare, 
  Building2,
  MapPin,
  Home,
  LandPlot,
  ArrowRight,
  Sparkles,
  Star,
  User,
  Phone,
  Mail,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AppPromo = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find properties with advanced filters and AI-powered recommendations'
    },
    {
      icon: MessageSquare,
      title: 'Instant Chat',
      description: 'Connect directly with agents and property owners in real-time'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Access property trends, pricing data, and investment analysis'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Verified properties and trusted agents for peace of mind'
    }
  ];

  const countries = ['Nigeria', 'Kenya', 'Zimbabwe', 'Uganda'];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-primary-500/5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Mobile App</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
              Get more done with<br />
              <span className="text-primary-300">our app.</span>
            </h2>

            {/* Description */}
            <p className="text-primary-100/80 text-base sm:text-lg mb-6 max-w-lg">
              Unlock exclusive features: save searches, track inquiries more with our app
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <Link 
                to="#" 
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-5 sm:px-6 py-3 sm:py-3.5 flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:border-white/40"
              >
                <div className="bg-white/20 rounded-lg p-1.5">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-primary-100/70">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </Link>

              <Link 
                to="#" 
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-5 sm:px-6 py-3 sm:py-3.5 flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:border-white/40"
              >
                <div className="bg-white/20 rounded-lg p-1.5">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-primary-100/70">GET IT ON</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </Link>
            </div>

            {/* Countries */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-primary-100/60 text-sm">Available in:</span>
              {countries.map((country, index) => (
                <React.Fragment key={country}>
                  <span className="text-white text-sm font-medium">{country}</span>
                  {index < countries.length - 1 && (
                    <span className="text-primary-300/30">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="flex items-center space-x-4 text-primary-100/60 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="text-white">4.9/5</span>
              <span className="text-primary-100/50">•</span>
              <span>10k+ reviews</span>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-64 sm:w-72 md:w-80">
                {/* Phone Body */}
                <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800">
                  <div className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-[2rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-4 pt-3 pb-2">
                      <span className="text-white text-xs">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20"></div>
                        <div className="w-5 h-3.5 rounded-full border border-white/20 flex items-center px-0.5">
                          <div className="w-3 h-2 bg-white/20 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="px-4 pb-4">
                      {/* App Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center">
                            <Home className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-white text-xs font-bold">PrimeEstate</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-primary-400/50 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-primary-400/30 rounded-full"></div>
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="bg-white/10 rounded-lg px-3 py-2 mb-3 flex items-center space-x-2">
                        <Search className="w-3.5 h-3.5 text-primary-200" />
                        <span className="text-primary-200/60 text-[10px]">Search properties...</span>
                      </div>

                      {/* Property Cards */}
                      <div className="space-y-2">
                        <div className="bg-white/5 rounded-lg p-2.5 flex items-start space-x-2.5">
                          <div className="w-10 h-10 bg-primary-500/30 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="h-2 bg-white/10 rounded w-3/4 mb-1"></div>
                            <div className="h-1.5 bg-white/5 rounded w-1/2 mb-1"></div>
                            <div className="h-2 bg-primary-400/30 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 flex items-start space-x-2.5">
                          <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="h-2 bg-white/10 rounded w-2/3 mb-1"></div>
                            <div className="h-1.5 bg-white/5 rounded w-1/2 mb-1"></div>
                            <div className="h-2 bg-purple-400/30 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 flex items-start space-x-2.5">
                          <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="h-2 bg-white/10 rounded w-3/4 mb-1"></div>
                            <div className="h-1.5 bg-white/5 rounded w-1/2 mb-1"></div>
                            <div className="h-2 bg-blue-400/30 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Nav */}
                      <div className="flex justify-between mt-3 pt-2 border-t border-white/5">
                        <div className="flex flex-col items-center">
                          <Home className="w-3.5 h-3.5 text-primary-400" />
                          <span className="text-[6px] text-primary-400 mt-0.5">Home</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Search className="w-3.5 h-3.5 text-white/30" />
                          <span className="text-[6px] text-white/30 mt-0.5">Search</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MessageSquare className="w-3.5 h-3.5 text-white/30" />
                          <span className="text-[6px] text-white/30 mt-0.5">Chat</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <User className="w-3.5 h-3.5 text-white/30" />
                          <span className="text-[6px] text-white/30 mt-0.5">Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-green-500 rounded-full p-2 sm:p-3 shadow-lg animate-pulse">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-blue-500 rounded-full p-2 sm:p-3 shadow-lg animate-bounce">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/5 hover:bg-white/10 transition-all duration-300 group hover:scale-105">
                <div className="bg-primary-500/20 rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 group-hover:bg-primary-500/30 transition-colors">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-300" />
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-1">
                  {feature.title}
                </h4>
                <p className="text-primary-100/60 text-xs sm:text-sm line-clamp-2">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Description */}
        <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <p className="text-primary-100/80 text-sm sm:text-base leading-relaxed">
            <span className="text-white font-semibold">Explore PropertyPro,</span> Africa's biggest real estate search platform available in{' '}
            <span className="text-primary-300 font-medium">Nigeria, Kenya, Zimbabwe, Uganda.</span>{' '}
            Look through our listing database filled with thousands of properties for sale and rent. Find properties listed with detailed description, pictures, amenities and contact information of the agents, landlord or developer. Our listings include various property types such as flats, plots of land, short-let, office spaces, apartments, houses for sale and commercial properties.
          </p>
          <p className="text-primary-100/80 text-sm sm:text-base leading-relaxed mt-3">
            We have tools & resources to make your house search and real estate investment portfolio easier. Real estate agents can access our market insights & trends, performing indices, area guides to make smart decisions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;