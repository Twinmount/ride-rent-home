// src/data/homepageContent.ts
import { COUNTRIES, STATES, CATEGORIES } from '@/constants';
import { IoIosSpeedometer } from 'react-icons/io';
import { FaCrown } from 'react-icons/fa';
import { IoShieldCheckmark } from 'react-icons/io5';

interface ICard {
  key: number;
  icon: any;
  title: string;
  description: string;
}

interface IState {
  [state: string]: {
    heading: string;
    description: string[];
    cards: ICard[];
  };
}

interface IFeature {
  [country: string]: IState;
}

// Mini array for Dubai Cars feature cards
const dubaiCarFeatureCards: ICard[] = [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: 'Easy & Fast Booking',
    description:
      'Find the perfect car at competitive rates in Dubai. Secure your rental in just a few clicks and make the most of your trip.',
  },
  {
    key: 2,
    icon: FaCrown,
    title: 'Many Pickup Locations',
    description:
      'Choose from multiple pickup spots across Dubai, ensuring convenience wherever you are.',
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: 'Ensured Delivery Promise',
    description:
      'Your chosen vehicle will be delivered on time, every time, anywhere in Dubai.',
  },
] as const;

// Mini array for Abu Dhabi Cars feature cards
const abuDhabiCarFeatureCards: ICard[] = [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: 'Fast Reservations with Real Value',
    description:
      "With Ride.Rent, there's no need for endless calls or last-minute negotiations. Our platform allows you to instantly compare cheap car hire Abu Dhabi deals and book within minutes.",
  },
  {
    key: 2,
    icon: FaCrown,
    title: 'Pickups Across Abu Dhabi',
    description:
      'Convenience is key, which is why Ride.Rent provides vehicles across multiple touchpoints. Choose Abu Dhabi airport car rental or explore local hotspots with our reliable services.',
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: 'Service You Can Trust',
    description:
      'From cheap car for rent in Abu Dhabi to high-end luxury car hire Abu Dhabi, every booking through Ride.Rent is supported by top-rated partners with on-time delivery and clear pricing.',
  },
] as const;

// Mini array for Ajman Cars feature cards
const ajmanCarFeatureCards: ICard[] = [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: 'Quick Bookings, No Surprises',
    description:
      'Booking through Ride.Rent means no hidden fees. Compare rent a car Ajman cheap offers, explore car hire Ajman options, or lock in a monthly car rental Ajman plan in just a few clicks.',
  },
  {
    key: 2,
    icon: FaCrown,
    title: 'Citywide Coverage',
    description:
      'From car rental in Ajman UAE for visitors to neighborhood-specific rentals like rent a car Ajman Rashidiya and rent a car Ajman Jurf, our platform is designed to bring vehicles closer to you.',
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: 'Reliable Partners for Every Budget',
    description:
      'Whether it\'s best rent a car in Ajman, cheap rental cars Ajman, or premium luxury car hire Ajman, Ride.Rent only works with verified suppliers with transparent pricing and dependable service.',
  },
] as const;

// Mini array for Fujairah Cars feature cards
const fujairahCarFeatureCards: ICard[] = [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: 'Quick Bookings, No Hidden Costs',
    description:
      'With Ride.Rent, you can instantly compare cheap car rental in Fujairah listings, check rent a car Fujairah prices, and secure your booking in just a few clicks. From daily rentals to monthly car rental Fujairah packages, you\'ll always find transparent rates.',
  },
  {
    key: 2,
    icon: FaCrown,
    title: 'Convenience Across Fujairah',
    description:
      'Our platform makes booking simple whether you\'re looking for rent a car in Fujairah near me or want the support of trusted partners through a rent a car Fujairah contact number. With multiple providers, finding the right vehicle in Fujairah has never been easier.',
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: 'Trusted Partners for Every Traveler',
    description:
      'From cheapest rent a car in Fujairah for budget-conscious drivers to premium car hire Fujairah for business or leisure, Ride.Rent connects you with reliable companies. Every rental is backed by verified providers, giving you confidence and peace of mind with every booking.',
  },
] as const;

