import { useEffect, useState } from "react";

/**
 * Retrieves the user's location from the session storage.
 *
 * The location is expected to be stored as a JSON string in the session storage
 * under the key "userLocation". If the location is not found, or if the string
 * can't be parsed, the function returns null.
 *
 * @returns The user's location if it can be parsed, null otherwise.
 */

export function useUserLocation() {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const coordinatesString = sessionStorage.getItem("userLocation");
    if (coordinatesString) {
      try {
        setLocation(JSON.parse(coordinatesString));
      } catch (err) {
        console.error("Failed to parse coordinates:", err);
      }
    }
  }, []);
  return location;
}
