import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import PriceEnquireDialog from "../../dialog/price-filter-dialog/PriceEnquireDialog";
import { fetchVehicleHomeGridData } from "@/app/(root)/[state]/[category]/action";
import LoadMoreGridVehicles from "./LoadMoreGridVehicles";

type MainGridProps = StateCategoryProps & {
  vehicleType: string | undefined;
};

const MainGrid = async ({ state, category, vehicleType }: MainGridProps) => {
  // Fetch first 8 vehicles (SSR)
  const data = await fetchVehicleHomeGridData({
    page: 1,
    state,
    category,
    vehicleType,
  });

  if (!data.vehicles) {
    return (
      <MotionSection className="wrapper flex-center h-auto min-h-48 w-full pb-8 text-base italic text-gray-500">
        <span>No results found!</span>
      </MotionSection>
    );
  }

  return (
    <MotionSection className="wrapper h-auto min-h-fit w-full pb-8">
      <div className="mx-auto grid !w-fit max-w-fit grid-cols-1 !gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {/* first 8 vehicles server rendered */}
        {data.vehicles}

        {/* Client-side component for next 8 vehicles (CSR) based on scroll */}
        <LoadMoreGridVehicles
          state={state}
          category={category}
          vehicleType={vehicleType}
        />
      </div>
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.POPULAR_MODELS}`}
      />

      <PriceEnquireDialog />
    </MotionSection>
  );
};
export default MainGrid;
