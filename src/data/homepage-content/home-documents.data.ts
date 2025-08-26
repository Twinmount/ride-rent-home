import { CATEGORIES, COUNTRIES, STATES } from '@/constants';

export const homepageDocumentsContent = {
  [COUNTRIES.AE]: {
    [STATES.DUBAI]: {
      [CATEGORIES.CARS]: {
        title: 'Ride.Rent brings you the best cars for rental in Dubai',
        description: [
          'Discover a wide range of cars in Dubai — from economy to luxury models, all available at affordable rates.',
          'With trusted service across the UAE, including Dubai, Abu Dhabi, and Sharjah, we make renting easy and reliable.',
          'Choose Ride.Rent for your car rental needs in Dubai and experience convenience like never before.',
        ],
      },
    },
  },
} as const;
