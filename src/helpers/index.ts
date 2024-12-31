import qs from "query-string";
import {
  CategoryType,
  RemoveUrlQueryParams,
  StateType,
  UrlQueryParams,
} from "@/types";
import { CardRentalDetails, VehicleCardType } from "@/types/vehicle-types";
import { VehicleDetailsResponse } from "@/types/vehicle-details-types";
import { IoIosSpeedometer } from "react-icons/io";
import { FaCrown } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";

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

export const sortCategories = (categories: CategoryType[]): CategoryType[] => {
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

  return categories.sort((a, b) => {
    return order.indexOf(a.value) - order.indexOf(b.value);
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
  return `+${countryCode} ${phoneNumber}`;
};

// change to singular
export const singularizeType = (type: string) => {
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
  if (value.toLowerCase() === "suvs") {
    return "SUV's";
  }

  if (value.toLowerCase() === "suvs") {
    return "SUV's";
  }

  return value
    .split("-") // Split the value by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back with spaces
}

// Helper function to determine which rental period is available
export const getRentalPeriodDetails = (
  rentalDetails: CardRentalDetails | undefined
) => {
  if (rentalDetails?.hour?.enabled) {
    return {
      period: "Hour",
      rentInAED: rentalDetails.hour.rentInAED,
      label: `/ ${rentalDetails.hour.minBookingHours}Hrs`,
    };
  } else if (rentalDetails?.day?.enabled) {
    return {
      period: "Day",
      rentInAED: rentalDetails.day.rentInAED,
      label: "/ day",
    };
  } else if (rentalDetails?.week?.enabled) {
    return {
      period: "Week",
      rentInAED: rentalDetails.week.rentInAED,
      label: "/ week",
    };
  } else if (rentalDetails?.month?.enabled) {
    return {
      period: "Month",
      rentInAED: rentalDetails.month.rentInAED,
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

// Helper function to generate dynamic FAQs for the vehicle details page
export const generateDynamicFAQ = (
  vehicle: VehicleDetailsResponse["result"]
) => {
  const seatingCapacitySpec = vehicle.specs["Seating Capacity"];
  const availableCities = vehicle.cities.map((city) => city.label).join(", ");

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
      question: "How many people can travel in this vehicle?",
      answer: `This vehicle is a ${seatingCapacity} passenger carrier.`,
    });
  }

  return faqArray;
};
type GenerateModelDetailsUrlType = {
  brandName?: string; // Optional string
  model?: string; // Optional string
  state?: string; // Optional string
};

export function generateModelDetailsUrl(
  data: GenerateModelDetailsUrlType
): string {
  // Fallback values if vehicle details are missing
  const fallbackModel = "model";
  const fallbackState = "state";

  const cleanText = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/ - /g, "-") // Handle hyphens within the string
      .replace(/[^a-z0-9-]+/g, "-") // Replace non-alphanumeric characters and spaces with hyphen
      .replace(/^-+|-+$/g, ""); // Remove any leading or trailing hyphens
  };

  const model = cleanText(data.model || fallbackModel);
  const state = cleanText(data.state || fallbackState);

  return `rent-${model}-model-in-${state}`;
}

// helper function to dynamically generate riderent features based on state
export const createFeatureCards = (state: string) => [
  {
    key: 1,
    icon: IoIosSpeedometer,
    title: "Easy & Fast Booking",
    description: `From premium models to economy vehicles to rent in ${state}, find the perfect car at competitive rates. Secure your rental with just a few clicks and make the most of your ${state} trip. RIDE.RENT is the smart choice for 'Rent a Car in ${state}' services.`,
    bgClass: "black",
  },
  {
    key: 2,
    icon: FaCrown,
    title: "Many Pickup Locations",
    description: `From premium models to economy vehicles to rent in ${state}, find the perfect car at competitive rates. Secure your rental with just a few clicks and make the most of your ${state} trip. RIDE.RENT is the smart choice for 'Rent a Car in ${state}' services.`,
    bgClass: "blue",
  },
  {
    key: 3,
    icon: IoShieldCheckmark,
    title: "Ensured Delivery Promise",
    description: `Our commitment to punctuality means your chosen vehicle from our extensive 'Rent a Car in ${state}' collection is delivered when and where you need it. Seamless booking, transparent rates, and steadfast service—that's the RIDE.RENT promise.`,
    bgClass: "orange",
  },
];

export function rearrangeStates(states: StateType[]): StateType[] {
  const order = [
    "dubai",
    "abu-dhabi",
    "sharjah",
    "ras-al-khaima",
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

export function formatToUrlFriendly(word: string | null): string {
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
export const generateWhatsappUrl = (
  vehicle: VehicleCardType,
  vehicleDetailsPageLink: string
): string | null => {
  if (!vehicle.whatsappPhone || !vehicle.whatsappCountryCode) {
    return null;
  }

  const whatsappPageLink = `https://ride.rent/${vehicleDetailsPageLink}`;
  const message = `${whatsappPageLink}\n\nHello, I am interested in the *_${vehicle.model}_* model. Could you please provide more details?`;
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`;
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

/**
 * Generates a URL redirecting to the vehicle details page
 *
 * @param {VehicleCardType} vehicle - Vehicle object
 * @returns {string} URL redirecting to the vehicle details page
 */
export const generateVehicleDetailsUrl = (vehicle: VehicleCardType): string => {
  const modelDetails = generateModelDetailsUrl(vehicle);
  return `/${vehicle.state}/${vehicle.vehicleCategory}/${modelDetails}/${vehicle.vehicleId}`;
};

/**
 * Formats a phone number with the given country code
 *
 * @param {string | null} countryCode - Country code
 * @param {string | null} phoneNumber - Phone number
 * @returns {string | null} Formatted phone number or null if either param is null
 */
export const getFormattedPhoneNumber = (
  countryCode: string | null,
  phoneNumber: string | null
): string | null => {
  if (!countryCode || !phoneNumber) return null;
  return formatPhoneNumber(countryCode, phoneNumber);
};
