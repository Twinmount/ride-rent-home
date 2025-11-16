import qs from "query-string";
import { RemoveUrlQueryParams, StateType, UrlQueryParams } from "@/types";
import {
  CardRentalDetails,
  FeatureType,
  MapCardRentalDetailsType,
} from "@/types/vehicle-types";
import { Period } from "@/components/card/vehicle-card/RentalDetails";

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
    "cars",
    "sports-cars",
    "motorcycles",
    "sports-bikes",
    "bicycles",
    "buses",
    "leisure-boats",
    "yachts",
    "vans",
    "buggies",
    "charters",
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
    "cars",
    "sports-cars",
    "motorcycles",
    "sports-bikes",
    "bicycles",
    "buses",
    "leisure-boats",
    "yachts",
    "vans",
    "buggies",
    "charters",
  ];

  return filters
    .filter((filter) => order.includes(filter.value))
    .sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value));
};

// Helper function to format the key to match icon naming convention
export const formatKeyForIcon = (key: string) => {
  return key.toLowerCase().replace(/\s+/g, "-");
};

// Helper function to format phone numbers
export const formatPhoneNumber = (countryCode: string, phoneNumber: string) => {
  const formattedCountryCode = countryCode.startsWith("+")
    ? countryCode
    : `+${countryCode}`;

  return `${formattedCountryCode} ${phoneNumber}`;
};

// change to singular
export const singularizeValue = (type: string) => {
  if (type.toLowerCase() === "buses") {
    return "Bus";
  } else if (type.toLowerCase() === "buggies") {
    return "Buggy";
  }
  return type.endsWith("s") ? type.slice(0, -1) : type;
};

/**
 * Converts a value back into its corresponding label.
 *
 * @param value - The value string in lowercase with hyphens.
 * @returns The formatted label string.
 */
export function convertToLabel(value: string | undefined): string {
  if (!value) {
    return ""; // Return an empty string if value is undefined, null, or an empty string
  }
  // if (value.toLowerCase() === "suvs") {
  //   return "SUV's";
  // }

  if (typeof value === "string") {
    return value
      .split("-") // Split the value by hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the words back with spaces
  }

  return "";
}

// find the rental period based on preferred period or lowest available rental option
export const getRentalPeriodDetails = (
  rentalDetails: CardRentalDetails | undefined,
  preferredPeriod?: Period
) => {
  // If no rental details, return null
  if (!rentalDetails) return null;

  // period priority order (from lowest to highest)
  const periodOrder = ["hour", "day", "week", "month"] as const;

  // Helper function to get details for a specific period
  const getPeriodDetails = (period: PeriodType) => {
    const periodData = rentalDetails[period];
    if (!periodData?.enabled) return null;

    switch (period) {
      case "hour":
        const hourData = periodData as NonNullable<typeof rentalDetails.hour>;
        return {
          period: "Hour",
          rentInAED: hourData.rentInAED,
          label: `/ ${hourData.minBookingHours}Hrs`,
        };
      case "day":
        return {
          period: "Day",
          rentInAED: periodData.rentInAED,
          label: "/ Day",
        };
      case "week":
        return {
          period: "Week",
          rentInAED: periodData.rentInAED,
          label: "/ Week",
        };
      case "month":
        return {
          period: "Month",
          rentInAED: periodData.rentInAED,
          label: "/ Month",
        };
    }
  };

  // If preferred period is specified and valid, try to use it
  if (preferredPeriod) {
    const normalizedPeriod = preferredPeriod.toLowerCase() as Period;
    if (periodOrder.includes(normalizedPeriod)) {
      const preferredDetails = getPeriodDetails(normalizedPeriod);
      if (preferredDetails) {
        return preferredDetails;
      }
    }
  }

  // Fallback: Find the lowest available period
  for (const period of periodOrder) {
    const details = getPeriodDetails(period);
    if (details) {
      return details;
    }
  }

  return null;
};

export const getMapCardRentalPeriodDetails = (
  rentalDetails: MapCardRentalDetailsType | undefined
) => {
  if (rentalDetails?.hour) {
    return {
      period: "Hour",
      rentInAED: rentalDetails.hour, // Since it's a string, you may need to parse or format it if required
      label: "/ hour",
    };
  } else if (rentalDetails?.day) {
    return {
      period: "Day",
      rentInAED: rentalDetails.day, // Same here
      label: "/ day",
    };
  } else if (rentalDetails?.week) {
    return {
      period: "Week",
      rentInAED: rentalDetails.week, // Same here
      label: "/ week",
    };
  } else if (rentalDetails?.month) {
    return {
      period: "Month",
      rentInAED: rentalDetails.month, // Same here
      label: "/ month",
    };
  }
  return null;
};

