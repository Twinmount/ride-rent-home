import ViewAllButton from "@/components/common/ViewAllButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { StateCategoryProps } from "@/types";
import PriceEnquireDialog from "../../dialog/price-filter-dialog/PriceEnquireDialog";
import { fetchVehicleHomeGridData } from "@/app/(root)/[country]/[state]/[category]/action";
import LoadMoreGridVehicles from "./LoadMoreGridVehicles";
import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";

type MainVehicleGridProps = StateCategoryProps & {
  vehicleType: string | undefined;
};

const MainVehicleGrid = async ({
  state,
  category,
  vehicleType,
  country,
}: MainVehicleGridProps) => {
  // Fetch first 8 vehicles (SSR)
  const data = await fetchVehicleHomeGridData({
    page: 1,
    state,
    category,
    vehicleType,
    country,
  });

  const hasVehicles = !!data.vehicles?.length;

  // view all link
  let viewAllLink = `/${country}/${state}/listing/${category}`;

  // if vehicleType exists, add it in the link
  if (vehicleType) {
    viewAllLink += `/${vehicleType}`;
  }

  return (
    <MotionSection className="wrapper h-auto min-h-fit w-full pb-8">
      {hasVehicles ? (
        <div className={`relative mt-6 w-full p-4`}>
          <VehicleGridWrapper classNames="mb-4">
            {/*  server rendered first 8 result */}
            {data.vehicles}

            {/* client rendered remaining 8 results (CSR) */}
            <LoadMoreGridVehicles
              state={state}
              category={category}
              country={country}
            />
          </VehicleGridWrapper>
        </div>
      ) : (
        <div className="flex-center h-36 italic text-gray-500">
          No Results Found
        </div>
      )}
      <ViewAllButton link={viewAllLink} />
      <PriceEnquireDialog />
    </MotionSection>
  );
};
export default MainVehicleGrid;
