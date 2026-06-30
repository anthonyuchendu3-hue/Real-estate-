import React from 'react';
import { Building, Users, Award, MapPin } from 'lucide-react';

const TrustBadges = () => {
  const stats = [
    { icon: Building, value: '500+', label: 'Properties Sold' },
    { icon: Users, value: '50+', label: 'Expert Agents' },
    { icon: MapPin, value: '10+', label: 'Locations Across Nigeria' },
    { icon: Award, value: '4.8★', label: 'Average Rating' },
  ];

  return (
    <section className="py-12 bg-primary-600 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-200" />
              <div className="text-3xl font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-primary-100 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;