// Mini array for Sharjah Cars feature cards
const sharjahCarFeatureCards: ICard[] = [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: 'Easy & Hassle-Free Reservations',
    description:
      'Finding the best car hire Sharjah no longer requires endless searches. Ride.Rent makes it simple to compare, select, and book within minutes. From rent a car Sharjah per day for short stays to rent a car Sharjah monthly packages for long-term use, our transparent pricing ensures you always know what you\'re paying for.',
  },
  {
    key: 2,
    icon: FaCrown,
    title: 'Convenient Pickup Points Across Sharjah',
    description:
      'Whether you\'re landing at Sharjah Airport or staying in the city, Ride.Rent gives you multiple pickup options. Choose car rental Sharjah airport for smooth arrivals, or book at city hotspots like rent a car Sharjah Al Nahda. Our network spans the city, making it easy to start your journey anywhere.',
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: 'Reliable Service, Every Time',
    description:
      'Your time matters, and Ride.Rent ensures every booking is delivered on schedule. From cheap rent a car Sharjah to premium chauffeur-driven vehicles, every rental is backed by reliable partners and clear terms. With Ride.Rent, expect consistency, punctuality, and a stress-free experience across Sharjah.',
  },
] as const;

// Mini array for Al Ain Cars feature cards
const alAinCarFeatureCards: ICard[] = [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: 'Quick Bookings, No Hidden Costs',
    description:
      'Compare deals instantly on Ride.Rent, from rent car Al Ain for daily use to monthly car rental Al Ain for residents. Whether you\'re looking for cheap rental cars Al Ain or premium options, our platform ensures transparent prices with no surprises.',
  },
  {
    key: 2,
    icon: FaCrown,
    title: 'Convenience Across Al Ain',
    description:
      'From car rental Al Ain Mall to trusted names like Al Sarooj Rent a Car Office, Ride.Rent ensures multiple pickup points across the city. Simply search rent a car Al Ain near me and find reliable providers within minutes.',
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: 'Trusted Partners for Every Traveler',
    description:
      'Whether it\'s daily car rental Al Ain, monthly rent a car Al Ain, or premium car hire Al Ain, Ride.Rent connects you with the most reliable providers in the market. Every booking, from the cheapest rent a car in Al Ain to family-friendly options, is backed by verified suppliers and clear pricing.',
  },
] as const;

