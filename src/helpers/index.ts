import qs from 'query-string';
import { RemoveUrlQueryParams, StateType, UrlQueryParams } from '@/types';
import { CardRentalDetails } from '@/types/vehicle-types';
import { VehicleDetailsPageType } from '@/types/vehicle-details-types';
import { IoIosSpeedometer } from 'react-icons/io';
import { FaCrown } from 'react-icons/fa6';
import { IoShieldCheckmark } from 'react-icons/io5';

// to form url params key/value
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// to remove url params key
export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const sortCategories = <T extends { value: string }>(
  categories: T[]
): T[] => {
  if (!categories || categories.length === 0) return [];

  const order = [
    'cars',
    'sports-cars',
    'motorcycles',
    'sports-bikes',
    'bicycles',
    'buses',
    'leisure-boats',
    'yachts',
    'vans',
    'buggies',
    'charters',
  ];

  return [...categories].sort((a, b) => {
    const indexA = order.indexOf(a.value);
    const indexB = order.indexOf(b.value);

    return (
      (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
    );
  });
};

// helpers/sortFilters.ts
export const sortFilters = (
  filters: { name: string; value: string }[]
): { name: string; value: string }[] => {
  // Define the order of categories
  const order = [
    'cars',
    'sports-cars',
    'motorcycles',
    'sports-bikes',
    'bicycles',
    'buses',
    'leisure-boats',
    'yachts',
    'vans',
    'buggies',
    'charters',
  ];

  return filters
    .filter((filter) => order.includes(filter.value))
    .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
};

// Helper function to format the key to match icon naming convention
export const formatKeyForIcon = (key: string) => {
  return key.toLowerCase().replace(/\s+/g, '-');
};

// Helper function to format phone numbers
export const formatPhoneNumber = (countryCode: string, phoneNumber: string) => {
  return `+${countryCode} ${phoneNumber}`;
};

// change to singular
export const singularizeValue = (type: string) => {
  if (type.toLowerCase() === 'buses') {
    return 'Bus';
  } else if (type.toLowerCase() === 'buggies') {
    return 'Buggy';
  }
  return type.endsWith('s') ? type.slice(0, -1) : type;
};

/**
 * Converts a value back into its corresponding label.
 *
 * @param value - The value string in lowercase with hyphens.
 * @returns The formatted label string.
 */
export function convertToLabel(value: string | undefined): string {
  if (!value) {
    return ''; // Return an empty string if value is undefined, null, or an empty string
  }
  // if (value.toLowerCase() === "suvs") {
  //   return "SUV's";
  // }

  if (typeof value === 'string') {
    return value
      .split('-') // Split the value by hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back with spaces
  }

  return '';
}

// Helper function to determine which rental period is available
export const getRentalPeriodDetails = (
  rentalDetails: CardRentalDetails | undefined
) => {
  if (rentalDetails?.hour?.enabled) {
    return {
      period: 'Hour',
      rentInAED: rentalDetails.hour.rentInAED,
      label: `/ ${rentalDetails.hour.minBookingHours}Hrs`,
    };
  } else if (rentalDetails?.day?.enabled) {
    return {
      period: 'Day',
      rentInAED: rentalDetails.day.rentInAED,
      label: '/ day',
    };
  } else if (rentalDetails?.week?.enabled) {
    return {
      period: 'Week',
      rentInAED: rentalDetails.week.rentInAED,
      label: '/ week',
    };
  } else if (rentalDetails?.month?.enabled) {
    return {
      period: 'Month',
      rentInAED: rentalDetails.month.rentInAED,
      label: '/ month',
    };
  }
  return null;
};

// Helper function to format vehicle specifications
export function formatVehicleSpecification(spec: string) {
  if (!spec) return 'N/A';
  return spec.replace('_SPEC', '').replace('_', ' ');
}

// Helper function to format seating capacity
const formatSeatingCapacity = (seatingCapacity: string): string => {
  const numberOfSeats = parseInt(seatingCapacity); // Extract number from string
  if (numberOfSeats === 1) {
    return 'single seater';
  } else if (numberOfSeats > 1) {
    return `${numberOfSeats}-seater`;
  }
  return seatingCapacity; // Fallback, just in case
};

// Helper function to generate dynamic FAQs for the vehicle details page
export const generateDynamicFAQ = (vehicle: VehicleDetailsPageType) => {
  const seatingCapacitySpec = vehicle.specs['Seating Capacity'];
  const availableCities = vehicle.cities.join(', ');

  // Prepare the FAQ array
  const faqArray = [
    {
      question: `How can I connect with this vendor to rent this ${vehicle.brand.label} in ${vehicle.state.label}?`,
      answer: `You can easily book this ${vehicle.brand.label} by unlocking the contact details and directly connecting with the seller. Our listed agents typically respond within 15 mins to all booking inquiries, ensuring a smooth and efficient process.

      Ride.Rent support is available via phone at +971-502972335, via email at hello@ride.rent, or through live chat on our WhatsApp Support Line at +971-502972335 to assist you with the booking.`,
    },
    {
      question: `In which areas of ${vehicle.state.label} is this vehicle rental available?`,
      answer: `This vehicle is available for rent in various areas of ${vehicle.state.label}, including ${availableCities}.`,
    },
    {
      question: `How can I contact Ride.Rent customer support in ${vehicle.state.label}?`,
      answer: `You can reach Ride.Rent customer support via phone at +971-502972335, via email at hello@ride.rent, or through live chat on our WhatsApp Support Line at +971-502972335. Our team is available 24/7 to assist you with bookings, inquiries, and any issues.`,
    },
    {
      question: `Is this vehicle available for lease in ${vehicle.state.label}?`,
      answer: vehicle.isAvailableForLease
        ? `Yes, this vehicle is available in ${vehicle.state.label} at a very affordable cost. Please feel free to connect with the vendor to secure the best deal.`
        : `No, unfortunately, this vehicle is currently unavailable for any lease plans. However, you can explore the available options by unlocking the contact details and connecting directly with the vendor.`,
    },
  ];

  // Add seating capacity question if it's available
  if (seatingCapacitySpec && seatingCapacitySpec.value) {
    const seatingCapacity = formatSeatingCapacity(seatingCapacitySpec.value);
    faqArray.splice(1, 0, {
      // Insert this as the second question
      question: 'How many people can travel in this vehicle?',
      answer: `This vehicle is a ${seatingCapacity} passenger carrier.`,
    });
  }

  return faqArray;
};

// helper function to dynamically generate riderent features based on state
export const createFeatureCards = (state: string) => [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: 'Easy & Fast Booking',
    description: `From premium models to economy vehicles to rent in ${state}, find the perfect car at competitive rates. Secure your rental with just a few clicks and make the most of your ${state} trip. RIDE.RENT is the smart choice for 'Rent a Car in ${state}' services.`,
    bgClass: 'black',
  },
  {
    key: 2,
    icon: FaCrown,
    title: 'Many Pickup Locations',
    description: `From premium models to economy vehicles to rent in ${state}, find the perfect car at competitive rates. Secure your rental with just a few clicks and make the most of your ${state} trip. RIDE.RENT is the smart choice for 'Rent a Car in ${state}' services.`,
    bgClass: 'blue',
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: 'Ensured Delivery Promise',
    description: `Our commitment to punctuality means your chosen vehicle from our extensive 'Rent a Car in ${state}' collection is delivered when and where you need it. Seamless booking, transparent rates, and steadfast service—that's the RIDE.RENT promise.`,
    bgClass: 'orange',
  },
];

