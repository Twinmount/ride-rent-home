import { COUNTRIES, STATES, CATEGORIES } from '@/constants';

export const homepageHeadingContent = {
  [COUNTRIES.AE]: {
    [STATES.DUBAI]: {
      [CATEGORIES.CARS]: {
        title: 'Rent a Car in Dubai at Best Prices',
        subtitle:
          'Choose from economy cars, SUVs, and luxury car for rent in Dubai including Lamborghini, Ferrari, and Range Rover.',
      },
    },
    [STATES.SHARJAH]: {
      [CATEGORIES.CARS]: {
        title: 'Affordable Car Rentals in Sharjah',
        subtitle: 'Find budget-friendly cars and SUVs for your Sharjah trip.',
      },
    },
  },
} as const;
