import "./HourlyRentals.scss";
import MainCard from "@/components/card/vehicle-card/main-card/MainCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllButton from "@/components/general/button/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { convertToLabel } from "@/helpers";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";

export default async function HourlyRentals({
  state,
  category,
}: StateCategoryProps) {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  // Fetch brand data from your API endpoint
  const response = await fetch(
    `${baseUrl}/vehicle/home-page/list?page=1&limit=10&state=${state}&sortOrder=DESC&category=${category}&filter=${VehicleHomeFilter.HOURLY_RENTAL_VEHICLE}`,
    { method: "GET", cache: "no-cache" }
  );

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0) return null;

  return (
    <MotionSection className="affordable-section wrapper">
      <h2 className="heading">
        Hourly Rentals Deals For{" "}
        <span className="yellow-gradient px-1 rounded-xl">
          {convertToLabel(category)}
        </span>{" "}
        in{" "}
        <span className="capitalize yellow-gradient px-2 rounded-xl">
          {convertToLabel(state)}
        </span>
      </h2>
      <CarouselWrapper isButtonVisible>
        {vehicleData.map((vehicle) => (
          <MainCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            state={state}
            category={category}
            isHourlyRental={true}
          />
        ))}
      </CarouselWrapper>
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.HOURLY_RENTAL_VEHICLE}&isHourlyRental=true`}
      />
    </MotionSection>
  );
}
