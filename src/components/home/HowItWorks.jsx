import React from 'react';
import { TrendingUp, TrendingDown, Home, Building2, LandPlot, ArrowUpRight, ArrowDownRight, BarChart3, Building, MapPin, Calendar } from 'lucide-react';

const HowItWorks = () => {
  const topGainers = [
    {
      name: 'Off MODUPE',
      type: 'terraced-duplex',
      change: '24900.00%',
      price: '₦450,000,000',
      trend: 'up',
      icon: Building2
    },
    {
      name: 'Gaduwa Abuja',
      type: 'terraced-duplex',
      change: '700.00%',
      price: '₦2,000,000,000',
      trend: 'up',
      icon: Home
    },
    {
      name: 'Crystal City',
      type: 'terraced-duplex',
      change: '1782.35%',
      price: '₦160,000,000',
      trend: 'up',
      icon: Building
    },
    {
      name: 'Infinity Estate',
      type: 'detached-duplex',
      change: '6400.00%',
      price: '₦130,000,000',
      trend: 'up',
      icon: LandPlot
    }
  ];

  const topLosers = [
    {
      name: 'Newtown Estate',
      type: 'mixed-use-land',
      change: '-84.00%',
      price: '₦4,000,000',
      trend: 'down',
      icon: Building2
    },
    {
      name: 'Doma road',
      type: '',
      change: '-87.50%',
      price: '₦250,000',
      trend: 'down',
      icon: MapPin
    }
  ];

  const getPropertyIcon = (name) => {
    if (name.includes('MODUPE') || name.includes('Estate')) return Building2;
    if (name.includes('Gaduwa')) return Home;
    if (name.includes('Crystal')) return Building;
    if (name.includes('Infinity')) return LandPlot;
    if (name.includes('Doma')) return MapPin;
    return Building2;
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors duration-300">
      <div className="container-custom">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 p-6 sm:p-8">
            <div className="absolute top-0 right-0 opacity-10">
              <BarChart3 className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Market Overview of Nigeria
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-primary-100 text-sm">Property Index</p>
                <span className="w-px h-4 bg-primary-300"></span>
                <p className="text-primary-100 text-sm flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>06/2026</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-700">
            {/* Top Gainers */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-1.5">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Top Gainers</h4>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">06/2026</span>
              </div>
              <div className="space-y-3">
                {topGainers.map((item, index) => {
                  const Icon = item.icon || getPropertyIcon(item.name);
                  return (
                    <div key={index} className="group hover:bg-gradient-to-r hover:from-green-50 dark:hover:from-green-900/20 hover:to-transparent rounded-xl p-3 transition-all duration-300 cursor-pointer border border-transparent hover:border-green-200 dark:hover:border-green-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="flex items-center space-x-1 justify-end">
                            <ArrowUpRight className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            <p className="text-green-600 dark:text-green-400 font-bold text-sm sm:text-base">{item.change}</p>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Losers */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-1.5">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Top Losers</h4>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">06/2026</span>
              </div>
              <div className="space-y-3">
                {topLosers.map((item, index) => {
                  const Icon = item.icon || getPropertyIcon(item.name);
                  return (
                    <div key={index} className="group hover:bg-gradient-to-r hover:from-red-50 dark:hover:from-red-900/20 hover:to-transparent rounded-xl p-3 transition-all duration-300 cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{item.name}</p>
                            {item.type && <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="flex items-center space-x-1 justify-end">
                            <ArrowDownRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                            <p className="text-red-600 dark:text-red-400 font-bold text-sm sm:text-base">{item.change}</p>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Data updated: June 2026</span>
              <span className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Gainers</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Losers</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;