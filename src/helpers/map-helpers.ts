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
  lng2: number,
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
  radiusKm = 200,
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
  threshold = 0.0001,
) => {
  const latDiff = Math.abs(loc1.lat - loc2.lat);
  const lngDiff = Math.abs(loc1.lng - loc2.lng);
  return latDiff < threshold && lngDiff < threshold;
};

// Function to adjust positions for overlapping markers
export const adjustOverlappingPositions = (
  vehicles: Vehicle[],
  offsetDistance = 0.00015,
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

export const vehiclesListss = [
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
