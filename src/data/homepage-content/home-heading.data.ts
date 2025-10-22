import { COUNTRIES, UAE_STATES, INDIA_STATES, CATEGORIES } from "@/constants";

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
  [UAE_STATES.DUBAI]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Dubai at Best Prices",
      subtitle:
        "Choose from economy cars, SUVs, and luxury car for rent in Dubai including Lamborghini, Ferrari, and Range Rover.",
    },
  },
  [UAE_STATES.ABU_DHABI]: {
    [CATEGORIES.CARS]: {
      title: "Affordable Car Rental in Abu Dhabi",
      subtitle:
        "Enjoy cheap car rental Abu Dhabi with flexible daily, weekly, and monthly car rental Abu Dhabi packages.",
    },
  },
  [UAE_STATES.AJMAN]: {
    [CATEGORIES.CARS]: {
      title: "Affordable Car Rental in Ajman",
      subtitle:
        "Enjoy rent a car in Ajman cheap with Ride.Rent, featuring flexible daily, weekly, and monthly car rental Ajman packages. ​",
    },
  },
  [UAE_STATES.AL_AIN]: {
    [CATEGORIES.CARS]: {
      title: "Affordable Car Rental in Al Ain",
      subtitle:
        "Exclusive deals on daily car rental Al Ain, monthly car rental Al Ain, and the cheapest rent a car in Al Ain with trusted providers.​",
    },
  },
  [UAE_STATES.FUJAIRAH]: {
    [CATEGORIES.CARS]: {
      title: "Affordable Car Rental in Fujairah",
      subtitle:
        "Get the cheapest rent a car in Fujairah, flexible monthly rentals, and reliable car hire Fujairah with trusted providers.​",
    },
  },
  [UAE_STATES.RAS_AL_KHAIMAH]: {
    [CATEGORIES.CARS]: {
      title: "Affordable Car Rental in Ras Al Khaimah",
      subtitle:
        "Enjoy cheap car rental RAK with Ride.Rent, offering flexible daily, weekly, and monthly car rental Ras Al Khaimah packages..​",
    },
  },
  [UAE_STATES.SHARJAH]: {
    [CATEGORIES.CARS]: {
      title: "Affordable Car Rental in Sharjah",
      subtitle:
        "Enjoy cheap rent a car Sharjah with daily, weekly, and monthly car rental in Sharjah UAE. From rent a car without a deposit to premium services.​",
    },
  },
};

// Content for India
const INDIA_CONTENT: IState = {
  [INDIA_STATES.BANGALORE]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Bangalore at Best Prices",
      subtitle:
        "Choose from a wide range of cars in Bangalore including compact hatchbacks, premium sedans, SUVs, and luxury cars like BMW, Audi, and Mercedes. Enjoy affordable rates, flexible plans, and instant booking with Ride.Rent",
    },
  },
  [INDIA_STATES.CHENNAI]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Chennai at the Best Prices",
      subtitle:
        "Finding the right car in Chennai is now simple with Ride.Rent. From compact hatchbacks for short errands to premium sedans and powerful SUVs for long drives, we have something for every traveler",
    },
  },
  [INDIA_STATES.DELHI]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Delhi at Best Prices",
      subtitle:
        "Choose from compact hatchbacks, premium sedans, and luxury cars in Delhi with flexible daily, weekly, and monthly rental options. Book instantly with Ride.Rent for reliable and affordable service.",
    },
  },
  [INDIA_STATES.GURGAON]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Gurgaon with Comfort and Confidence",
      subtitle:
        "From compact cars to premium SUVs, find the perfect vehicle in Gurgaon for business trips, airport transfers, or family outings. Enjoy verified partners and transparent pricing with Ride.Rent.",
    },
  },
  [INDIA_STATES.KOCHI]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Kochi for a Smooth and Comfortable Journey",
      subtitle:
        "Explore Kochi with self-drive cars, SUVs, and premium sedans. Perfect for city rides, family trips, or weekend escapes to Munnar and beyond with Ride.Rent.",
    },
  },
  [INDIA_STATES.KOLKATA]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Kolkata for Comfort and Flexibility",
      subtitle:
        "Choose from hatchbacks, sedans, SUVs, or luxury cars in Kolkata for daily commutes, business trips, or weekend getaways. Book easily with Ride.Rent.",
    },
  },
  [INDIA_STATES.MUMBAI]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Mumbai with Ride.Rent",
      subtitle:
        "Experience seamless car rentals in Mumbai with self-drive, chauffeur-driven, and premium vehicle options. Transparent pricing for every occasion with Ride.Rent.",
    },
  },
  [INDIA_STATES.NOIDA]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Noida with Ride.Rent",
      subtitle:
        "Book reliable cars in Noida for work, family trips, or airport transfers. Choose from compact to premium vehicles at affordable rates with Ride.Rent.",
    },
  },
  [INDIA_STATES.PUNE]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Pune with Ease and Flexibility",
      subtitle:
        "Rent affordable hatchbacks, family sedans, or premium SUVs in Pune. Perfect for city commutes or outstation trips to Lonavala and Mahabaleshwar with Ride.Rent.",
    },
  },
  [INDIA_STATES.RAJASTHAN]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Rajasthan with Ride.Rent",
      subtitle:
        "Explore the royal cities of Jaipur, Udaipur, and Jodhpur with reliable car rentals. Choose from economy to luxury vehicles for desert road trips with Ride.Rent.",
    },
  },
  [INDIA_STATES.TELANGANA]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Telangana with Ride.Rent",
      subtitle:
        "Book cars in Hyderabad, Warangal, or Karimnagar with flexible rental plans. From hatchbacks to SUVs, find the perfect vehicle for your journey in Telangana with Ride.Rent.",
    },
  },
  [INDIA_STATES.AHMEDABAD]: {
    [CATEGORIES.CARS]: {
      title: "Car Rental in Ahmedabad Made Easy with Ride.Rent",
      subtitle:
        "Rent self-drive or chauffeur-driven cars in Ahmedabad with quick booking and verified partners. Enjoy affordable rates for business and leisure trips across Gujarat with Ride.Rent.",
    },
  },
  [INDIA_STATES.PORT_BLAIR]: {
    [CATEGORIES.CARS]: {
      title: "Rent a Car in Port Blair with Ride.Rent",
      subtitle:
        "Explore the Andaman Islands with self-drive cars, chauffeur-driven vehicles, and airport transfers. Reliable service for island adventures with Ride.Rent.",
    },
  },
};

// final object which contains all countries and states specific content regarding heading
export const homepageHeadingContent: IHeading = {
  [COUNTRIES.AE]: UAE_CONTENT,
  [COUNTRIES.IN]: INDIA_CONTENT,
} as const;
