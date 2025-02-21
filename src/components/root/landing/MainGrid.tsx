import ViewAllButton from "@/components/common/ViewAllButton";
import VehicleMainCard from "@/components/card/vehicle-card/main-card/VehicleMainCard";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import PriceEnquireDialog from "../../dialog/price-filter-dialog/PriceEnquireDialog";
import { ENV } from "@/config/env";

type MainGridProps = StateCategoryProps & {
  vehicleType: string | undefined;
};

const MainGrid = async ({ state, category, vehicleType }: MainGridProps) => {
  const baseUrl = ENV.API_URL || ENV.NEXT_PUBLIC_API_URL;

  const params = new URLSearchParams({
    page: "1",
    limit: "20",
    state,
    sortOrder: "DESC",
    category,
    filter: VehicleHomeFilter.NONE,
  });

  if (vehicleType) {
    params.set("type", vehicleType);
  }

  // Construct the full URL with the query string
  const url = `${baseUrl}/vehicle/home-page/list?${params.toString()}`;

  // Fetch brand data from your API endpoint
  const response = await fetch(url, { method: "GET", cache: "no-cache" });

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const vehicleData = data?.result?.list || [];

  if (vehicleData.length === 0)
    return (
      <MotionSection className="wrapper flex-center h-auto min-h-48 w-full pb-8 text-base italic text-gray-500">
        <span>No results found!</span>
      </MotionSection>
    );

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
