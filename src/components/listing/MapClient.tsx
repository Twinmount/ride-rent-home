// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePriceConverter } from '@/hooks/usePriceConverter';
import { useParams, useSearchParams } from 'next/navigation';
import { ENV } from '@/config/env';
import { useStateAndCategory } from '@/hooks/useStateAndCategory';
import { useImmer } from 'use-immer';
import { VehicleDetailsDialog } from './VehicleDetailsDialog';
import {
  calculateDistance,
  adjustOverlappingPositions,
  calculateBounds,
  areLocationsClose,
} from '@/helpers/map-helpers';
import { useGlobalContext } from '@/context/GlobalContext';
import { createMarkerIcon } from './map-icons/marker-icon';

const MapClient = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const clusterGroupRef = useRef(null);
  const circleRef = useRef(null);

  const [selectedVehicles, setSelectedVehicles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leafletReady, setLeafletReady] = useState(false);

  const searchParams = useSearchParams();
  const { state, category } = useStateAndCategory();
  const [companiesList, setCompaniesList] = useImmer([]);
  const [center, setCenter] = useImmer({ lat: 0.001, lng: 0.001 });
  const [open, setOpen] = useState(false);

  const { vehicleListVisible } = useGlobalContext();

  const params = useParams();
  const country = Array.isArray(params.country)
    ? params.country[0]
    : params.country || 'ae';

  const coordinatesString = typeof window !== 'undefined' ?
    sessionStorage?.getItem('userLocation') ?? null : null;

  let parsedCoordinates = null;
  if (coordinatesString) {
    parsedCoordinates = JSON.parse(coordinatesString);
  }

  const baseUrl = country === 'in' ? ENV.NEXT_PUBLIC_API_URL_INDIA : ENV.NEXT_PUBLIC_API_URL;
  const RADIUS_KM = 1000;
  const { convert } = usePriceConverter();

  // Calculate center point from all vehicles
  const calculatedCenter = useMemo(() => {
    if (!vehicleListVisible || vehicleListVisible.length === 0) {
      return { lat: 0.001, lng: 0.001 };
    }

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

    const totalLat = validVehicles.reduce((sum, vehicle) => sum + vehicle.location.lat, 0);
    const totalLng = validVehicles.reduce((sum, vehicle) => sum + vehicle.location.lng, 0);

    return {
      lat: totalLat / validVehicles.length,
      lng: totalLng / validVehicles.length,
    };
  }, [vehicleListVisible]);

  // Update center when calculated center changes
  useEffect(() => {
    if (calculatedCenter.lat !== 0.001 && calculatedCenter.lng !== 0.001) {
      setCenter(calculatedCenter);
    }
  }, [calculatedCenter, setCenter]);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          leafletCSS.crossOrigin = '';
          document.head.appendChild(leafletCSS);
        }

        // Load MarkerCluster CSS
        if (!document.querySelector('link[href*="MarkerCluster.css"]')) {
          const clusterCSS = document.createElement('link');
          clusterCSS.rel = 'stylesheet';
          clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
          document.head.appendChild(clusterCSS);

          const clusterDefaultCSS = document.createElement('link');
          clusterDefaultCSS.rel = 'stylesheet';
          clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
          document.head.appendChild(clusterDefaultCSS);
        }

        // Load Leaflet JS
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const leafletScript = document.createElement('script');
            leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletScript.crossOrigin = '';
            leafletScript.onload = resolve;
            leafletScript.onerror = reject;
            document.head.appendChild(leafletScript);
          });
        }

        // Load MarkerCluster JS
        if (!window.L.MarkerClusterGroup) {
          await new Promise((resolve, reject) => {
            const clusterScript = document.createElement('script');
            clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
            clusterScript.onload = resolve;
            clusterScript.onerror = reject;
            document.head.appendChild(clusterScript);
          });
        }

        setLeafletReady(true);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load Leaflet libraries');
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletReady || !mapRef.current || center.lat === 0.001 || mapInstanceRef.current) return;

    try {
      // Create map instance
      const map = window.L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: 12,
        minZoom: 8,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: true,
      });

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>',
      //   subdomains: 'abcd',
      //   maxZoom: 20,
      // }).addTo(map);

      // Add restriction circle
      const circle = window.L.circle([center.lat, center.lng], {
        color: '#FF6B6B',
        fillColor: '#FF6B6B',
        fillOpacity: 0,
        radius: RADIUS_KM * 1000,
        interactive: false,
      }).addTo(map);

      circleRef.current = circle;

      // Add movement restriction
      let moveEndTimeout;
      const handleMoveEnd = () => {
        clearTimeout(moveEndTimeout);
        moveEndTimeout = setTimeout(() => {
          const currentCenter = map.getCenter();
          const distance = calculateDistance(
            center.lat,
            center.lng,
            currentCenter.lat,
            currentCenter.lng
          );

          if (distance > RADIUS_KM) {
            const bearing = Math.atan2(
              currentCenter.lng - center.lng,
              currentCenter.lat - center.lat
            );

            const maxDistance = RADIUS_KM - 10;
            const maxLat = center.lat + (maxDistance / 111.32) * Math.cos(bearing);
            const maxLng = center.lng + (maxDistance / (111.32 * Math.cos((center.lat * Math.PI) / 180))) * Math.sin(bearing);

            map.setView([maxLat, maxLng]);
          }
        }, 100);
      };

      map.on('moveend', handleMoveEnd);
      mapInstanceRef.current = map;

    } catch (err) {
      console.error('Map initialization failed:', err);
      setError('Failed to initialize map');
    }
  }, [leafletReady, center]);

  // Helper function to get best available price and period
  const getBestPrice = (rentalDetails) => {
    if (rentalDetails.day) return { price: rentalDetails.day, period: 'day' };
    if (rentalDetails.week) return { price: rentalDetails.week, period: 'week' };
    if (rentalDetails.month) return { price: rentalDetails.month, period: 'month' };
    if (rentalDetails.hour) return { price: rentalDetails.hour, period: 'hour' };
    return { price: '0', period: 'day' };
  };

  // *** MODIFIED ***: Create cluster icon to look like a vehicle marker with a count badge
  const createClusterIcon = (cluster) => {
    const count = cluster.getChildCount();
    const iconUrl = createMarkerIcon({ category, dark: false });

    const iconHtml = `
      <div style="position: relative;">
        <img src="${iconUrl}" style="width: 46px; height: 56px;" />
        <div style="
          position: absolute;
          top: 0px;
          right: 0px;
          width: 20px;
          height: 20px;
          background-color: #F57F17;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
        ">
          ${count}
        </div>
      </div>
    `;

    return window.L.divIcon({
      html: iconHtml,
      className: 'custom-cluster-icon-with-badge',
      iconSize: [46, 56],
      iconAnchor: [23, 56],
    });
  };

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletReady || !vehicleListVisible || vehicleListVisible.length === 0) return;

    // Clear existing markers
    if (clusterGroupRef.current) {
      mapInstanceRef.current.removeLayer(clusterGroupRef.current);
    }
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current.hasLayer(marker)) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Adjust overlapping positions
    const adjustedVehicles = adjustOverlappingPositions(vehicleListVisible);

    // Create marker cluster group
    const clusterGroup = window.L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        // Use the new function to create the cluster icon
        return createClusterIcon(cluster);
      },
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
    });

    // Handle cluster clicks
    clusterGroup.on('clusterclick', function (event) {
      const cluster = event.layer;
      const childMarkers = cluster.getAllChildMarkers();
      const vehicles = childMarkers.map(marker => marker.vehicleData).filter(Boolean);

      // *** MODIFIED ***: Add console log for all vehicles in the cluster
      if (vehicles.length > 0) {
        setSelectedVehicles(vehicles);
      }
    });

    // Create individual markers
    adjustedVehicles.forEach((vehicle, index) => {
      const { price, period } = getBestPrice(vehicle.rentalDetails);

      // Create custom icons
      const iconHtml = `<img src="${createMarkerIcon({ category, dark: false })}" style="width: 46px; height: 56px;" />`;
      const hoverIconHtml = `<img src="${createMarkerIcon({ category, dark: true })}" style="width: 46px; height: 56px;" />`;

      const customIcon = window.L.divIcon({
        html: iconHtml,
        className: 'custom-vehicle-marker',
        iconSize: [46, 56],
        iconAnchor: [23, 28],
      });

      const hoverIcon = window.L.divIcon({
        html: hoverIconHtml,
        className: 'custom-vehicle-marker-hover',
        iconSize: [46, 56],
        iconAnchor: [23, 28],
      });

      // Create marker
      const marker = window.L.marker([vehicle.location.lat, vehicle.location.lng], {
        icon: customIcon,
        title: `${vehicle.vehicleTitle} - ₹${price}/${period}${vehicle.isAdjusted ? ' (Position Adjusted)' : ''}`,
      });

      // Store vehicle data
      marker.vehicleData = vehicle;

      // Add event listeners
      marker.on('click', () => {
        setSelectedVehicles([vehicle]);
      });

      // Hover effects
      let hoverTimeout;
      marker.on('mouseover', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          marker.setIcon(hoverIcon);
        }, 100);
      });

      marker.on('mouseout', () => {
        clearTimeout(hoverTimeout);
        marker.setIcon(customIcon);
      });

      clusterGroup.addLayer(marker);
      markersRef.current.push(marker);
    });

    mapInstanceRef.current.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

  }, [leafletReady, vehicleListVisible, category, convert]);

  // Update map center
  useEffect(() => {
    if (mapInstanceRef.current && center.lat !== 0.001 && center.lng !== 0.001) {
      mapInstanceRef.current.panTo([center.lat, center.lng]);

      if (circleRef.current) {
        circleRef.current.setLatLng([center.lat, center.lng]);
      }
    }
  }, [center]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Error Loading Map</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <p className="text-sm text-gray-500">Please check your internet connection and try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading || center.lat === 0.001) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="font-medium text-gray-600">Loading Map...</p>
          <p className="mt-2 text-sm text-gray-500">
            Calculating optimal center point for {vehicleListVisible?.length || 0} vehicles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* <style jsx global>{`
        .custom-vehicle-marker,
        .custom-vehicle-marker-hover,
        .custom-cluster-icon-with-badge,
        .custom-cluster-icon {
          background: none !important;
          border: none !important;
        }
        .leaflet-container {
          height: 100%;
          width: 100%;
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
      `}</style> */}

      <div ref={mapRef} className="h-full w-full" />

      {selectedVehicles && (
        <VehicleDetailsDialog
          open={open}
          setOpen={setOpen}
          country={country}
          vehicles={selectedVehicles}
          baseUrl={baseUrl}
          convert={convert}
        />
      )}
    </div>
  );
};

export default MapClient;