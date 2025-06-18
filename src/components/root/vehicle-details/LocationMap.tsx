"use client";

import { useEffect, useState } from "react";
import { GPSLocation } from "@/types/vehicle-details-types";

type LocationMapProps = {
  location: GPSLocation;
  mapImage: string;
};

function LocationMap({ location, mapImage }: LocationMapProps) {
  const { lat, lng } = location;
  const [distanceFromMe, setDistanceFromMe] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const coordinatesString = sessionStorage.getItem("userLocation");

      if (coordinatesString) {
        try {
          const parsedCoordinates = JSON.parse(coordinatesString);

          const distance = getDistanceFromLatLonInKm(
            parsedCoordinates?.latitude,
            parsedCoordinates?.longitude,
            lat,
            lng,
          );

          setDistanceFromMe(distance);
        } catch (err) {
          console.warn("Failed to parse userLocation:", err);
        }
      }
    }
  }, [lat, lng]);

  function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    if (
      !lat1 ||
      !lon1 ||
      !lat2 ||
      !lon2 ||
      isNaN(lat1) ||
      isNaN(lon1) ||
      isNaN(lat2) ||
      isNaN(lon2)
    )
      return 0;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function toRad(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  return (
    <div className="profile-card mt-4">
      <div className="profile-heading">
        <h2 className="custom-heading">
          {distanceFromMe !== null
            ? `${Math.round(distanceFromMe)} km away from your location`
            : "Location"}
        </h2>
      </div>
      <div className="h-full w-full">
        <img src={mapImage} alt="Map image" />
      </div>
    </div>
  );
}

export default LocationMap;
