import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps } from "@/types";
import PriceEnquireDialog from "../../dialog/price-filter-dialog/PriceEnquireDialog";
import { fetchVehicleHomeGridData } from "@/app/(root)/[state]/[category]/action";
import LoadMoreGridVehicles from "./LoadMoreGridVehicles";
import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";

type MainVehicleGridProps = StateCategoryProps & {
  vehicleType: string | undefined;
};

const MainVehicleGrid = async ({
  state,
  category,
  vehicleType,
}: MainVehicleGridProps) => {
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
        <div className={`relative mt-6 w-full p-4`}>
          <VehicleGridWrapper classNames="mb-4">
            {data.vehicles}

            <LoadMoreGridVehicles state={state} category={category} />
          </VehicleGridWrapper>

          {/* loading next 8 result while in view (CSR) */}
        </div>
      ) : (
        ""
      )}
      <ViewAllButton link={`/${state}/listing?category=${category}`} />

      <PriceEnquireDialog />
    </MotionSection>
  );
};
export default MainVehicleGrid;
