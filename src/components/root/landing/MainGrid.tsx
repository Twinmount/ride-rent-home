import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps, VehicleHomeFilter } from "@/types";
import PriceEnquireDialog from "../../dialog/price-filter-dialog/PriceEnquireDialog";
import { fetchVehicleHomeGridData } from "@/app/(root)/[state]/[category]/action";
import LoadMoreGridVehicles from "./LoadMoreGridVehicles";
import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";

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

  const hasVehicles = !!data.vehicles?.length;

  return (
    <MotionSection className="wrapper h-auto min-h-fit w-full pb-8">
      {hasVehicles ? (
        // server rendered first 8 result
        <div className={`mt-6 w-full`}>
          <VehicleGridWrapper classNames="mb-4">
            {data.vehicles}
          </VehicleGridWrapper>

          {/* loading next 8 result while in view (CSR) */}
          <LoadMoreGridVehicles state={state} category={category} />
        </div>
      ) : (
        ""
      )}
      <ViewAllButton
        link={`/${state}/listing?category=${category}&filter=${VehicleHomeFilter.POPULAR_MODELS}`}
      />

      <PriceEnquireDialog />
    </MotionSection>
  );
};
export default MainGrid;
