import MainCard from "@/components/card/vehicle-card/main-card/MainCard";
import "./RelatedResults.scss";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

type RelatedResultsType = {
  state: string;
  category: string;
  vehicleId: string;
};

export default async function RelatedResults({
  state,
  category,
  vehicleId,
}: RelatedResultsType) {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  // Fetch brand data from your API endpoint
  const response = await fetch(`${baseUrl}/vehicle/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: "1",
      limit: "10",
      sortOrder: "DESC",
      category: category,
      state: state,
    }),
  });

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  let vehicleData = data?.result?.list || [];

  // Filter out the vehicle with the passed vehicleId prop
  vehicleData = vehicleData.filter(
    (vehicle) => vehicle.vehicleId !== vehicleId
  );

  // If there are no vehicles left after filtering, return null
  if (vehicleData.length === 0) return null;

  if (vehicleData.length === 0) return null;

  return (
    <MotionSection className="wrapper">
      <h2 className="heading ">Related Recommendations</h2>
      <CarouselWrapper>
        {vehicleData.map((vehicle) => (
          <MainCard key={vehicle.vehicleId} vehicle={vehicle} />
        ))}
      </CarouselWrapper>
    </MotionSection>
  );
}
