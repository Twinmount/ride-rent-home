import { COUNTRIES, STATES, CATEGORIES } from '@/constants';

interface IState {
  [state: string]: {
    [category: string]: {
      title: string;
      subtitle: string;
    };
  };
}

interface IHeading {
  [country: string]: IState;
}

// Content for UAE
const UAE_CONTENT: IState = {
  [STATES.DUBAI]: {
    [CATEGORIES.CARS]: {
      title: 'Rent a Car in Dubai at Best Prices',
      subtitle:
        'Choose from economy cars, SUVs, and luxury car for rent in Dubai including Lamborghini, Ferrari, and Range Rover.',
    },
  },
  [STATES.ABU_DHABI]: {
    [CATEGORIES.CARS]: {
      title: 'Affordable Car Rental in Abu Dhabi',
      subtitle:
        'Enjoy cheap car rental Abu Dhabi with flexible daily, weekly, and monthly car rental Abu Dhabi packages.',
    },
  },
  [STATES.AJMAN]: {
    [CATEGORIES.CARS]: {
      title: 'Affordable Car Rental in Ajman',
      subtitle:
        'Enjoy rent a car in Ajman cheap with Ride.Rent, featuring flexible daily, weekly, and monthly car rental Ajman packages. ​',
    },
  },
  [STATES.AL_AIN]: {
    [CATEGORIES.CARS]: {
      title: 'Affordable Car Rental in Al Ain',
      subtitle:
        'Exclusive deals on daily car rental Al Ain, monthly car rental Al Ain, and the cheapest rent a car in Al Ain with trusted providers.​',
    },
  },
  [STATES.FUJAIRAH]: {
    [CATEGORIES.CARS]: {
      title: 'Affordable Car Rental in Fujairah',
      subtitle:
        'Get the cheapest rent a car in Fujairah, flexible monthly rentals, and reliable car hire Fujairah with trusted providers.​',
    },
  },
  [STATES.RAS_AL_KHAIMAH]: {
    [CATEGORIES.CARS]: {
      title: 'Affordable Car Rental in Ras Al Khaimah',
      subtitle:
        'Enjoy cheap car rental RAK with Ride.Rent, offering flexible daily, weekly, and monthly car rental Ras Al Khaimah packages..​',
    },
  },
  [STATES.SHARJAH]: {
    [CATEGORIES.CARS]: {
      title: 'Affordable Car Rental in Sharjah',
      subtitle:
        'Enjoy cheap rent a car Sharjah with daily, weekly, and monthly car rental in Sharjah UAE. From rent a car without a deposit to premium services.​',
    },
  },
};

// Content for India
const INDIA_CONTENT: IState = {
  [STATES.BANGALORE]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Bangalore at Best Prices",
      subtitle:
        "Choose from a wide range of cars in Bangalore including compact hatchbacks, premium sedans, SUVs, and luxury cars like BMW, Audi, and Mercedes. Enjoy affordable rates, flexible plans, and instant booking with Ride.Rent",
    },
  },
  [STATES.CHENNAI]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Chennai at the Best Prices",
      subtitle:
        "Finding the right car in Chennai is now simple with Ride.Rent. From compact hatchbacks for short errands to premium sedans and powerful SUVs for long drives, we have something for every traveler",
    },
  },
};

// final object which contains all countries and states specific content regarding heading
export const homepageHeadingContent: IHeading = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;
