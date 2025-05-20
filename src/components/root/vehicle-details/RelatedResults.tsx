import MainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { ENV } from "@/config/env";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

type RelatedResultsType = {
  state: string;
  category: string;
  vehicleCode: string;
  country: string;
};

export default async function RelatedResults({
  state,
  category,
  vehicleCode,
  country,
}: RelatedResultsType) {
  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

  // Fetch brand data from your API endpoint
  const response = await fetch(`${baseUrl}/vehicle/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: "1",
      limit: "7",
      sortOrder: "DESC",
      category: category,
      state: state,
    }),
    cache: "no-cache",
  });

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  let vehicleData = data?.result?.list || [];

  // If there are no vehicles left after filtering, return null
  if (vehicleData.length === 0) return null;

  // Filter out the vehicle with the current vehicleCode prop
  vehicleData = vehicleData.filter(
    (vehicle) => vehicle.vehicleCode !== vehicleCode,
  );

  return (
    <MotionSection>
      <h2 className="mb-4 mt-14 text-center text-xl font-bold">
        Related Recommendations
      </h2>
      <CarouselWrapper>
        {vehicleData.map((vehicle, index) => (
          <MainCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
            country={country}
          />
        ))}
      </CarouselWrapper>
    </MotionSection>
  );
}
