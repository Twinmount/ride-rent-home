import ViewAllButton from "@/components/common/ViewAllButton";
import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";

import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import PriceEnquireDialog from "./dialog/PriceEnquireDialog";

const MainGrid = async ({ state, category }: StateCategoryProps) => {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  const params = new URLSearchParams({
    page: "1",
    limit: "12",
    state,
    sortOrder: "DESC",
    category,
    filter: VehicleHomeFilter.POPULAR_MODELS,
  });

  // Construct the full URL with the query string
  const url = `${baseUrl}/vehicle/home-page/list?${params.toString()}`;

  // Fetch brand data from your API endpoint
  const response = await fetch(url, { method: "GET", cache: "no-cache" });

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0) return null;

  return (
    <MotionSection className="wrapper h-auto min-h-fit w-full pb-8">
      <div className="mx-auto grid !w-fit max-w-fit grid-cols-1 !gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {vehicleData.map((vehicle, index) => (
          <VehicleMainCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
          />
        ))}
      </div>
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.POPULAR_MODELS}`}
      />

      <PriceEnquireDialog />
    </MotionSection>
  );
};
export default MainGrid;