// Content for UAE
const UAE_CONTENT: IState = {
  [STATES.DUBAI]: {
    heading: 'Enjoy ease and peace of mind when renting a car in Dubai',
    description: [
      "Discover the best of Dubai with our affordable and reliable car rental service. Whether you're visiting the main locations or exploring hidden gems, our diverse fleet offers the perfect match for your travel needs.",
      'Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it. Choose us for a stress-free experience in Dubai.',
    ],
    cards: dubaiCarFeatureCards,
  },
  [STATES.ABU_DHABI]: {
    heading: 'Your Reliable Choice for Car Rentals in Abu Dhabi',
    description: [
      'Abu Dhabi is a city of business, culture, and leisure, and having the right vehicle ensures you can experience it all with ease. With Ride.Rent, you can access everything from cheap car rental Abu Dhabi for everyday use to luxury car rental Abu Dhabi and exotic car rental Abu Dhabi for special occasions.',
      'Our platform connects you with established car rental companies in Abu Dhabi, including trusted names like auto rent Abu Dhabi, auto rent a car Abu Dhabi, and major Abu Dhabi airport car rental companies. From daily rentals to car lease Abu Dhabi solutions, we ensure residents and visitors always find affordable mobility choices.',
      'For business professionals and families, we also feature rent a car with driver Abu Dhabi options along with premium executive services such as Abu Dhabi rent a car luxury and rent car Abu Dhabi luxury packages.',
    ],
    cards: abuDhabiCarFeatureCards,
  },
  [STATES.AJMAN]: {
    heading: 'Your Reliable Choice for Car Rentals in Ajman',
    description: [
      'Ajman is a growing hub for families, professionals, and budget-conscious travelers, and having the right vehicle makes getting around the city seamless. With Ride.Rent, you can explore everything from rent a car in Ajman cheap for daily needs to luxury car rental Ajman for special occasions.',
      'Our platform connects you with trusted names such as Budget Rent a Car Ajman, Al Asad Rent a Car Ajman, Al Tameem Rent a Car Ajman, and other leading Ajman rent a car companies. Whether you are looking for the cheapest rent a car in Ajman, a 7 seater car for rent in Ajman, or a quick booking through rent a car Ajman Dubizzle, Ride.Rent ensures you find a vehicle that matches your budget and lifestyle.',
      'For those who prefer comfort over self-driving, Ride.Rent also lists rent a car in Ajman with driver services, ideal for families, tourists, or professionals who want convenience without the hassle of navigating.',
    ],
    cards: ajmanCarFeatureCards,
  },
  [STATES.FUJAIRAH]: {
    heading: 'Your Reliable Choice for Car Rentals in Fujairah',
    description: [
      'Fujairah is known for its scenic drives, coastal views, and calm lifestyle — and Ride.Rent makes it easier to explore with the right vehicle. From cheap car rental in Fujairah for everyday use to monthly rent a car in Fujairah for long-term needs, our platform ensures affordable prices and flexible plans.',
      'Our network includes trusted providers offering verified car rental Fujairah and rent a car Fujairah services across the city, making it simple to book with confidence. From short-term rentals to monthly rent a car in Fujairah, Ride.Rent ensures clear pricing and dependable service.',
    ],
    cards: fujairahCarFeatureCards,
  },
  [STATES.SHARJAH]: {
    heading: 'Seamless Car Rental Experience in Sharjah',
    description: [
      "Navigating Sharjah is easier when you choose Ride.Rent, the leading platform for renting a car in Sharjah. Whether you're a resident seeking the cheapest rent a car in Sharjah monthly, a business traveler booking at car rental Sharjah airport, or a tourist searching for rent a car in Sharjah cheap price, Ride.Rent ensures the perfect match for your needs.",
      'Our platform features both economy and premium fleets from trusted car rental companies in Sharjah, including well-known names such as Dollar Car Rental Sharjah, Budget Rent a Car Sharjah Airport Terminal 1, and National Car Rental Sharjah. From budget-friendly daily bookings to auto lease Sharjah and auto rent Sharjah for long-term commitments, Ride.Rent delivers flexibility at transparent prices.',
      'Whether you need rent a car without deposit Sharjah, a luxury SUV for family trips, or even rent a car with driver Sharjah, our goal is to provide convenience, affordability, and peace of mind every step of the way.',
    ],
    cards: sharjahCarFeatureCards,
  },
  [STATES.AL_AIN]: {
    heading: 'Your Reliable Choice for Car Rentals in Al Ain',
    description: [
      'Al Ain offers a perfect balance of comfort and culture, and Ride.Rent makes it easy to explore the city with the right vehicle. From daily car rental Al Ain for short trips to monthly car rental Al Ain for long-term use, our platform delivers transparent pricing and flexible options. Whether you are searching for the cheapest rent a car in Al Ain, comparing rent a car Al Ain price, or looking for trusted names like Budget Rent a Car Al Ain, Ride.Rent ensures affordability and convenience every time.',
      'Our network includes reliable providers such as Al Sarooj Rent a Car Office, Budget Rent a Car Al Ain, and other popular Al Ain rent a car companies, ensuring you always get verified service. From city options like car rental Al Ain Mall to convenient searches like rent a car Al Ain near me, Ride.Rent helps you book with confidence.',
      'For professionals, families, and visitors, we also list cheap rental cars Al Ain, car hire Al Ain, and flexible packages under rent a car in Al Ain UAE, making it easy to find a vehicle that fits every budget and purpose.',
    ],
    cards: alAinCarFeatureCards,
  },
};

// Content for India
const INDIA_CONTENT: IState = {};

// final object which contains all countries and states specific content regarding features
export const homepageFeaturesContent: IFeature = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;