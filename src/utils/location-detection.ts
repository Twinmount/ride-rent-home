/**
 * Location Detection Utilities
 * Provides functionality to detect user's country and set appropriate defaults
 */

export interface LocationInfo {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
  timezone?: string;
}

export interface GeolocationResponse {
  country: string;
  country_code: string;
  city?: string;
  region?: string;
  timezone?: string;
}

/**
 * Detects user's country using multiple IP geolocation services
 * Falls back to UAE as default if detection fails
 */
export async function detectUserCountry(): Promise<LocationInfo> {
  const fallbackLocation: LocationInfo = {
    country: "ae",
    countryCode: "AE",
    city: "Dubai",
    region: "Dubai",
  };

  // Country mapping for supported regions
  const countryMapping: Record<string, string> = {
    AE: "ae", // UAE
    IN: "in", // India
    SA: "ae", // Saudi Arabia -> UAE (closer market)
    QA: "ae", // Qatar -> UAE
    KW: "ae", // Kuwait -> UAE
    BH: "ae", // Bahrain -> UAE
    OM: "ae", // Oman -> UAE
    EG: "ae", // Egypt -> UAE
    JO: "ae", // Jordan -> UAE
    LB: "ae", // Lebanon -> UAE
    PK: "in", // Pakistan -> India
    BD: "in", // Bangladesh -> India
    LK: "in", // Sri Lanka -> India
    NP: "in", // Nepal -> India
    MY: "in", // Malaysia -> India (large Indian diaspora)
    SG: "in", // Singapore -> India (large Indian diaspora)
  };

  // List of services to try in order
  const services = [
    {
      name: "ipapi.co",
      url: "https://ipapi.co/json/",
      parseResponse: (data: any) => ({
        country: countryMapping[data.country_code] || fallbackLocation.country,
        countryCode: data.country_code,
        city: data.city,
        region: data.region,
        timezone: data.timezone,
      }),
    },
  ];

  for (const service of services) {
    try {
      console.log(`Trying ${service.name} for location detection...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(service.url, {
        method: "GET",
        cache: "no-cache",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const locationInfo = service.parseResponse(data);

        // Validate that we got meaningful data
        if (locationInfo.countryCode && locationInfo.city) {
          console.log(
            `Successfully detected location using ${service.name}:`,
            locationInfo
          );
          return {
            ...locationInfo,
            countryCode:
              locationInfo.countryCode || fallbackLocation.countryCode,
            city: locationInfo.city || fallbackLocation.city,
            region: locationInfo.region || fallbackLocation.region,
          };
        }
      }
    } catch (error) {
      console.warn(`${service.name} failed:`, error);
      continue; // Try next service
    }
  }

  console.info(
    "All geolocation services failed, using fallback location (UAE)"
  );
  return fallbackLocation;
}

/**
 * Gets the default phone country code based on detected country
 */
export function getPhoneCountryFromLocation(
  locationInfo: LocationInfo
): string {
  const phoneCountryMapping: Record<string, string> = {
    ae: "ae", // UAE
    in: "in", // India
  };

  return phoneCountryMapping[locationInfo.country] || "ae";
}

/**
 * Caches location detection result to avoid repeated API calls
 */
export class LocationCache {
  private static readonly CACHE_KEY = "ride_rent_detected_location";
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static set(locationInfo: LocationInfo): void {
    if (typeof window !== "undefined") {
      const cacheData = {
        location: locationInfo,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    }
  }

  static get(): LocationInfo | null {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > this.CACHE_DURATION;

      if (isExpired) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return cacheData.location;
    } catch {
      return null;
    }
  }

  static clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.CACHE_KEY);
    }
  }
}

/**
 * Gets user location with caching
 */
export async function getUserLocation(): Promise<LocationInfo> {
  // Check cache first
  // const cached = LocationCache.get();
  // if (cached) {
  //   return cached;
  // }

  // Detect new location
  const location = await detectUserCountry();

  // Cache the result
  LocationCache.set(location);

  return location;
}
