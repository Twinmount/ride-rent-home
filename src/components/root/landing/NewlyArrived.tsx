import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { ENV } from "@/config/env";
import { convertToLabel, singularizeType } from "@/helpers";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

export default async function NewlyArrived({
  state,
  category,
}: StateCategoryProps) {
  const baseUrl = ENV.API_URL;

  const params = new URLSearchParams({
    page: "1",
    limit: "5",
    state: state,
    sortOrder: "DESC",
    category: category,
    filter: VehicleHomeFilter.POPULAR_MODELS,
  });

  // Construct the full URL
  const url = `${baseUrl}/vehicle/home-page/list?${params.toString()}`;

  // Fetch data using the generated URL
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0) return null;

  const formattedCategory = singularizeType(convertToLabel(category));

  return (
    <MotionSection className="section-container wrapper">
      <h2 className="section-heading">
        Newly arrived{" "}
        <span className="yellow-gradient rounded-xl px-1">
          {formattedCategory}
        </span>{" "}
        for rent in{" "}
        <span className="yellow-gradient rounded-xl px-2 capitalize">
          {convertToLabel(state)}
        </span>
      </h2>
      <CarouselWrapper isButtonVisible>
        {vehicleData.map((vehicle, index) => (
          <VehicleMainCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
          />
        ))}
      </CarouselWrapper>
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.LATEST_MODELS}`}
      />
    </MotionSection>
  );
}
