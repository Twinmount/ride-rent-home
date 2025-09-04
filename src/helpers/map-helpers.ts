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
  companyLogo?: string;
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper function to calculate bounds for 200km radius
export const calculateBounds = (
  centerLat: number,
  centerLng: number,
  radiusKm = 200
) => {
  const R = 6371; // Earth's radius in kilometers

  // Calculate lat/lng deltas for the radius
  const latDelta = (radiusKm / R) * (180 / Math.PI);
  const lngDelta =
    (radiusKm / (R * Math.cos((centerLat * Math.PI) / 180))) * (180 / Math.PI);

  return {
    north: centerLat + latDelta,
    south: centerLat - latDelta,
    east: centerLng + lngDelta,
    west: centerLng - lngDelta,
  };
};

// Helper function to detect if two locations are very close
export const areLocationsClose = (
  loc1: Location,
  loc2: Location,
  threshold = 0.0001
) => {
  const latDiff = Math.abs(loc1.lat - loc2.lat);
  const lngDiff = Math.abs(loc1.lng - loc2.lng);
  return latDiff < threshold && lngDiff < threshold;
};

// Function to adjust positions for overlapping markers
export const adjustOverlappingPositions = (
  vehicles: Vehicle[],
  offsetDistance = 0.00015
) => {
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

export const minimalTheme = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#7c7c7c' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#144b53' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#f5f5f2' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [{ color: '#d0d0d0' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#bae5ce' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0e0e0' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#696969' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0e0e0' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0e0e0' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0e0e0' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry.fill',
    stylers: [{ color: '#d0d0d0' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#a2daf2' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#92998d' }],
  },
];
