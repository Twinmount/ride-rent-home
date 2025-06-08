// @ts-nocheck

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Car, MapPin, X } from "lucide-react";
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
import { VehicleDetailsDialog } from "./VehicleDetailsDialog";
import {
  calculateDistance,
  adjustOverlappingPositions,
  calculateBounds,
  areLocationsClose,
  vehiclesListss,
} from "@/helpers/map-helpers";

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

const minimalTheme = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7c7c7c" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#144b53" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#f5f5f2" }],
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [{ color: "#d0d0d0" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#bae5ce" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#696969" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "transit",
    elementType: "geometry.fill",
    stylers: [{ color: "#d0d0d0" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#a2daf2" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#92998d" }],
  },
];

const MapClient = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markerClusterer, setMarkerClusterer] = useState(null);
  const [restrictionCircle, setRestrictionCircle] = useState(null);
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

  const coordinatesString = sessionStorage?.getItem("userLocation") ?? null;

  let parsedCoordinates = null;

  if (coordinatesString) {
    parsedCoordinates = JSON.parse(coordinatesString);
  }

  const baseUrl =
    country === "in" ? ENV.NEXT_PUBLIC_API_URL_INDIA : ENV.NEXT_PUBLIC_API_URL;

  const limit = 200;

  const RADIUS_KM = 100;

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

  useEffect(() => {
    let initializationAttempted = false;
    let timeoutId;

    const initMap = () => {
      if (
        !isLoading &&
        !error &&
        mapRef.current &&
        !map &&
        center.lat !== 0.001
      ) {
        initializationAttempted = true;

        try {
          // Calculate bounds for 200km restriction
          const bounds = calculateBounds(center.lat, center.lng, RADIUS_KM);

          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: 12, // Adjusted zoom to better show 200km area
            restriction: {
              latLngBounds: {
                north: bounds.north,
                south: bounds.south,
                east: bounds.east,
                west: bounds.west,
              },
              strictBounds: true, // Prevent panning outside bounds
            },
            styles: minimalTheme,
            // Additional map options to enhance restriction
            minZoom: 8, // Prevent zooming out too far
            maxZoom: 18,
          });

          // Create visual circle to show the restriction area
          const circle = new window.google.maps.Circle({
            strokeColor: "#FF6B6B",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF6B6B",
            fillOpacity: 0.1,
            map: mapInstance,
            center: center,
            radius: RADIUS_KM * 1000, // Convert km to meters
            clickable: false,
          });

          setRestrictionCircle(circle);

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

          // Add boundary enforcement listener
          mapInstance.addListener("center_changed", () => {
            const currentCenter = mapInstance.getCenter();
            const distance = calculateDistance(
              center.lat,
              center.lng,
              currentCenter.lat(),
              currentCenter.lng(),
            );

            // If user tries to pan outside 200km, snap back to edge
            if (distance > RADIUS_KM) {
              const bearing = Math.atan2(
                currentCenter.lng() - center.lng,
                currentCenter.lat() - center.lat,
              );

              const maxDistance = RADIUS_KM - 10; // 10km buffer from edge
              const maxLat =
                center.lat + (maxDistance / 111.32) * Math.cos(bearing);
              const maxLng =
                center.lng +
                (maxDistance /
                  (111.32 * Math.cos((center.lat * Math.PI) / 180))) *
                  Math.sin(bearing);

              mapInstance.setCenter({ lat: maxLat, lng: maxLng });
            }
          });

          setMap(mapInstance);
        } catch (err) {
          console.error("Map initialization failed:", err);
        }
      } else if (!initializationAttempted) {
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
      if (restrictionCircle) {
        restrictionCircle.setMap(null);
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
              color = "#EF4444"; // Red for 20+ vehicles
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
                    <defs>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2" />
                      </filter>
                    </defs>
                    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow)"/>
                    
                    <text x="50%" y="${size / 2 - 10}" font-family="Segoe UI, sans-serif" text-anchor="middle" fill="${textColor}">
                      <tspan font-size="${fontSize + 2}" font-weight="700">${count}</tspan>
                      <tspan font-size="${fontSize - 2}" font-weight="400">vehicles</tspan>
                    </text>
                    
                    <text x="50%" y="${size / 2 + 4}" font-family="Segoe UI, sans-serif" font-size="${fontSize - 1}" font-weight="500" text-anchor="middle" fill="${textColor}">
                      Starting From
                    </text>
                    
                    <text x="50%" y="${size / 2 + 20}" font-family="Segoe UI, sans-serif" font-size="${fontSize}" font-weight="600" text-anchor="middle" fill="${textColor}">
                      ${priceText}
                    </text>
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

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedVehicles) {
      setOpen(true);
    }
  }, [selectedVehicles]);

  useEffect(() => {
    if (open === false) {
      setSelectedVehicles(null);
    }
  }, [open]);

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
        <VehicleDetailsDialog
          open={open}
          setOpen={setOpen}
          country={country}
          vehicles={selectedVehicles}
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
    </div>
  );
};

export default MapClient;
