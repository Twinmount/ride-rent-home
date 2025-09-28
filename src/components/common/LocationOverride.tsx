import React from "react";
import { MapPin } from "lucide-react";
import { LocationInfo } from "@/utils/location-detection";
import ReactCountryFlag from "react-country-flag";
import countries from "world-countries";

interface LocationOverrideProps {
  detectedLocation: LocationInfo | null;
  selectedCountry: string;
  selectedCountryName?: string;
  className?: string;
}

// Get country data from world-countries package
const getCountryData = (countryCode: string) => {
  return countries.find(
    (country) => country.cca2 === countryCode.toUpperCase()
  );
};

// Enhanced country data with additional information
const SUPPORTED_COUNTRIES = [
  {
    code: "ae",
    label: "UAE",
    countryCode: "AE",
    fullName: getCountryData("AE")?.name?.common || "United Arab Emirates",
    region: getCountryData("AE")?.region || "Asia",
    capital: getCountryData("AE")?.capital?.[0] || "Abu Dhabi",
  },
  {
    code: "in",
    label: "India",
    countryCode: "IN",
    fullName: getCountryData("IN")?.name?.common || "India",
    region: getCountryData("IN")?.region || "Asia",
    capital: getCountryData("IN")?.capital?.[0] || "New Delhi",
  },
];

export function LocationOverride({
  detectedLocation,
  selectedCountry,
  selectedCountryName,
  className = "",
}: LocationOverrideProps) {
  // Get country info with fallback
  const getCountryInfo = () => {
    const countryInfo = SUPPORTED_COUNTRIES.find(
      (c) => c.code === selectedCountry
    );

    // Fallback to default UAE if country not found
    const fallbackCountry =
      SUPPORTED_COUNTRIES.find((c) => c.code === "ae") ||
      SUPPORTED_COUNTRIES[0];

    return {
      countryCode:
        countryInfo?.countryCode || fallbackCountry?.countryCode || "AE",
      label:
        selectedCountryName ||
        countryInfo?.label ||
        fallbackCountry?.label ||
        "UAE",
      fullName:
        countryInfo?.fullName ||
        fallbackCountry?.fullName ||
        "United Arab Emirates",
    };
  };

  const countryInfo = getCountryInfo();

  return (
    <div className={`flex items-center justify-between text-xs ${className}`}>
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>
          {detectedLocation
            ? `Detected: ${detectedLocation.city}, ${detectedLocation.countryCode}`
            : "Location not detected"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-foreground">
        <ReactCountryFlag
          countryCode={countryInfo.countryCode}
          svg
          style={{
            width: "16px",
            height: "12px",
          }}
          title={countryInfo.fullName}
        />
        <span className="text-sm font-medium">{countryInfo.label}</span>
      </div>
    </div>
  );
}
