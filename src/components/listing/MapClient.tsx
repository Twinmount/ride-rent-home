// @ts-nocheck

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Car, MapPin, X } from 'lucide-react';
import { useFetchListingVehiclesGPS } from '@/hooks/useFetchListingVehiclesGPS';
import { usePriceConverter } from '@/hooks/usePriceConverter';
import { useParams, useSearchParams } from 'next/navigation';
import { ENV } from '@/config/env';
import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import { useImmer } from 'use-immer';
import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from '@/helpers';
import Link from 'next/link';
import { VehicleDetailsDialog } from './VehicleDetailsDialog';
import {
  calculateDistance,
  adjustOverlappingPositions,
  calculateBounds,
  areLocationsClose,
  minimalTheme,
} from '@/helpers/map-helpers';
import { useGlobalContext } from '@/context/GlobalContext';
import { createMarkerIcon } from './map-icons/marker-icon';

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
  const [companiesList, setCompaniesList] = useImmer([]);
  const [center, setCenter] = useImmer({ lat: 0.001, lng: 0.001 });

  const { vehicleListVisible } = useGlobalContext();

  const params = useParams();
  const country = Array.isArray(params.country)
    ? params.country[0]
    : params.country || 'ae';

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  const coordinatesString = sessionStorage?.getItem('userLocation') ?? null;

  let parsedCoordinates = null;

  if (coordinatesString) {
    parsedCoordinates = JSON.parse(coordinatesString);
  }

  const baseUrl =
    country === 'in' ? ENV.NEXT_PUBLIC_API_URL_INDIA : ENV.NEXT_PUBLIC_API_URL;

  const limit = 200;

  const RADIUS_KM = 1000;

  const { convert } = usePriceConverter();

  // Calculate center point from all vehicles using useMemo for optimization
  const calculatedCenter = useMemo(() => {
    if (!vehicleListVisible || vehicleListVisible.length === 0) {
      return { lat: 0.001, lng: 0.001 };
    }

    // Calculate geometric center (centroid) of all vehicle locations
    const validVehicles = vehicleListVisible.filter(
      (vehicle) =>
        vehicle.location &&
        typeof vehicle.location.lat === 'number' &&
        typeof vehicle.location.lng === 'number' &&
        !isNaN(vehicle.location.lat) &&
        !isNaN(vehicle.location.lng)
    );

    if (validVehicles.length === 0) {
      return { lat: 0.001, lng: 0.001 };
    }

    const totalLat = validVehicles.reduce(
      (sum, vehicle) => sum + vehicle.location.lat,
      0
    );
    const totalLng = validVehicles.reduce(
      (sum, vehicle) => sum + vehicle.location.lng,
      0
    );

    return {
      lat: totalLat / validVehicles.length,
      lng: totalLng / validVehicles.length,
    };
  }, [vehicleListVisible]);

  // Update center when calculatedCenter changes
  useEffect(() => {
    if (calculatedCenter.lat !== 0.001 && calculatedCenter.lng !== 0.001) {
      setCenter(calculatedCenter);
    }
  }, [calculatedCenter, setCenter]);

  // Load Google Maps API - Optimized to load only once
  useEffect(() => {
    if (!apiKey) {
      setError('Google Maps API key is required');
      setIsLoading(false);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    // Minimal libraries to reduce API usage
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Load MarkerClusterer
      const clustererScript = document.createElement('script');
      clustererScript.src =
        'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
      clustererScript.onload = () => {
        setIsLoading(false);
      };
      clustererScript.onerror = () => {
        setError('Failed to load MarkerClusterer library');
        setIsLoading(false);
      };
      document.head.appendChild(clustererScript);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps API');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll(
        'script[src*="maps.googleapis.com"], script[src*="markerclusterer"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, [apiKey]);

  // Initialize map with optimizations
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
          // Calculate bounds for restriction
          const bounds = calculateBounds(center.lat, center.lng, RADIUS_KM);

          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: 12,
            restriction: {
              latLngBounds: {
                north: bounds.north,
                south: bounds.south,
                east: bounds.east,
                west: bounds.west,
              },
              strictBounds: true,
            },
            styles: minimalTheme,
            minZoom: 8,
            maxZoom: 18,
            // Optimization settings to reduce API calls
            gestureHandling: 'greedy', // Prevents accidental zooming
            disableDoubleClickZoom: false,
            scrollwheel: true,
            disableDefaultUI: false, // Keep default UI for user convenience
            mapTypeControl: false, // Disable satellite/terrain to save credits
            streetViewControl: false, // Disable street view to save credits
          });

          // Create visual circle with optimized settings
          const circle = new window.google.maps.Circle({
            strokeColor: '#FF6B6B',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF6B6B',
            fillOpacity: 0.1,
            map: mapInstance,
            center: center,
            radius: RADIUS_KM * 1000,
            clickable: false,
          });

          setRestrictionCircle(circle);

          // Optimized event listeners - reduced frequency
          let idleTimeout;
          mapInstance.addListener('idle', () => {
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
              if (!document.querySelector('.gm-style')) {
                console.warn('Map container empty - triggering recovery');
                google.maps.event.trigger(mapInstance, 'resize');
                mapInstance.setCenter(center);
              }
            }, 100); // Debounce idle events
          });

          // Optimized boundary enforcement with debouncing
          let centerChangeTimeout;
          mapInstance.addListener('center_changed', () => {
            clearTimeout(centerChangeTimeout);
            centerChangeTimeout = setTimeout(() => {
              const currentCenter = mapInstance.getCenter();
              const distance = calculateDistance(
                center.lat,
                center.lng,
                currentCenter.lat(),
                currentCenter.lng()
              );

              if (distance > RADIUS_KM) {
                const bearing = Math.atan2(
                  currentCenter.lng() - center.lng,
                  currentCenter.lat() - center.lat
                );

                const maxDistance = RADIUS_KM - 10;
                const maxLat =
                  center.lat + (maxDistance / 111.32) * Math.cos(bearing);
                const maxLng =
                  center.lng +
                  (maxDistance /
                    (111.32 * Math.cos((center.lat * Math.PI) / 180))) *
                    Math.sin(bearing);

                mapInstance.setCenter({ lat: maxLat, lng: maxLng });
              }
            }, 50); // Debounce center changes
          });

          setMap(mapInstance);
        } catch (err) {
          console.error('Map initialization failed:', err);
        }
      }
    };

    initMap();

    if (!initializationAttempted) {
      timeoutId = setTimeout(() => {
        console.log('Fallback initialization attempt');
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

  // Update map center when center changes (smooth transition)
  useEffect(() => {
    if (map && center.lat !== 0.001 && center.lng !== 0.001) {
      // Use panTo for smooth transition instead of setCenter
      map.panTo(center);

      // Update restriction circle center if it exists
      if (restrictionCircle) {
        restrictionCircle.setCenter(center);

        // Recalculate bounds for new center
        const bounds = calculateBounds(center.lat, center.lng, RADIUS_KM);
        map.setOptions({
          restriction: {
            latLngBounds: {
              north: bounds.north,
              south: bounds.south,
              east: bounds.east,
              west: bounds.west,
            },
            strictBounds: true,
          },
        });
      }
    }
  }, [map, center, restrictionCircle]);

  // Helper function to get best available price and period
  const getBestPrice = (rentalDetails) => {
    if (rentalDetails.day) return { price: rentalDetails.day, period: 'day' };
    if (rentalDetails.week)
      return { price: rentalDetails.week, period: 'week' };
    if (rentalDetails.month)
      return { price: rentalDetails.month, period: 'month' };
    if (rentalDetails.hour)
      return { price: rentalDetails.hour, period: 'hour' };
    return { price: '0', period: 'day' };
  };

  // Enhanced marker creation with overlap prevention and hover effects
  useEffect(() => {
    if (
      !map ||
      !window.google ||
      !vehicleListVisible ||
      vehicleListVisible.length === 0
    )
      return;

    // Clear existing markers
    if (markerClusterer) {
      markerClusterer.clearMarkers();
    }

    // Adjust positions for overlapping vehicles
    const adjustedVehicles = adjustOverlappingPositions(vehicleListVisible);

    // Create markers for each vehicle with enhanced styling
    const markers = adjustedVehicles.map((vehicle, index) => {
      const { price, period } = getBestPrice(vehicle.rentalDetails);
      const convertPrice = convert(Number(price));

      // Create enhanced marker with hover effects
      const marker = new window.google.maps.Marker({
        position: { lat: vehicle.location.lat, lng: vehicle.location.lng },
        title: `${vehicle.vehicleModel} - ₹${price}/${period}${vehicle.isAdjusted ? ' (Position Adjusted)' : ''}`,
        icon: {
          // marker icon
          url: createMarkerIcon({ category, dark: false }),
          scaledSize: new window.google.maps.Size(46, 56), // Match the size from the mouseout event
          anchor: new window.google.maps.Point(23, 28), // Match the anchor point from the mouseout event
        },
        zIndex: vehicle.isAdjusted ? 200 : 100,
        optimized: true, // Optimized rendering
      });

      // Enhanced click listener
      marker.addListener('click', () => {
        setSelectedVehicles([vehicle]);
      });

      // Optimized hover effects with debouncing
      let hoverTimeout;
      marker.addListener('mouseover', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          marker.setZIndex(1000 + index);

          const hoverIcon = {
            // marker icon
            url: createMarkerIcon({ category, dark: true }), // Use the same data URL as in the mouseout event
            scaledSize: new window.google.maps.Size(46, 56), // Match the size from the mouseout event
            anchor: new window.google.maps.Point(23, 28), // Match the anchor point from the mouseout event
          };

          marker.setIcon(hoverIcon);
        }, 100); // Debounce hover events
      });

      marker.addListener('mouseout', () => {
        clearTimeout(hoverTimeout);
        marker.setZIndex(vehicle.isAdjusted ? 200 : 100);

        const dropletIcon = {
          // marker icon
          url: createMarkerIcon({ category, dark: false }), // Use the imported data URL
          scaledSize: new window.google.maps.Size(46, 56), // Adjust size to fit your design
          anchor: new window.google.maps.Point(23, 28), // Adjust the anchor to the center of the droplet
        };

        marker.setIcon(dropletIcon);
      });

      marker.vehicleData = vehicle;
      return marker;
    });

    // Create clusterer with optimized settings
    if (window.markerClusterer && window.markerClusterer.MarkerClusterer) {
      const clusterer = new window.markerClusterer.MarkerClusterer({
        map,
        markers,
        renderer: {
          render: ({ count, position, markers }) => {
            const vehicles = markers
              .map((marker) => marker.vehicleData)
              .filter(Boolean);
            const dayPrices = vehicles
              .map((v) =>
                v.rentalDetails.day ? parseInt(v.rentalDetails.day) : null
              )
              .filter((price) => price !== null);

            let minPrice, maxPrice, priceText;

            if (dayPrices.length > 0) {
              minPrice = convert(Number(Math.min(...dayPrices)));
              maxPrice = convert(Number(Math.max(...dayPrices)));
              priceText = minPrice === maxPrice ? `${minPrice}` : `${minPrice}`;
            } else {
              const bestPrices = vehicles.map((v) => {
                const { price } = getBestPrice(v.rentalDetails);
                return parseInt(price);
              });
              minPrice = convert(Number(Math.min(...bestPrices)));
              maxPrice = convert(Number(Math.max(...bestPrices)));
              priceText = minPrice === maxPrice ? `${minPrice}` : `${minPrice}`;
            }

            let color,
              size,
              textColor = '#F57F17';

            if (count >= 20) {
              color = '#1C2122';
              size = 80;
            } else if (count >= 10) {
              color = '#1C2122';
              size = 80;
            } else {
              color = '#1C2122';
              size = 80;
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
              optimized: true, // Optimization
            });
          },
        },
      });

      clusterer.addListener('clusterclick', (event, cluster) => {
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
      markers.forEach((marker) => marker.setMap(map));
    }

    return () => {
      if (markerClusterer) {
        markerClusterer.clearMarkers();
      }
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [map, vehicleListVisible]);

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

  if (isLoading || center.lat === 0.001) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="font-medium text-gray-600">Loading Google Maps...</p>
          <p className="mt-2 text-sm text-gray-500">
            Calculating optimal center point for{' '}
            {vehicleListVisible?.length || 0} vehicles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Google Maps Container */}
      <div ref={mapRef} className="h-full w-full" />

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
    </div>
  );
};

export default MapClient;
