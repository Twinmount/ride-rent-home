import { getCacheTime } from "@/helpers/cache.helper";

// Generate model years in 5-year increments starting from the current year
export const modelYears = Array.from(
  { length: Math.ceil((new Date().getFullYear() - 1900) / 5) },
  (_, i) => {
    const startYear = new Date().getFullYear() - 5 * i;
    const endYear = startYear - 4 > 1900 ? startYear - 4 : 1900;
    return `${startYear}-${endYear}`;
  }
);

// General seat count ranges
export const seats = ["1-2", "2-4", "4-6", "4-8", "8-20", "20-60"];

// transmissions
export const transmissions = [
  { label: "Automatic", value: "automatic" },
  { label: "Manual", value: "manual" },
];

// fuel types
export const fuelTypes = [
  { label: "Petrol", value: "petrol" },
  { label: "Electric", value: "electric" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Diesel", value: "diesel" },
];

// colors
export const colors = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Black", value: "black" },
  { label: "Brown", value: "brown" },
  { label: "White", value: "white" },
  { label: "Silver", value: "silver" },
  { label: "Off White", value: "off-white" },
  { label: "Orange", value: "orange" },
  { label: "Gray", value: "gray" },
  { label: "Dark Gray", value: "dark-gray" },
  { label: "Green", value: "green" },
  { label: "Champagne Gold", value: "champagne-gold" },
  { label: "Light Green", value: "light-green" },
  { label: "Maroon", value: "maroon" },
  { label: "Bronze", value: "bronze" },
  { label: "Burgundy", value: "burgundy" },
  { label: "Purple", value: "purple" },
  { label: "Pink", value: "pink" },
  { label: "Matte Gray", value: "matte-gray" },
  { label: "Matte Black", value: "matte-black" },
  { label: "Matte Red", value: "matte-red" },
  { label: "Lemon Yellow", value: "lemon-yellow" },
  { label: "Turquoise", value: "turquoise" },
  { label: "Matte Blue", value: "matte-blue" },
  { label: "Sapphire Blue", value: "sapphire-blue" },
  { label: "Metallic Silver", value: "metallic-silver" },
  { label: "Metallic Red", value: "metallic-red" },
  { label: "Metallic Gray", value: "metallic-gray" },
  { label: "Beige", value: "beige" },
  { label: "Golden", value: "golden" },
];

// payment methods
export const paymentMethods = [
  { label: "Crypto", value: "crypto" },
  { label: "Credit / Debit Card", value: "credit-debit-card" },
  { label: "Tabby", value: "tabby" },
  { label: "Cash", value: "cash" },
  { label: "Bank Transfer", value: "bank-transfer" },
  { label: "PayPal", value: "paypal" },
  // Popular in UAE/GCC region
  { label: "Emirates NBD", value: "emirates-nbd" },
  // Popular in India
  { label: "UPI", value: "upi" },
];

// following COUNTRIES, STATES, CATEGORIES will be used for handling dynamic homepage jsx content
export const COUNTRIES = {
  AE: "ae",
  IN: "in",
};

export const UAE_STATES = {
  DUBAI: "dubai",
  ABU_DHABI: "abu-dhabi",
  SHARJAH: "sharjah",
  AJMAN: "ajman",
  UMM_AL_QUWAIN: "umm-al-quwain",
  RAS_AL_KHAIMAH: "ras-al-khaimah",
  FUJAIRAH: "fujairah",
  AL_AIN: "al-ain",
} as const;

// India States
export const INDIA_STATES = {
  BANGALORE: "bangalore",
  CHENNAI: "chennai",
  DELHI: "delhi",
  GURGAON: "gurgaon",
  KOCHI: "kochi",
  KOLKATA: "kolkata",
  MUMBAI: "mumbai",
  NOIDA: "noida",
  PUNE: "pune",
  RAJASTHAN: "rajasthan",
  TELANGANA: "telangana",
  AHMEDABAD: "ahmedabad",
  PORT_BLAIR: "port-blair",
} as const;

export const CATEGORIES = {
  CARS: "cars",
  SPORTS_CARS: "sports-cars",
  MOTORCYCLES: "motorcycles",
  BICYCLES: "bicycles",
  BUSES: "buses",
  LEISURE_BOATS: "leisure-boats",
  YACHTS: "yachts",
  VANS: "vans",
  BUGGIES: "buggies",
  CHARTERS: "charters",
};

export const DETAILS_PAGE_RELATED_RESULTS_VARIANTS = {};

/**
 * Cache revalidation times for Next.js SSR components (in seconds)
 * 10 sec in APP_ENV=development, specified seconds in APP_ENV=production
 */
export const CACHE_REVALIDATE = {
  DEFAULT: getCacheTime(6 * 60 * 60), // 6 hours
  SHORT: getCacheTime(1 * 60 * 60), // 1 hour
  LONG: getCacheTime(24 * 60 * 60), // 24 hours
  VERY_SHORT: getCacheTime(15 * 60), // 15 minutes
} as const;
