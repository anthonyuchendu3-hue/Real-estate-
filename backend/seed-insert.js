const mongoose = require('mongoose');
require('dotenv').config();

// Define schema
const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  propertyType: String,
  listingType: String,
  price: Number,
  location: String,
  address: String,
  state: String,
  bedrooms: Number,
  bathrooms: Number,
  toilets: Number,
  sqft: Number,
  yearBuilt: Number,
  furnished: String,
  amenities: [String],
  images: [String],
  status: String,
  verified: Boolean,
  agent: {
    name: String,
    phone: String,
    email: String,
    agency: String
  }
});

const Property = mongoose.model('Property', propertySchema);

const allProperties = [
  // ===== LAGOS PROPERTIES =====
  {
    title: 'Luxury 4-Bedroom Duplex in Ikoyi',
    description: 'A stunning luxury duplex in the heart of Ikoyi with panoramic views.',
    propertyType: 'luxury',
    listingType: 'sale',
    price: 350000000,
    location: 'Ikoyi, Lagos',
    address: '123 Ikoyi Road',
    state: 'Lagos',
    bedrooms: 4,
    bathrooms: 5,
    toilets: 5,
    sqft: 450,
    yearBuilt: 2023,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'Parking'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Chidi Okonkwo',
      phone: '+234 803 123 4567',
      email: 'chidi@premiumrealty.ng',
      agency: 'Premium Realty Ltd'
    }
  },
  {
    title: '3-Bedroom Apartment in Victoria Island',
    description: 'Modern apartment with ocean views in the heart of Victoria Island.',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 150000000,
    location: 'Victoria Island, Lagos',
    address: '456 VI Road',
    state: 'Lagos',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 3,
    sqft: 280,
    yearBuilt: 2022,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Generator', 'Parking', 'Gym'],
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Amara Nwosu',
      phone: '+234 802 234 5678',
      email: 'amara@lagoshomes.ng',
      agency: 'Lagos Homes'
    }
  },
  {
    title: 'Land/Plot in Lekki Phase 1',
    description: 'Prime land in the heart of Lekki Phase 1.',
    propertyType: 'land',
    listingType: 'sale',
    price: 85000000,
    location: 'Lekki, Lagos',
    address: '789 Lekki Road',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    sqft: 1000,
    yearBuilt: 0,
    furnished: 'unfurnished',
    amenities: [],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Ngozi Eze',
      phone: '+234 807 890 1234',
      email: 'ngozi@lekkiproperties.ng',
      agency: 'Lekki Properties'
    }
  },
  {
    title: '2-Bedroom Shortlet in Victoria Island',
    description: 'Luxury shortlet apartment with ocean views.',
    propertyType: 'shortlet',
    listingType: 'shortlet',
    price: 25000000,
    location: 'Victoria Island, Lagos',
    address: '321 VI Road',
    state: 'Lagos',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sqft: 120,
    yearBuilt: 2022,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Generator', 'Gym', 'Pool'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Chidi Okonkwo',
      phone: '+234 803 123 4567',
      email: 'chidi@premiumrealty.ng',
      agency: 'Premium Realty Ltd'
    }
  },
  {
    title: '4-Bedroom House in Surulere',
    description: 'Spacious family home in a quiet neighborhood.',
    propertyType: 'house',
    listingType: 'sale',
    price: 120000000,
    location: 'Surulere, Lagos',
    address: '456 Surulere Road',
    state: 'Lagos',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 4,
    sqft: 320,
    yearBuilt: 2020,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'Garden'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Olu Adeyemi',
      phone: '+234 808 901 2345',
      email: 'olu@lagoshomes.ng',
      agency: 'Lagos Homes'
    }
  },
  {
    title: '2-Bedroom Flat in Yaba',
    description: 'Affordable flat in the heart of Yaba.',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 45000000,
    location: 'Yaba, Lagos',
    address: '123 Yaba Road',
    state: 'Lagos',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sqft: 150,
    yearBuilt: 2021,
    furnished: 'unfurnished',
    amenities: ['24/7 Security', 'Parking'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'approved',
    verified: false,
    agent: {
      name: 'Blessing Okafor',
      phone: '+234 811 234 5678',
      email: 'blessing@lagoshomes.ng',
      agency: 'Lagos Homes'
    }
  },
  {
    title: 'Commercial Plaza in Ikeja',
    description: 'Prime commercial plaza in Ikeja business district.',
    propertyType: 'commercial',
    listingType: 'sale',
    price: 350000000,
    location: 'Ikeja, Lagos',
    address: '456 Ikeja Road',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 4,
    toilets: 4,
    sqft: 500,
    yearBuilt: 2022,
    furnished: 'unfurnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'CCTV'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Segun Adeleke',
      phone: '+234 812 345 6789',
      email: 'segun@lagoscommercial.ng',
      agency: 'Lagos Commercial Realty'
    }
  },
  {
    title: 'Studio Apartment in Lekki',
    description: 'Modern studio apartment perfect for short stays.',
    propertyType: 'apartment',
    listingType: 'shortlet',
    price: 20000000,
    location: 'Lekki, Lagos',
    address: '789 Lekki Road',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 1,
    toilets: 1,
    sqft: 80,
    yearBuilt: 2023,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Generator', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Chinwe Obi',
      phone: '+234 815 678 9012',
      email: 'chinwe@lekkiproperties.ng',
      agency: 'Lekki Properties'
    }
  },
  {
    title: '3-Bedroom Townhouse in Magodo',
    description: 'Spacious townhouse in a gated community.',
    propertyType: 'house',
    listingType: 'rent',
    price: 95000000,
    location: 'Magodo, Lagos',
    address: '456 Magodo Road',
    state: 'Lagos',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 3,
    sqft: 250,
    yearBuilt: 2022,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'Garden', 'Playground'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Tunde Balogun',
      phone: '+234 816 789 0123',
      email: 'tunde@lagoshomes.ng',
      agency: 'Lagos Homes'
    }
  },
  {
    title: 'Luxury Penthouse in VI',
    description: 'Spectacular penthouse with 360° ocean views.',
    propertyType: 'luxury',
    listingType: 'sale',
    price: 450000000,
    location: 'Victoria Island, Lagos',
    address: '789 VI Road',
    state: 'Lagos',
    bedrooms: 4,
    bathrooms: 5,
    toilets: 5,
    sqft: 500,
    yearBuilt: 2024,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'CCTV', 'Borehole', 'Private Elevator'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Chidi Okonkwo',
      phone: '+234 803 123 4567',
      email: 'chidi@premiumrealty.ng',
      agency: 'Premium Realty Ltd'
    }
  },
  {
    title: 'Beachfront Villa in Epe',
    description: 'Stunning beachfront villa with private beach access.',
    propertyType: 'luxury',
    listingType: 'sale',
    price: 280000000,
    location: 'Epe, Lagos',
    address: '123 Epe Road',
    state: 'Lagos',
    bedrooms: 5,
    bathrooms: 6,
    toilets: 6,
    sqft: 700,
    yearBuilt: 2023,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'CCTV', 'Borehole', 'Private Beach'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Tunde Balogun',
      phone: '+234 816 789 0123',
      email: 'tunde@lagoshomes.ng',
      agency: 'Lagos Homes'
    }
  },

  // ===== ABUJA PROPERTIES =====
  {
    title: '5-Bedroom Mansion in Maitama',
    description: 'Exclusive mansion in Abuja\'s most prestigious neighborhood.',
    propertyType: 'luxury',
    listingType: 'sale',
    price: 500000000,
    location: 'Maitama, Abuja',
    address: '789 Maitama Crescent',
    state: 'Abuja',
    bedrooms: 5,
    bathrooms: 6,
    toilets: 6,
    sqft: 600,
    yearBuilt: 2023,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'CCTV', 'Borehole'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Amina Bello',
      phone: '+234 805 678 9012',
      email: 'amina@abujapremier.ng',
      agency: 'Abuja Premier Realty'
    }
  },
  {
    title: '3-Bedroom Apartment in Garki',
    description: 'Modern apartment in the heart of Abuja.',
    propertyType: 'apartment',
    listingType: 'rent',
    price: 90000000,
    location: 'Garki, Abuja',
    address: '123 Garki Road',
    state: 'Abuja',
    bedrooms: 3,
    bathrooms: 2,
    toilets: 2,
    sqft: 200,
    yearBuilt: 2021,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'CCTV'],
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Fatima Bello',
      phone: '+234 809 012 3456',
      email: 'fatima@abujapremier.ng',
      agency: 'Abuja Premier Realty'
    }
  },
  {
    title: '4-Bedroom Duplex in Asokoro',
    description: 'Beautiful duplex in Abuja\'s diplomatic area.',
    propertyType: 'luxury',
    listingType: 'sale',
    price: 280000000,
    location: 'Asokoro, Abuja',
    address: '456 Asokoro Road',
    state: 'Abuja',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 4,
    sqft: 400,
    yearBuilt: 2023,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'CCTV'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Zainab Mohammed',
      phone: '+234 813 456 7890',
      email: 'zainab@abujapremier.ng',
      agency: 'Abuja Premier Realty'
    }
  },
  {
    title: 'Land/Plot in Gwarinpa',
    description: 'Prime land for development in Gwarinpa.',
    propertyType: 'land',
    listingType: 'sale',
    price: 75000000,
    location: 'Gwarinpa, Abuja',
    address: '789 Gwarinpa Road',
    state: 'Abuja',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    sqft: 800,
    yearBuilt: 0,
    furnished: 'unfurnished',
    amenities: [],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Ibrahim Musa',
      phone: '+234 814 567 8901',
      email: 'ibrahim@abujaland.ng',
      agency: 'Abuja Land Brokers'
    }
  },
  {
    title: '3-Bedroom Shortlet in Abuja',
    description: 'Luxury shortlet apartment in the heart of Abuja.',
    propertyType: 'shortlet',
    listingType: 'shortlet',
    price: 30000000,
    location: 'Wuse, Abuja',
    address: '123 Wuse Road',
    state: 'Abuja',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 3,
    sqft: 180,
    yearBuilt: 2023,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Generator', 'Gym', 'Swimming Pool'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Zainab Mohammed',
      phone: '+234 813 456 7890',
      email: 'zainab@abujapremier.ng',
      agency: 'Abuja Premier Realty'
    }
  },
  {
    title: 'Executive 3-Bedroom in Jabi',
    description: 'Executive apartment with stunning lake views.',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 120000000,
    location: 'Jabi, Abuja',
    address: '456 Jabi Road',
    state: 'Abuja',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 3,
    sqft: 220,
    yearBuilt: 2022,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'Parking'],
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Amina Bello',
      phone: '+234 805 678 9012',
      email: 'amina@abujapremier.ng',
      agency: 'Abuja Premier Realty'
    }
  },

  // ===== PORT HARCOURT PROPERTIES =====
  {
    title: 'Commercial Space in Port Harcourt',
    description: 'Prime commercial space in the business district.',
    propertyType: 'commercial',
    listingType: 'sale',
    price: 200000000,
    location: 'Port Harcourt, Rivers',
    address: '456 PH Road',
    state: 'Rivers',
    bedrooms: 0,
    bathrooms: 2,
    toilets: 2,
    sqft: 350,
    yearBuilt: 2021,
    furnished: 'unfurnished',
    amenities: ['24/7 Security', 'Parking', 'Generator'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Oluwaseun Adebayo',
      phone: '+234 806 789 0123',
      email: 'seun@riversrealty.ng',
      agency: 'Rivers Realty'
    }
  },
  {
    title: 'Office Space in CBD Port Harcourt',
    description: 'Prime office space in Port Harcourt CBD.',
    propertyType: 'commercial',
    listingType: 'sale',
    price: 180000000,
    location: 'Port Harcourt, Rivers',
    address: '789 PH Road',
    state: 'Rivers',
    bedrooms: 0,
    bathrooms: 3,
    toilets: 3,
    sqft: 400,
    yearBuilt: 2021,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'CCTV', 'Elevator'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Kelechi Okoro',
      phone: '+234 817 890 1234',
      email: 'kelechi@riversrealty.ng',
      agency: 'Rivers Realty'
    }
  },
  {
    title: 'Land/Plot in Port Harcourt',
    description: 'Prime land in a developing area of Port Harcourt.',
    propertyType: 'land',
    listingType: 'sale',
    price: 55000000,
    location: 'Port Harcourt, Rivers',
    address: '321 PH Road',
    state: 'Rivers',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    sqft: 600,
    yearBuilt: 0,
    furnished: 'unfurnished',
    amenities: [],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Kelechi Okoro',
      phone: '+234 817 890 1234',
      email: 'kelechi@riversrealty.ng',
      agency: 'Rivers Realty'
    }
  },

  // ===== AWKA PROPERTIES =====
  {
    title: '4-Bedroom Duplex in Awka',
    description: 'Beautiful duplex in the heart of Awka with modern finishes.',
    propertyType: 'house',
    listingType: 'sale',
    price: 85000000,
    location: 'Awka, Anambra',
    address: '123 Awka Road',
    state: 'Anambra',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 4,
    sqft: 350,
    yearBuilt: 2022,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'Garden', 'CCTV'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Chuka Okonkwo',
      phone: '+234 820 123 4567',
      email: 'chuka@anambraproperties.ng',
      agency: 'Anambra Properties'
    }
  },
  {
    title: '3-Bedroom Bungalow in Awka',
    description: 'Spacious bungalow in a quiet Awka neighborhood.',
    propertyType: 'house',
    listingType: 'sale',
    price: 45000000,
    location: 'Awka, Anambra',
    address: '456 Awka Road',
    state: 'Anambra',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 3,
    sqft: 200,
    yearBuilt: 2021,
    furnished: 'unfurnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'Garden'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Nkechi Obi',
      phone: '+234 821 234 5678',
      email: 'nkechi@anambraproperties.ng',
      agency: 'Anambra Properties'
    }
  },
  {
    title: 'Land/Plot in Awka',
    description: 'Prime land for development in Awka metropolis.',
    propertyType: 'land',
    listingType: 'sale',
    price: 30000000,
    location: 'Awka, Anambra',
    address: '789 Awka Road',
    state: 'Anambra',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    sqft: 500,
    yearBuilt: 0,
    furnished: 'unfurnished',
    amenities: [],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Chuka Okonkwo',
      phone: '+234 820 123 4567',
      email: 'chuka@anambraproperties.ng',
      agency: 'Anambra Properties'
    }
  },
  {
    title: '2-Bedroom Flat in Awka',
    description: 'Modern flat in a prime Awka location.',
    propertyType: 'apartment',
    listingType: 'rent',
    price: 25000000,
    location: 'Awka, Anambra',
    address: '321 Awka Road',
    state: 'Anambra',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sqft: 120,
    yearBuilt: 2023,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'approved',
    verified: false,
    agent: {
      name: 'Nkechi Obi',
      phone: '+234 821 234 5678',
      email: 'nkechi@anambraproperties.ng',
      agency: 'Anambra Properties'
    }
  },
  {
    title: 'Luxury 5-Bedroom in Awka',
    description: 'Luxury mansion with premium finishes in Awka\'s finest neighborhood.',
    propertyType: 'luxury',
    listingType: 'sale',
    price: 150000000,
    location: 'Awka, Anambra',
    address: '789 Awka Road',
    state: 'Anambra',
    bedrooms: 5,
    bathrooms: 6,
    toilets: 6,
    sqft: 500,
    yearBuilt: 2024,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'CCTV', 'Borehole'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Chuka Okonkwo',
      phone: '+234 820 123 4567',
      email: 'chuka@anambraproperties.ng',
      agency: 'Anambra Properties'
    }
  },

  // ===== OTHER LOCATIONS =====
  {
    title: '6-Bedroom Villa in Banana Island',
    description: 'Extravagant villa with private beach access in Banana Island.',
    propertyType: 'luxury',
    listingType: 'sale',
    price: 750000000,
    location: 'Banana Island, Lagos',
    address: '123 Banana Island',
    state: 'Lagos',
    bedrooms: 6,
    bathrooms: 7,
    toilets: 7,
    sqft: 800,
    yearBuilt: 2024,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Swimming Pool', 'Gym', 'Generator', 'CCTV', 'Borehole', 'Private Beach'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Tony Eze',
      phone: '+234 810 123 4567',
      email: 'tony@premiumrealty.ng',
      agency: 'Premium Realty Ltd'
    }
  },
  {
    title: '4-Bedroom Bungalow in Ibadan',
    description: 'Beautiful bungalow in a serene Ibadan neighborhood.',
    propertyType: 'house',
    listingType: 'sale',
    price: 65000000,
    location: 'Ibadan, Oyo',
    address: '123 Ibadan Road',
    state: 'Oyo',
    bedrooms: 4,
    bathrooms: 3,
    toilets: 3,
    sqft: 280,
    yearBuilt: 2020,
    furnished: 'unfurnished',
    amenities: ['24/7 Security', 'Parking', 'Generator', 'Garden'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Adebayo Ogunleye',
      phone: '+234 818 901 2345',
      email: 'adebayo@ibadanproperties.ng',
      agency: 'Ibadan Properties'
    }
  },
  {
    title: '2-Bedroom Apartment in Enugu',
    description: 'Modern apartment in the heart of Enugu City.',
    propertyType: 'apartment',
    listingType: 'rent',
    price: 35000000,
    location: 'Enugu City, Enugu',
    address: '123 Enugu Road',
    state: 'Enugu',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sqft: 120,
    yearBuilt: 2022,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Nneka Ani',
      phone: '+234 819 012 3456',
      email: 'nneka@enugurealty.ng',
      agency: 'Enugu Realty'
    }
  },
  {
    title: '3-Bedroom Flat in Benin City',
    description: 'Spacious flat in the heart of Benin City.',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 40000000,
    location: 'Benin City, Edo',
    address: '123 Benin Road',
    state: 'Edo',
    bedrooms: 3,
    bathrooms: 2,
    toilets: 2,
    sqft: 180,
    yearBuilt: 2021,
    furnished: 'unfurnished',
    amenities: ['24/7 Security', 'Parking', 'Generator'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Osas Eghosa',
      phone: '+234 822 345 6789',
      email: 'osas@edoproperties.ng',
      agency: 'Edo Properties'
    }
  },
  {
    title: 'Land/Plot in Benin City',
    description: 'Prime land for development in Benin City.',
    propertyType: 'land',
    listingType: 'sale',
    price: 25000000,
    location: 'Benin City, Edo',
    address: '456 Benin Road',
    state: 'Edo',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    sqft: 400,
    yearBuilt: 0,
    furnished: 'unfurnished',
    amenities: [],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Osas Eghosa',
      phone: '+234 822 345 6789',
      email: 'osas@edoproperties.ng',
      agency: 'Edo Properties'
    }
  },
  {
    title: '2-Bedroom Apartment in Kano',
    description: 'Modern apartment in the heart of Kano City.',
    propertyType: 'apartment',
    listingType: 'rent',
    price: 22000000,
    location: 'Kano City, Kano',
    address: '123 Kano Road',
    state: 'Kano',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sqft: 100,
    yearBuilt: 2022,
    furnished: 'furnished',
    amenities: ['24/7 Security', 'Parking', 'Generator'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'approved',
    verified: true,
    agent: {
      name: 'Aisha Mohammed',
      phone: '+234 823 456 7890',
      email: 'aisha@kanorealty.ng',
      agency: 'Kano Realty'
    }
  }
];

async function insertAllProperties() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/primeestate');
    console.log('✅ Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany({});
    console.log('🧹 Cleared existing properties');

    // Insert all properties
    const result = await Property.insertMany(allProperties);
    console.log(`✅ Inserted ${result.length} properties`);

    // Show summary
    const count = await Property.countDocuments();
    console.log(`📊 Total properties in database: ${count}`);

    console.log('✅ Done!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit();
  }
}

insertAllProperties();