// Helper function to format vehicle specifications
export function formatVehicleSpecification(spec: string) {
  if (!spec) return "N/A";
  return spec.replace("_SPEC", "").replace("_", " ");
}

// Helper function to format seating capacity
const formatSeatingCapacity = (seatingCapacity: string): string => {
  const numberOfSeats = parseInt(seatingCapacity); // Extract number from string
  if (numberOfSeats === 1) {
    return "single seater";
  } else if (numberOfSeats > 1) {
    return `${numberOfSeats}-seater`;
  }
  return seatingCapacity; // Fallback, just in case
};

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
  if (country != "ae") return states;

  const order = [
    "dubai",
    "abu-dhabi",
    "sharjah",
    "ras-al-khaimah",
    "ajman",
    "al-ain",
    "fujairah",
    "umm-al-quwain",
  ];

  return states.sort((a, b) => {
    return order.indexOf(a.stateValue) - order.indexOf(b.stateValue);
  });
}

// formatter to format the name of additional types in vehicleDetailsPage
export const formatAdditionalTypeName = (name: string) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * helper function for convert a string to its lowercase, hyphen separated version, free of non-alphanumeric characters, and leading/trailing hyphens, making it suitable for use in URLs.
 *
 * @param word - The string to convert.
 * @returns The converted string.
 */
export function convertToValue(word: string | null): string {
  if (!word) return "company-disabled";
  return word
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, "-") // Replace non-alphanumeric characters (except spaces) with hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
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
    companyName || "the company"
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

export function generateVehicleTitleSlug(vehicleTitle: string): string {
  const cleanText = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/ - /g, "-") // Handle hyphens within the string
      .replace(/[^a-z0-9-]+/g, "-") // Replace non-alphanumeric characters and spaces with hyphen
      .replace(/^-+|-+$/g, ""); // Remove any leading or trailing hyphens
  };

  const vehicleTitleSlug = cleanText(vehicleTitle);

  return vehicleTitleSlug;
}

/**
 * Generates a URL redirecting to the vehicle details page
 * @returns {string} URL redirecting to the vehicle details page
 */

type VehicleUrlHelperArg = {
  country: string;
  state: string;
  vehicleCategory: string;
  vehicleTitle: string;
  vehicleCode: string;
};

export const generateVehicleDetailsUrl = (
  vehicle: VehicleUrlHelperArg
): string => {
  const { country, state, vehicleCategory, vehicleTitle, vehicleCode } =
    vehicle;
  const formattedVehicleCode = vehicleCode.toLowerCase();

  const vehicleTitleSlug = generateVehicleTitleSlug(vehicleTitle);

  return `/${country}/${state}/${vehicleCategory}/${vehicleTitleSlug}-for-rent/${formattedVehicleCode}`;
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
  const formattedCountryCode = countryCode.startsWith("+")
    ? countryCode
    : `+${countryCode}`;

  return `${formattedCountryCode} ${phoneNumber}`;
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
  selectedPeriod: "hour" | "day" | "week" | "month" | null // Accept null
): string => {
  if (!selectedPeriod) return "/"; // Fallback if no period

  const [minPrice, maxPrice] = values;

  return `/${country}/${state}/listing/${category}?price=${minPrice}-${maxPrice}&period=${selectedPeriod}`;
};

type PeriodType = "hour" | "day" | "week" | "month";

const PERIOD_ORDER: PeriodType[] = ["day", "week", "month", "hour"];

/**
 * Formats and sorts available rental periods for price range filter.
 * Ensures correct order: Daily, Weekly, Monthly, Hourly.
 */
