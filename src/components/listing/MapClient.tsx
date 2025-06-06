// @ts-nocheck

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Car, Clock, MapPin, X } from "lucide-react";
import { useFetchListingVehiclesGPS } from "@/hooks/useFetchListingVehiclesGPS";
import { usePriceConverter } from "@/hooks/usePriceConverter";
import { useParams, useSearchParams } from "next/navigation";
import { ENV } from "@/config/env";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { useImmer } from "use-immer";
import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import Link from "next/link";

const vehiclesListss = [
  {
    vehicleModel: "Toyota Innova",
    rentalDetails: { day: "100", week: null, month: null, hour: null },
    vehicleCode: "V001",
    location: { lat: 8.896512, lng: 76.6312448, address: "Base Location" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Hyundai Creta",
    rentalDetails: { day: "110", week: null, month: null, hour: null },
    vehicleCode: "V002",
    location: { lat: 8.896552, lng: 76.6312648, address: "Nearby Location A" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Honda City",
    rentalDetails: { day: "905", week: null, month: null, hour: null },
    vehicleCode: "V003",
    location: { lat: 8.896472, lng: 76.6312148, address: "Nearby Location B" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Tata Punch",
    rentalDetails: { day: "900", week: null, month: null, hour: null },
    vehicleCode: "V004",
    location: { lat: 8.89649, lng: 76.6312788, address: "Nearby Location C" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Maruti Baleno",
    rentalDetails: { day: "850", week: null, month: null, hour: null },
    vehicleCode: "V005",
    location: { lat: 8.89653, lng: 76.63123, address: "Nearby Location D" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Mahindra Scorpio",
    rentalDetails: { day: "120", week: null, month: null, hour: null },
    vehicleCode: "V006",
    location: { lat: 8.8965, lng: 76.6312, address: "Nearby Location E" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Kia Sonet",
    rentalDetails: { day: "105", week: null, month: null, hour: null },
    vehicleCode: "V007",
    location: { lat: 8.896548, lng: 76.63121, address: "Nearby Location F" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Renault Triber",
    rentalDetails: { day: null, week: "399", month: null, hour: null },
    vehicleCode: "V008",
    location: { lat: 8.896495, lng: 76.631255, address: "Nearby Location G" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Volkswagen Vento",
    rentalDetails: { day: "908", week: null, month: null, hour: null },
    vehicleCode: "V009",
    location: { lat: 8.89647, lng: 76.631235, address: "Nearby Location H" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Nissan Magnite",
    rentalDetails: { day: "102", week: null, month: null, hour: null },
    vehicleCode: "V010",
    location: { lat: 8.89652, lng: 76.63129, address: "Nearby Location I" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Toyota Innova",
    rentalDetails: { day: "100", week: null, month: null, hour: null },
    vehicleCode: "V011",
    location: { lat: 8.896513, lng: 76.6312458, address: "Base Location 2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Hyundai Creta",
    rentalDetails: { day: "110", week: null, month: null, hour: null },
    vehicleCode: "V012",
    location: { lat: 8.896553, lng: 76.6312658, address: "Nearby Location A2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Honda City",
    rentalDetails: { day: "950", week: null, month: null, hour: null },
    vehicleCode: "V013",
    location: { lat: 8.896473, lng: 76.6312158, address: "Nearby Location B2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Tata Punch",
    rentalDetails: { day: "90", week: null, month: null, hour: null },
    vehicleCode: "V014",
    location: { lat: 8.896491, lng: 76.6312798, address: "Nearby Location C2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Maruti Baleno",
    rentalDetails: { day: "85", week: null, month: null, hour: null },
    vehicleCode: "V015",
    location: { lat: 8.896531, lng: 76.631231, address: "Nearby Location D2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Mahindra Scorpio",
    rentalDetails: { day: "120", week: null, month: null, hour: null },
    vehicleCode: "V016",
    location: { lat: 8.896501, lng: 76.631201, address: "Nearby Location E2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Kia Sonet",
    rentalDetails: { day: "105", week: null, month: null, hour: null },
    vehicleCode: "V017",
    location: { lat: 8.896549, lng: 76.631211, address: "Nearby Location F2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Renault Triber",
    rentalDetails: { day: "88", week: null, month: null, hour: null },
    vehicleCode: "V018",
    location: { lat: 8.896496, lng: 76.631256, address: "Nearby Location G2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Volkswagen Vento",
    rentalDetails: { day: "98", week: null, month: null, hour: null },
    vehicleCode: "V019",
    location: { lat: 8.896471, lng: 76.631236, address: "Nearby Location H2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
  {
    vehicleModel: "Nissan Magnite",
    rentalDetails: { day: "102", week: null, month: null, hour: null },
    vehicleCode: "V020",
    location: { lat: 8.896521, lng: 76.631291, address: "Nearby Location I2" },
    companyShortId: "C001",
    companyName: "Company 2",
  },
];

interface Vehicle {
  vehicleModel: string;
  rentalDetails: {
    day: string | null;
    week: string | null;
    month: string | null;
    hour: string | null;
  };
  vehicleCode: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  companyShortId: string;
  companyName: string;
  originalLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  isAdjusted?: boolean;
}

interface Company {
  companyName: string;
  companyShortId: string;
  companyLogo: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

// Helper function to detect if two locations are very close
const areLocationsClose = (loc1, loc2, threshold = 0.0001) => {
  const latDiff = Math.abs(loc1.lat - loc2.lat);
  const lngDiff = Math.abs(loc1.lng - loc2.lng);
  return latDiff < threshold && lngDiff < threshold;
};

// Function to adjust positions for overlapping markers
const adjustOverlappingPositions = (vehicles, offsetDistance = 0.00015) => {
  const adjusted = [...vehicles];
  const processed = new Set();

  for (let i = 0; i < adjusted.length; i++) {
    if (processed.has(i)) continue;

    const overlapping = [i];

    // Find all vehicles that overlap with current vehicle
    for (let j = i + 1; j < adjusted.length; j++) {
      if (processed.has(j)) continue;

      if (areLocationsClose(adjusted[i].location, adjusted[j].location)) {
        overlapping.push(j);
      }
    }

    // If overlapping vehicles found, adjust their positions
    if (overlapping.length > 1) {
      overlapping.forEach((index, arrayIndex) => {
        processed.add(index);

        if (arrayIndex === 0) return; // Keep first vehicle at original position

        // Calculate circular offset positions
        const angle = (arrayIndex * 2 * Math.PI) / overlapping.length;
        const radius = offsetDistance * Math.ceil(arrayIndex / 8); // Increase radius for more vehicles

        adjusted[index] = {
          ...adjusted[index],
          location: {
            ...adjusted[index].location,
            lat: adjusted[index].location.lat + Math.cos(angle) * radius,
            lng: adjusted[index].location.lng + Math.sin(angle) * radius,
          },
          originalLocation: vehicles[index].location, // Keep reference to original
          isAdjusted: true,
        };
      });
    }
  }

  return adjusted;
};

// Vehicle Details Popup Component
const VehiclePopup = ({
  vehicles,
  onClose,
  country,
  state,
  category,
  baseUrl,
  convert,
}) => (
  <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <MapPin className="h-5 w-5 text-blue-500" />
          {vehicles.length === 1
            ? "Vehicle Details"
            : `${vehicles.length} Vehicles Available`}
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto p-6">
        <div className="space-y-4">
          {vehicles.map((vehicle) => {
            const aagentLink = generateCompanyProfilePageLink(
              vehicle.companyName,
              vehicle.companyShortId,
              country,
            );

            const vehicleDetailsPageLink = generateVehicleDetailsUrl({
              vehicleTitle: vehicle.vehicleModel,
              state: state,
              vehicleCategory: category,
              vehicleCode: vehicle.vehicleCode,
              country: country,
            });

            return (
              <div
                key={vehicle.vehicleCode}
                className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-lg transition-all hover:shadow-xl"
              >
                {/* Vehicle Details Box */}
                <Link
                  target="_blank"
                  href={`https://dev.ride.rent${vehicleDetailsPageLink}`}
                  className="block rounded-lg border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    {/* Left: Vehicle Info */}
                    <div>
                      <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-blue-900">
                        <Car className="h-5 w-5 text-blue-500" />
                        {vehicle.vehicleModel}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Code: {vehicle.vehicleCode}
                      </p>
                      {vehicle.isAdjusted && (
                        <p className="text-orange-600 mt-1 text-xs font-medium">
                          ⚠ Position adjusted for visibility
                        </p>
                      )}
                    </div>

                    {/* Right: Price Info */}
                    <div className="space-y-1 text-right text-yellow">
                      {vehicle.rentalDetails.day && (
                        <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                          {convert(Number(vehicle.rentalDetails.day))}
                          <span className="ml-1 text-xs text-gray-500">
                            / day
                          </span>
                        </p>
                      )}
                      {vehicle.rentalDetails.week && (
                        <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                          {convert(Number(vehicle.rentalDetails.week))}
                          <span className="ml-1 text-xs text-gray-500">
                            / week
                          </span>
                        </p>
                      )}
                      {vehicle.rentalDetails.month && (
                        <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                          {convert(Number(vehicle.rentalDetails.month))}
                          <span className="ml-1 text-xs text-gray-500">
                            / month
                          </span>
                        </p>
                      )}
                      {vehicle.rentalDetails.hour && (
                        <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                          {convert(Number(vehicle.rentalDetails.hour))}
                          <span className="ml-1 text-xs text-gray-500">
                            / hour
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Vendor Box */}
                <Link
                  target="_blank"
                  href={`https://dev.ride.rent${aagentLink}`}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-400 hover:bg-white"
                >
                  {/* Logo */}
                  {vehicle.companyLogo ? (
                    <img
                      src={`${baseUrl}/file/stream?path=${vehicle.companyLogo}`}
                      alt={vehicle.companyName}
                      className="h-12 w-12 rounded-full border border-gray-200 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600">
                      N/A
                    </div>
                  )}

                  {/* Name */}
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Vendor:</span>{" "}
                    {vehicle.companyName}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

const MapClient = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markerClusterer, setMarkerClusterer] = useState(null);
  const searchParams = useSearchParams();
  const { state, category } = useStateAndCategory();
  const [companiesList, setCompaniesList] = useImmer<Company[]>([]);
  const [vehiclesList, setVehiclesList] = useImmer<Vehicle[]>([]);
  const [center, setCenter] = useImmer({ lat: 0.001, lng: 0.001 });

  const params = useParams();
  const country = Array.isArray(params.country)
    ? params.country[0]
    : params.country || "ae";

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  const coordinatesString = sessionStorage.getItem("userLocation") ?? null;

  let parsedCoordinates = null;

  if (coordinatesString) {
    parsedCoordinates = JSON.parse(coordinatesString);
  }

  const baseUrl =
    country === "in" ? ENV.NEXT_PUBLIC_API_URL_INDIA : ENV.NEXT_PUBLIC_API_URL;

  const limit = 200;
  const { vehiclesGPS, coordinatesForUi, isFetching } =
    useFetchListingVehiclesGPS({
      searchParams: searchParams.toString(),
      state,
      limit,
      country,
      coordinates: parsedCoordinates,
    });

  const { convert } = usePriceConverter();

  const memoizedData = useMemo(() => {
    if (!vehiclesGPS) return { companies: [], vehicles: [] };

    const companyMap = new Map();
    const companies: Company[] = [];
    const vehicles: Vehicle[] = [];

    for (const item of vehiclesGPS) {
      const { company, ...vehicle } = item;
      const key = `${company.companyShortId}-${company.location.lat}-${company.location.lng}`;

      if (!companyMap.has(key)) {
        companyMap.set(key, true);
        companies.push(company);
      }

      vehicles.push({
        ...vehicle,
        companyShortId: company.companyShortId,
        companyName: company.companyName,
        companyLogo: company.companyLogo,
      });
    }

    return { companies, vehicles };
  }, [vehiclesGPS]);

  useEffect(() => {
    if (coordinatesForUi) {
      setCenter({ lat: coordinatesForUi.lat, lng: coordinatesForUi.lng });
    }
  }, [coordinatesForUi]);

  useEffect(() => {
    setCompaniesList(memoizedData.companies);
    setVehiclesList([...memoizedData.vehicles, ...vehiclesListss]);
  }, [memoizedData]);

  // Load Google Maps API
  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key is required");
      setIsLoading(false);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Load MarkerClusterer
      const clustererScript = document.createElement("script");
      clustererScript.src =
        "https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js";
      clustererScript.onload = () => {
        setIsLoading(false);
      };
      clustererScript.onerror = () => {
        setError("Failed to load MarkerClusterer library");
        setIsLoading(false);
      };
      document.head.appendChild(clustererScript);
    };

    script.onerror = () => {
      setError("Failed to load Google Maps API");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll(
        'script[src*="maps.googleapis.com"], script[src*="markerclusterer"]',
      );
      scripts.forEach((script) => script.remove());
    };
  }, [apiKey]);

  // Initialize map
  // useEffect(() => {
  //   const initMap = () => {
  //     if (!isLoading && !error && mapRef.current && !map && center.lat !== 0.001) {
  //       const mapInstance = new window.google.maps.Map(mapRef.current, {
  //         center: center,
  //         zoom: 15,
  //         styles: [
  //           {
  //             featureType: "poi",
  //             elementType: "labels",
  //             stylers: [{ visibility: "off" }],
  //           },
  //         ],
  //       });

  //       setMap(mapInstance);
  //     }
  //   };
  //   const timer = setTimeout(initMap, 1000);
  //   return () => clearTimeout(timer);
  // }, [isLoading, error, map, center]);

  useEffect(() => {
    let initializationAttempted = false;
    let timeoutId;

    const initMap = () => {
      // Your exact condition check
      if (
        !isLoading &&
        !error &&
        mapRef.current &&
        !map &&
        center.lat !== 0.001
      ) {
        initializationAttempted = true;

        console.log("Initializing map with center:", center); // Debug log

        try {
          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: 15,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });

          // Add debug event listeners
          mapInstance.addListener("tilesloaded", () => {
            console.log("Map tiles fully loaded");
          });

          mapInstance.addListener("idle", () => {
            if (!document.querySelector(".gm-style")) {
              console.warn("Map container empty - triggering recovery");
              google.maps.event.trigger(mapInstance, "resize");
              mapInstance.setCenter(center);
            }
          });

          setMap(mapInstance);
        } catch (err) {
          console.error("Map initialization failed:", err);
        }
      } else if (!initializationAttempted) {
        // Debug why initialization didn't occur
        console.log("Initialization skipped because:", {
          isLoading,
          error,
          hasMapRef: !!mapRef.current,
          mapExists: !!map,
          validCenter: center.lat !== 0.001,
        });
      }
    };

    // First attempt (immediate)
    initMap();

    // Fallback attempt after delay if not initialized
    if (!initializationAttempted) {
      timeoutId = setTimeout(() => {
        console.log("Fallback initialization attempt");
        initMap();
      }, 500);
    }

    return () => {
      clearTimeout(timeoutId);
      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [isLoading, error, map, center]);

  // Helper function to get best available price and period
  const getBestPrice = (rentalDetails) => {
    if (rentalDetails.day) return { price: rentalDetails.day, period: "day" };
    if (rentalDetails.week)
      return { price: rentalDetails.week, period: "week" };
    if (rentalDetails.month)
      return { price: rentalDetails.month, period: "month" };
    if (rentalDetails.hour)
      return { price: rentalDetails.hour, period: "hour" };
    return { price: "0", period: "day" };
  };

  // Enhanced marker creation with overlap prevention and hover effects
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    if (markerClusterer) {
      markerClusterer.clearMarkers();
    }

    // Adjust positions for overlapping vehicles
    const adjustedVehicles = adjustOverlappingPositions(vehiclesList);

    // Create markers for each vehicle with enhanced styling
    const markers = adjustedVehicles.map((vehicle, index) => {
      const { price, period } = getBestPrice(vehicle.rentalDetails);
      const convertPrice = convert(Number(price));

      // Create enhanced marker with hover effects
      const marker = new window.google.maps.Marker({
        position: { lat: vehicle.location.lat, lng: vehicle.location.lng },
        title: `${vehicle.vehicleModel} - ₹${price}/${period}${vehicle.isAdjusted ? " (Position Adjusted)" : ""}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="35" viewBox="0 0 65 35">
              <defs>
                <filter id="shadow${index}" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
              </defs>
              <rect x="3" y="3" width="59" height="29" rx="14" ry="14" 
                    fill="${vehicle.isAdjusted ? "#6B7280" : "#6B7280"}" stroke="white" stroke-width="2" 
                    filter="url(#shadow${index})" class="marker-bg"/>
              <text x="32.5" y="21" font-family="Arial, sans-serif" 
                    font-size="11" font-weight="bold" text-anchor="middle" 
                    fill="white">${convertPrice}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(65, 35),
          anchor: new window.google.maps.Point(32.5, 17),
        },
        zIndex: vehicle.isAdjusted ? 200 : 100, // Higher z-index for adjusted markers
      });

      // Enhanced click listener
      marker.addListener("click", () => {
        setSelectedVehicles([vehicle]);
      });

      // Add hover effect using mouseover/mouseout
      marker.addListener("mouseover", () => {
        // Increase z-index on hover
        marker.setZIndex(1000 + index);

        // Create hover icon with different styling
        const hoverIcon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="40" viewBox="0 0 75 40">
              <defs>
                <filter id="glow${index}" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(59, 130, 246, 0.5)"/>
                </filter>
              </defs>
              <rect x="3" y="3" width="69" height="34" rx="17" ry="17" 
                    fill="#3B82F6" stroke="white" stroke-width="3" 
                    filter="url(#glow${index})"/>
              <text x="37.5" y="24" font-family="Arial, sans-serif" 
                    font-size="12" font-weight="bold" text-anchor="middle" 
                    fill="white">${convertPrice}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(75, 40),
          anchor: new window.google.maps.Point(37.5, 20),
        };

        marker.setIcon(hoverIcon);
      });

      marker.addListener("mouseout", () => {
        // Reset z-index
        marker.setZIndex(vehicle.isAdjusted ? 200 : 100);

        // Reset to original icon
        const originalIcon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="35" viewBox="0 0 65 35">
              <defs>
                <filter id="shadow${index}" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
              </defs>
              <rect x="3" y="3" width="59" height="29" rx="14" ry="14" 
                    fill="${vehicle.isAdjusted ? "#6B7280" : "#6B7280"}" stroke="white" stroke-width="2" 
                    filter="url(#shadow${index})"/>
              <text x="32.5" y="21" font-family="Arial, sans-serif" 
                    font-size="11" font-weight="bold" text-anchor="middle" 
                    fill="white">${convertPrice}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(65, 35),
          anchor: new window.google.maps.Point(32.5, 17),
        };

        marker.setIcon(originalIcon);
      });

      // Store vehicle data with marker
      marker.vehicleData = vehicle;
      return marker;
    });

    // Create clusterer if MarkerClusterer is available
    if (window.markerClusterer && window.markerClusterer.MarkerClusterer) {
      const clusterer = new window.markerClusterer.MarkerClusterer({
        map,
        markers,
        renderer: {
          render: ({ count, position, markers }) => {
            // Calculate price range for the cluster based on day prices only
            const vehicles = markers
              .map((marker) => marker.vehicleData)
              .filter(Boolean);
            const dayPrices = vehicles
              .map((v) =>
                v.rentalDetails.day ? parseInt(v.rentalDetails.day) : null,
              )
              .filter((price) => price !== null);

            let minPrice, maxPrice, priceText;

            if (dayPrices.length > 0) {
              minPrice = convert(Number(Math.min(...dayPrices)));
              maxPrice = convert(Number(Math.max(...dayPrices)));
              priceText = minPrice === maxPrice ? `${minPrice}` : `${minPrice}`;
            } else {
              // If no day prices, use the best available prices
              const bestPrices = vehicles.map((v) => {
                const { price } = getBestPrice(v.rentalDetails);
                return parseInt(price);
              });
              minPrice = convert(Number(Math.min(...bestPrices)));
              maxPrice = convert(Number(Math.max(...bestPrices)));
              priceText = minPrice === maxPrice ? `${minPrice}` : `${minPrice}`;
            }

            // Determine color and size based on count
            let color,
              size,
              textColor = "white";

            if (count >= 20) {
              color = "#DC2626"; // Red for 20+ vehicles
              size = 80;
            } else if (count >= 10) {
              color = "#EA580C"; // Orange for 10-19 vehicles
              size = 80;
            } else {
              color = "#F97316"; // Light orange for 5-9 vehicles
              size = 50;
            }

            const fontSize = size > 65 ? 11 : size > 50 ? 10 : 9;

            return new window.google.maps.Marker({
              position,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="${color}" stroke="white" stroke-width="3"/>
                    <text x="${size / 2}" y="${size / 2 - 8}" font-family="Arial, sans-serif" font-size="${fontSize + 2}" font-weight="bold" text-anchor="middle" fill="${textColor}">${count}</text>
                    <text x="${size / 2}" y="${size / 2 + 4}" font-family="Arial, sans-serif" font-size="${fontSize - 1}" font-weight="normal" text-anchor="middle" fill="${textColor}">Starting From</text>
                    <text x="${size / 2}" y="${size / 2 + 18}" font-family="Arial, sans-serif" font-size="${fontSize - 1}" font-weight="normal" text-anchor="middle" fill="${textColor}">${priceText}</text>
                  </svg>
                `)}`,
                scaledSize: new window.google.maps.Size(size, size),
                anchor: new window.google.maps.Point(size / 2, size / 2),
              },
              zIndex: 1000 + count,
            });
          },
        },
      });

      // Add cluster click listener
      clusterer.addListener("clusterclick", (event, cluster) => {
        const clusterMarkers = cluster.markers;
        const vehicles = clusterMarkers
          .map((marker) => marker.vehicleData)
          .filter(Boolean);
        if (vehicles.length > 0) {
          setSelectedVehicles(vehicles);
        }
      });

      setMarkerClusterer(clusterer);
    } else {
      // Fallback: add markers directly to map without clustering
      markers.forEach((marker) => marker.setMap(map));
    }

    return () => {
      if (markerClusterer) {
        markerClusterer.clearMarkers();
      }
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [map, vehiclesList]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl text-red-500">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Error Loading Map
          </h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your API key and internet connection.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || isFetching || center.lat === 0.001) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="font-medium text-gray-600">Loading Google Maps...</p>
          <p className="mt-2 text-sm text-gray-500">
            Initializing map and vehicle data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Google Maps Container */}
      <div
        ref={mapRef}
        className="h-full w-full"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      />

      {/* Vehicle Details Popup */}
      {selectedVehicles && (
        <VehiclePopup
          vehicles={selectedVehicles}
          onClose={() => setSelectedVehicles(null)}
          country={country}
          state={state}
          category={category}
          baseUrl={baseUrl}
          convert={convert}
        />
      )}

      {/* Instructions Panel */}
      <div className="absolute left-4 top-4 z-10 max-w-sm rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
          <MapPin className="h-4 w-4 text-blue-500" />
          Vehicle Map Guide
        </h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Gray badges: Individual vehicles with prices</li>
          <li>• Orange/Red clusters: Multiple vehicles</li>
          <li>• Click any marker to see details</li>
          <li>• Zoom to see different clustering levels</li>
        </ul>
        <div className="mt-3 border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-500">
            Total vehicles: {vehiclesList.length}
          </p>
        </div>
      </div>

      {/* Legend */}
    </div>
  );
};

export default MapClient;
