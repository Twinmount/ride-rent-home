import "./MostPopular.scss";

import ViewAllButton from "@/components/general/button/ViewAllButton";
import MainCard from "@/components/card/vehicle-card/main-card/MainCard";

import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import { convertToLabel } from "@/helpers";

const MostPopular = async ({ state, category }: StateCategoryProps) => {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  // Fetch brand data from your API endpoint
  const response = await fetch(
    `${baseUrl}/vehicle/home-page/list?page=1&limit=6&state=${state}&sortOrder=DESC&category=${category}&filter=${VehicleHomeFilter.POPULAR_MODELS}`,
    { method: "GET", cache: "no-cache" }
  );

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0) return null;

  return (
    <MotionSection className="popular-section wrapper">
      <h2 className="heading ">
        Explore the most popular{" "}
        <span className="yellow-gradient px-1 rounded-xl">
          {convertToLabel(category)}
        </span>{" "}
        for rent in{" "}
        <span className="capitalize yellow-gradient px-2 rounded-xl">
          {convertToLabel(state)}
        </span>
      </h2>
      <CarouselWrapper>
        {vehicleData.map((vehicle) => (
          <MainCard key={vehicle.vehicleId} vehicle={vehicle} />
        ))}
      </CarouselWrapper>
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.POPULAR_MODELS}`}
      />
    </MotionSection>
  );
};
export default MostPopular;
