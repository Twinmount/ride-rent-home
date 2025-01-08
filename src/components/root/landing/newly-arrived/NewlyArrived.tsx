import "./NewlyArrived.scss";
import MainCard from "@/components/card/vehicle-card/main-card/MainCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { convertToLabel } from "@/helpers";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

export default async function NewlyArrived({
  state,
  category,
}: StateCategoryProps) {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // Fetch brand data from your API endpoint
  const response = await fetch(
    `${baseUrl}/vehicle/home-page/list?page=1&limit=5&state=${state}&sortOrder=DESC&category=${category}&filter=${VehicleHomeFilter.POPULAR_MODELS}`,
    { method: "GET", cache: "no-cache" },
  );

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0) return null;

  return (
    <MotionSection className="newly-arrived-section wrapper">
      <h2 className="heading">
        Newly arrived{" "}
        <span className="yellow-gradient rounded-xl px-1">
          {convertToLabel(category)}
        </span>{" "}
        for rent in{" "}
        <span className="yellow-gradient rounded-xl px-2 capitalize">
          {convertToLabel(state)}
        </span>
      </h2>
      <CarouselWrapper isButtonVisible>
        {vehicleData.map((vehicle, index) => (
          <MainCard key={vehicle.vehicleId} vehicle={vehicle} index={index} />
        ))}
      </CarouselWrapper>
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.LATEST_MODELS}`}
      />
    </MotionSection>
  );
}