export function formatAndSortPeriods(availablePeriods: PeriodType[]) {
  const periodLabels: Record<PeriodType, string> = {
    day: "Daily",
    week: "Weekly",
    month: "Monthly",
    hour: "Hourly",
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
  const periodOrder: PeriodType[] = ["day", "week", "month", "hour"];

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
  if (!input) return ""; // Handle empty or undefined input
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Removes the "-for-rent" suffix from a category string, if present.
 *
 * @param {string} category - Category string to process
 * @returns {string} Processed category string
 */
export const extractCategory = (category: string): string => {
  return category.replace(/-for-rent$/, "");
};

// Generate blog URL title helper function
export function generateBlogUrlTitle(title: string): string {
  return title
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s&!-]/g, "") // Allow letters, numbers, spaces, &, hyphens, and !
    .replace(/\s*-\s*/g, "-") // Replace spaces around hyphens with a single hyphen
    .replace(/\s+/g, "-") // Replace remaining spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single one
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
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
      "70 Foot Luxury Yacht",
      "Majesty 56 Yacht",
      "88 Foot Luxury yacht ",
    ],
    vans: ["Toyota Sienna", "Volkswagen Crafter", "Toyota Rush"],
    "sports-cars": ["Ferrari 488", "Lamborghini Huracán", "Porsche 911"],
    "sports-bikes": ["Ducati Panigale", "Yamaha R1", "Kawasaki Ninja"],
    motorcycles: ["BMW F 800 GS", "Harley-Davidson", "Kawasaki NINJA"],
    "leisure-boats": ["Malibu Wakesetter", "Hobie Cat", "Yamaha AR250"],
    charters: ["Phenom 300", "Airbus H135", "Gulfstream G650"],
    cars: [
      "Toyota Yaris",
      "Tesla Cybertruck ",
      "BMW 5 Series 520i",
      "Mercedes C Class",
    ],
    buses: ["Yutong 37 Seater", "MAN Lion", "VDL"],
    buggies: ["Polaris RZR 200", "Yamaha ATV 700", "Honda Talon 1000R"],
    bicycles: ["Yadea KS3", "Polygon Siskiu T6e", "Polygon Strattos S7"],
  };

  const fallbackArray = [
    "Luxury Vehicles",
    "Premium Rentals",
    "Drive Your Dream",
  ];

  return categoryMap[category] || fallbackArray;
};

// Helper function to check if Show All button should be displayed for Features in the vehicle details page
// return true if there are more than 4 categories as well as any of the categories sub array
export const shouldShowDesktopFeaturesButton = (
  features: Record<string, FeatureType[]>
): boolean => {
  const categories = Object.entries(features);

  const isMoreThanFourCategories = categories.length > 4;
  const isLargeFeatureList = categories.some(
    ([_, featureList]) => featureList.length > 15
  );

  // return true if there is more than 4 categories as well as  at least one category has more than 15 items
  return isMoreThanFourCategories || isLargeFeatureList;
};

/**
 * Restores the vehicle code format by capitalizing the alphabetic part and
 * combining it back with the numeric part.
 */
export function restoreVehicleCodeFormat(lowerCaseCode: string): string {
  // Split the code into the alphabetic part and numeric part based on the hyphen
  const [alphabets, numbers] = lowerCaseCode.split("-");

  if (!alphabets || !numbers) {
    return lowerCaseCode;
  }

  // Capitalize the alphabets and combine them back with the numbers
  return `${alphabets.toUpperCase()}-${numbers}`;
}

/**
 * Returns the vehicle card style based on the layout type.
 */
export function getVehicleCardStyle(layoutType: "carousel" | "grid"): string {
  const styles = {
    carousel: `w-[14.8rem] min-w-[14.8rem] md:w-[14.84rem] md:min-w-[14.84rem] lg:w-[14.6rem] lg:min-w-[14.3rem]`,
    grid: `min-w-[12rem] max-w-full w-full md:max-w-[18rem] justify-self-center`,
  };

  return styles[layoutType] || "";
}

export const trimName = (name: string, maxLength: number = 20): string => {
  if (name.length <= maxLength) {
    return name;
  }
  return name.substring(0, maxLength) + "...";
};

interface AvatarProps {
  displayName: string;
  fallbackInitials: string;
}

export function getAvatarProps(
  fullName: string | null | undefined
): AvatarProps {
  // Handle invalid input
  if (!fullName?.trim()) {
    return { displayName: "", fallbackInitials: "?" };
  }

  const parts = fullName.trim().split(/\s+/);

  // Single name - use first two letters
  if (parts.length === 1) {
    const name = parts[0];
    const fallbackInitials =
      name.length >= 2
        ? name.substring(0, 2).toUpperCase()
        : name.charAt(0).toUpperCase();

    return {
      displayName: name,
      fallbackInitials: fallbackInitials,
    };
  }

  // Two names - use first letter of each name
  if (parts.length === 2) {
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");

    return {
      displayName: fullName.trim(),
      fallbackInitials: initials,
    };
  }

  // Three or more names - use first and last name initials only
  const first = parts[0];
  const last = parts[parts.length - 1];
  const initials = first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();

  // For display name: "First M. Last"
  const middle = parts.slice(1, -1);
  const middleInitials = middle
    .map((name) => name.charAt(0).toUpperCase() + ".")
    .join(" ");

  return {
    displayName: `${first || ""} ${middleInitials || ""} ${last || ""}`,
    fallbackInitials: initials,
  };
}

export const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