/**
 * Rearranges an array of states in the order of:
 * Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, Ajman, Al Ain, Fujairah, Umm Al Quwain.
 * @param states - the array of states to be rearranged
 * @returns a new array with the states in the desired order
 */
export function rearrangeStates(
  states: StateType[],
  country: string
): StateType[] {
  if (country != 'ae') return states;

  const order = [
    'dubai',
    'abu-dhabi',
    'sharjah',
    'ras-al-khaimah',
    'ajman',
    'al-ain',
    'fujairah',
    'umm-al-quwain',
  ];

  return states.sort((a, b) => {
    return order.indexOf(a.stateValue) - order.indexOf(b.stateValue);
  });
}

// formatter to format the name of additional types in vehicleDetailsPage
export const formatAdditionalTypeName = (name: string) => {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * helper function for convert a string to its lowercase, hyphen separated version, free of non-alphanumeric characters, and leading/trailing hyphens, making it suitable for use in URLs.
 *
 * @param word - The string to convert.
 * @returns The converted string.
 */
export function convertToValue(word: string | null): string {
  if (!word) return 'company-disabled';
  return word
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, '-') // Replace non-alphanumeric characters (except spaces) with hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Generates a whatsapp url to send a message to the vehicle owner.
 *
 * @param vehicle - The vehicle object with the whatsapp phone number and country code.
 * @param vehicleDetailsPageLink - The link to the vehicle details page.
 * @returns The url to open whatsapp with the message pre-filled or null if no whatsapp phone number is available.
 */
export const generateWhatsappUrl = (vehicle: {
  whatsappPhone: string | undefined | null;
  whatsappCountryCode: string | undefined | null;
  model: string;
  vehicleDetailsPageLink: string;
}): string | null => {
  if (!vehicle.whatsappPhone || !vehicle.whatsappCountryCode) {
    return null;
  }

  const whatsappPageLink = `https://ride.rent/${vehicle.vehicleDetailsPageLink}`;
  const message = `${whatsappPageLink}\n\nHello, I am interested in the *_${vehicle.model}_* model. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`;
};

export const generateCompanyProfilePageLink = (
  companyName: string | null,
  companyId: string,
  country: string
): string => {
  const formattedCompanyName = convertToValue(companyName);

  return `/${country}/profile/${formattedCompanyName}/${companyId}`;
};

/**
 * Generates a WhatsApp URL to send a message to an agent profile.
 *
 * @param companyName - The name of the company to include in the message.
 * @param whatsappCountryCode - The country code for the WhatsApp number.
 * @param whatsappPhone - The WhatsApp phone number to contact.
 * @returns The URL to open WhatsApp with the message pre-filled, or null if no WhatsApp number is available.
 */
export const generateAgentProfileWhatsappUrl = (
  companyName: string | null,
  whatsappCountryCode: string | null,
  whatsappPhone: string | null
): string | null => {
  if (!whatsappCountryCode || !whatsappPhone) {
    return null;
  }

  const message = `Hi *_${
    companyName || 'the company'
  }_*.\n\nI am interested in renting/leasing a vehicle from your fleet. 
Kindly let me know the next steps or any additional information required to proceed. 
I look forward to your prompt response.\n\nSent via Ride.Rent`;

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${whatsappCountryCode}${whatsappPhone}?text=${encodedMessage}`;
};

export const getAgentFormattedPhoneNumber = (
  countryCode: string | null,
  phone: string | null
): string | null => {
  if (!countryCode || !phone) {
    return null;
  }
  return formatPhoneNumber(countryCode, phone);
};

export function generateModelDetailsUrl(vehicleTitle?: string): string {
  // Fallback value for vehicleTitle
  const fallbackVehicleTitle = 'vehicle';

  const cleanText = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/ - /g, '-') // Handle hyphens within the string
      .replace(/[^a-z0-9-]+/g, '-') // Replace non-alphanumeric characters and spaces with hyphen
      .replace(/^-+|-+$/g, ''); // Remove any leading or trailing hyphens
  };

  // Use vehicleTitle if it exists, otherwise use fallbackVehicleTitle
  const title = cleanText(vehicleTitle || fallbackVehicleTitle);

  return title; // Return the cleaned version of the title
}

/**
 * Generates a URL redirecting to the vehicle details page
 * @returns {string} URL redirecting to the vehicle details page
 */
export const generateVehicleDetailsUrl = (vehicle: {
  vehicleTitle?: string;
  state: string;
  vehicleCategory: string;
  vehicleCode: string;
  country: string;
}): string => {
  const modelDetails = generateModelDetailsUrl(vehicle.vehicleTitle);
  return `/${vehicle.country}/${vehicle.state}/${vehicle.vehicleCategory}/${modelDetails}-for-rent/${vehicle.vehicleCode.toLowerCase()}`;
};

/**
 * Formats a phone number with the given country code
 *
 * @param {string | null} countryCode - Country code
 * @param {string | null} phoneNumber - Phone number
 * @returns {string | null} Formatted phone number or null if either param is null
 */
export const getFormattedPhoneNumber = (
  countryCode: string | null | undefined,
  phoneNumber: string | null | undefined
): string | null => {
  if (!countryCode || !phoneNumber) return null;
  return formatPhoneNumber(countryCode, phoneNumber);
};

/**
 * Generates a URL for the listing page with the given filters
 *
 * @param {number[]} values - Array with 2 elements: minPrice and maxPrice
 * @param {string} state - State to filter by
 * @param {string} category - Category to filter by
 * @param {string | null} selectedPeriod - Period to filter by (can be null)
 * @returns {string} URL for the listing page with the given filters
 */
export const generateListingUrl = (
  values: number[],
  state: string,
  category: string,
  country: string,
  selectedPeriod: 'hour' | 'day' | 'week' | 'month' | null // Accept null
): string => {
  if (!selectedPeriod) return '/'; // Fallback if no period

  const [minPrice, maxPrice] = values;

  return `/${country}/${state}/listing/${category}?price=${minPrice}-${maxPrice}&period=${selectedPeriod}`;
};

type PeriodType = 'hour' | 'day' | 'week' | 'month';

const PERIOD_ORDER: PeriodType[] = ['day', 'week', 'month', 'hour'];

/**
 * Formats and sorts available rental periods for price range filter.
 * Ensures correct order: Daily, Weekly, Monthly, Hourly.
 */
export function formatAndSortPeriods(availablePeriods: PeriodType[]) {
  const periodLabels: Record<PeriodType, string> = {
    day: 'Daily',
    week: 'Weekly',
    month: 'Monthly',
    hour: 'Hourly',
  };

  // Filter available periods in the correct order
  return PERIOD_ORDER.filter((period) => availablePeriods.includes(period)).map(
    (period) => ({
      key: period,
      label: periodLabels[period],
    })
  );
}

type PriceRange = { min: number; max: number };

/**
 * Extract available rental periods in a sorted order.
 */
export function getAvailablePeriods(
  result: Record<string, PriceRange | null> | undefined
): PeriodType[] {
  const periodOrder: PeriodType[] = ['day', 'week', 'month', 'hour'];

  return periodOrder.filter((period) => result?.[period] !== null);
}

/**
 * Adjusts min and max values to prevent issues when they are equal.
 */
export function adjustMinMaxIfEqual(priceRange: PriceRange): PriceRange {
  if (priceRange.min === priceRange.max) {
    return {
      min: priceRange.min,
      max: priceRange.min + 10, // Ensure a valid range
    };
  }
  return priceRange;
}

/**
 * Returns a debounced version of the given function. The function will only be called
 * once the debounce timer has expired. The timer is reset every time the function is
 * called.
 *
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */

export const debounce = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Capitalizes the first letter of a string and lowercases the rest.
 *
 * @param {string} input - String to capitalize
 * @returns {string} Capitalized string
 */
/******  0150f7f5-2c9b-44ba-8f86-bcbf9330e37e  *******/ export function capitalizeFirstLetter(
  input: string
): string {
  if (!input) return ''; // Handle empty or undefined input
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Removes the "-for-rent" suffix from a category string, if present.
 *
 * @param {string} category - Category string to process
 * @returns {string} Processed category string
 */
export const extractCategory = (category: string): string => {
  return category.replace(/-for-rent$/, '');
};

// Generate blog URL title helper function
export function generateBlogUrlTitle(title: string): string {
  return title
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s&!-]/g, '') // Allow letters, numbers, spaces, &, hyphens, and !
    .replace(/\s*-\s*/g, '-') // Replace spaces around hyphens with a single hyphen
    .replace(/\s+/g, '-') // Replace remaining spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single one
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Returns an array of strings to be used for the typewriter effect, based on the
 * given category. If the category is not found in the category map, a fallback
 * array is returned.
 *
 * @param {string} category - Category string to retrieve typewriter strings for
 * @returns {string[]} Array of strings for typewriter effect
 */
export const getTypewriterStrings = (category: string): string[] => {
  const categoryMap: Record<string, string[]> = {
    yachts: [
      '70 Foot Luxury Yacht',
      'Majesty 56 Yacht',
      '88 Foot Luxury yacht ',
    ],
    vans: ['Toyota Sienna', 'Volkswagen Crafter', 'Toyota Rush'],
    'sports-cars': ['Ferrari 488', 'Lamborghini Huracán', 'Porsche 911'],
    'sports-bikes': ['Ducati Panigale', 'Yamaha R1', 'Kawasaki Ninja'],
    motorcycles: ['BMW F 800 GS', 'Harley-Davidson', 'Kawasaki NINJA'],
    'leisure-boats': ['Malibu Wakesetter', 'Hobie Cat', 'Yamaha AR250'],
    charters: ['Phenom 300', 'Airbus H135', 'Gulfstream G650'],
    cars: [
      'Toyota Yaris',
      'Tesla Cybertruck ',
      'BMW 5 Series 520i',
      'Mercedes C Class',
    ],
    buses: ['Yutong 37 Seater', 'MAN Lion', 'VDL'],
    buggies: ['Polaris RZR 200', 'Yamaha ATV 700', 'Honda Talon 1000R'],
    bicycles: ['Yadea KS3', 'Polygon Siskiu T6e', 'Polygon Strattos S7'],
  };

  const fallbackArray = [
    'Luxury Vehicles',
    'Premium Rentals',
    'Drive Your Dream',
  ];

  return categoryMap[category] || fallbackArray;
};
