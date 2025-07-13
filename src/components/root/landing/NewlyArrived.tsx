import VehicleCard from "@/components/card/new-vehicle-card/main-card/VehicleCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import { SectionHeading } from "@/components/common/SectionHeading";
import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { ENV } from "@/config/env";
import { convertToLabel } from "@/helpers";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

export default async function NewlyArrived({
  state,
  category,
  country,
}: StateCategoryProps) {
  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

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

  const formattedCategory = convertToLabel(category);

  return (
    <MotionSection className="section-container wrapper">
      <SectionHeading
        title={`Newly arrived ${formattedCategory}`}
        subtitle="Lorem ipsum dolor sit amet consectetur."
        align="left"
      />

      <CarouselWrapper isButtonVisible>
        {vehicleData.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
            country={country}
          />
        ))}
      </CarouselWrapper>

      <ViewAllButton
        link={`/${country}/${state}/listing/${category}?filter=${VehicleHomeFilter.LATEST_MODELS}`}
      />
    </MotionSection>
  );
}
