import {
  FetchVehicleCardsResponse,
  VehicleCardType,
} from "@/types/vehicle-types";
import VerticalCard from "../card/vehicle-card/listing-vertical-card/VerticalCard";
import MainCard from "../card/vehicle-card/main-card/MainCard";

type Props = {
  filter: string;
  page: number;
};

interface RequestBody {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
  filter?: string;
}

const vehicleCards: VehicleCardType[] = [
  {
    vehicleId: "V12345",
    thumbnail: "/cars.webp",
    model: "Toyota Corolla",
    registredYear: "2022",
    brandName: "Toyota",
    countryCode: "AE",
    phoneNumber: "+971555555555",
    email: "contact@toyotacars.ae",
    rentalDetails: {
      day: {
        enabled: true,
        rentInAED: "150",
        mileageLimit: "100km",
      },
      week: {
        enabled: true,
        rentInAED: "1000",
        mileageLimit: "700km",
      },
      month: {
        enabled: true,
        rentInAED: "3500",
        mileageLimit: "3000km",
      },
    },
    vehicleSpecs: {
      engine: {
        name: "Engine",
        value: "1.8L 4-cylinder",
        selected: true,
      },
      transmission: {
        name: "Transmission",
        value: "Automatic",
        selected: true,
      },
      fuelType: {
        name: "Fuel Type",
        value: "Petrol",
        selected: true,
      },
    },
    companyLogo: "/cars.webp",
    state: "dubai",
    category: "cars",
    whatsappPhone: "+971555555555",
    whatsappCountryCode: "AE",
    isDisabled: false,
    isCryptoAccepted: true,
    isSpotDeliverySupported: true,
    additionalVehicleTypes: [
      { typeId: "1", label: "Luxury", value: "Luxury Sedan" },
    ],
    securityDeposit: {
      enabled: true,
      amountInAED: "500",
    },
    isCreditOrDebitCardsSupported: true,
    isTabbySupported: false,
  },
  {
    vehicleId: "V12345",
    thumbnail: "/cars.webp",
    model: "Toyota Corolla",
    registredYear: "2022",
    brandName: "Toyota",
    countryCode: "AE",
    phoneNumber: "+971555555555",
    email: "contact@toyotacars.ae",
    rentalDetails: {
      day: {
        enabled: true,
        rentInAED: "150",
        mileageLimit: "100km",
      },
      week: {
        enabled: true,
        rentInAED: "1000",
        mileageLimit: "700km",
      },
      month: {
        enabled: true,
        rentInAED: "3500",
        mileageLimit: "3000km",
      },
    },
    vehicleSpecs: {
      engine: {
        name: "Engine",
        value: "1.8L 4-cylinder",
        selected: true,
      },
      transmission: {
        name: "Transmission",
        value: "Automatic",
        selected: true,
      },
      fuelType: {
        name: "Fuel Type",
        value: "Petrol",
        selected: true,
      },
    },
    companyLogo: "/cars.webp",
    state: "dubai",
    category: "cars",
    whatsappPhone: "+971555555555",
    whatsappCountryCode: "AE",
    isDisabled: false,
    isCryptoAccepted: true,
    isSpotDeliverySupported: true,
    additionalVehicleTypes: [
      { typeId: "1", label: "Luxury", value: "Luxury Sedan" },
    ],
    securityDeposit: {
      enabled: true,
      amountInAED: "500",
    },
    isCreditOrDebitCardsSupported: true,
    isTabbySupported: false,
  },
  {
    vehicleId: "V12345",
    thumbnail: "/cars.webp",
    model: "Toyota Corolla",
    registredYear: "2022",
    brandName: "Toyota",
    countryCode: "AE",
    phoneNumber: "+971555555555",
    email: "contact@toyotacars.ae",
    rentalDetails: {
      day: {
        enabled: true,
        rentInAED: "150",
        mileageLimit: "100km",
      },
      week: {
        enabled: true,
        rentInAED: "1000",
        mileageLimit: "700km",
      },
      month: {
        enabled: true,
        rentInAED: "3500",
        mileageLimit: "3000km",
      },
    },
    vehicleSpecs: {
      engine: {
        name: "Engine",
        value: "1.8L 4-cylinder",
        selected: true,
      },
      transmission: {
        name: "Transmission",
        value: "Automatic",
        selected: true,
      },
      fuelType: {
        name: "Fuel Type",
        value: "Petrol",
        selected: true,
      },
    },
    companyLogo: "/cars.webp",
    state: "dubai",
    category: "cars",
    whatsappPhone: "+971555555555",
    whatsappCountryCode: "AE",
    isDisabled: false,
    isCryptoAccepted: true,
    isSpotDeliverySupported: true,
    additionalVehicleTypes: [
      { typeId: "1", label: "Luxury", value: "Luxury Sedan" },
    ],
    securityDeposit: {
      enabled: true,
      amountInAED: "500",
    },
    isCreditOrDebitCardsSupported: true,
    isTabbySupported: false,
  },
];

export default async function AgentVehicleGrid({ page, filter }: Props) {
  // Fetch the blogs data
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // Prepare the request body
  const requestBody: RequestBody = {
    page: page.toString(),
    limit: "10",
    sortOrder: "DESC",
  };

  // Conditionally add blogCategory if selectedTag is valid
  if (filter && filter.toLowerCase() !== "all") {
    requestBody.filter = filter;
  }

  // Fetch brand data from your API endpoint
  const response = await fetch(`${baseUrl}/company-vehicles/list`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data: FetchVehicleCardsResponse = await response.json();

  const vehicles = data.result.list || vehicleCards || [];

  return (
    <div className="wrapper">
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vehicles.map((vehicle, index) => (
            <MainCard key={vehicle.vehicleId || index} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex-center h-72 font-thin text-lg">
          No Vehicles Found &nbsp; :/
        </div>
      )}
    </div>
  );
}
