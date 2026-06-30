import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProperties from '../components/home/FeaturedProperties';
import HomesWithVideos from '../components/home/HomesWithVideos';
import TrustBadges from '../components/home/TrustBadges';
import HowItWorks from '../components/home/HowItWorks';
import AppPromo from '../components/home/AppPromo';

const Home = () => {
  return (
    <div>
      <Hero />
      <TrustBadges />
      <HomesWithVideos />
      <HowItWorks />
      <AppPromo />
      <FeaturedProperties />
    </div>
  );
};

export default Home;