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

// Content for UAE
const UAE_CONTENT: IState = {
  [STATES.DUBAI]: {
    heading: 'Enjoy ease and peace of mind when renting a car in Dubai',
    description: [
      'Discover the best of Dubai with our affordable and reliable car rental service. Whether you’re visiting the main locations or exploring hidden gems, our diverse fleet offers the perfect match for your travel needs.',
      'Our commitment to reliability means your vehicle will be ready and waiting, wherever and whenever you need it. Choose us for a stress-free experience in Dubai.',
    ],
    cards: dubaiCarFeatureCards,
  },
};

// Content for India
const INDIA_CONTENT: IState = {};

// final object which contains all countries and states specific content regarding features
export const homepageFeaturesContent: IFeature = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;
