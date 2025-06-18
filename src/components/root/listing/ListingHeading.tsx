import { FilterSidebar } from "@/components/root/listing/filter/FilterSidebar";
import PriceFilterDialog from "@/components/dialog/price-filter-dialog/PriceFilterDialog";

type ListingHeadingProps = {
  formattedCategory: string;
  formattedState: string;
  formattedBrand?: string;
  vehicleTypes: string[];
  heading?: string;
  subheading?: string;
  oneVehicleType: boolean;
};

export default function ListingHeading({
  formattedCategory,
  formattedState,
  formattedBrand,
  vehicleTypes,
  heading,
  subheading,
  oneVehicleType,
}: ListingHeadingProps) {
  return (
    <div
      className="flex-between mb-6 h-fit w-full max-md:flex-col"
      style={{ alignItems: "start" }}
    >
      <div className="overflow-wrap-anywhere max-w-[calc(100%-180px)] pr-4 max-md:max-w-[calc(100%-90px)] max-sm:max-w-full">
        {oneVehicleType && !!heading ? (
          <h1 className="ml-2 break-words text-2xl font-[400] max-md:mr-auto lg:text-3xl">
            {heading}
          </h1>
        ) : (
          <h1 className="ml-2 break-words text-2xl font-[400] max-md:mr-auto lg:text-3xl">
            Rent or Lease&nbsp;
            {formattedBrand && (
              <span className="font-semibold">{formattedBrand}&nbsp;</span>
            )}
            {formattedCategory} in {formattedState}
            <SelectedVehicleTypes vehicleTypes={vehicleTypes} />
          </h1>
        )}

        {oneVehicleType && !!subheading && (
          <h2 className="ml-2 mt-2 break-words text-lg font-[400] max-md:mr-auto lg:text-xl">
            {subheading}
          </h2>
        )}
      </div>

      <div className="listing-page-filter-div z-[12] flex flex-shrink-0 max-md:mt-4">
        {/* price filter */}
        <PriceFilterDialog isListingPage />

        {/* filter sidebar */}
        <FilterSidebar />
      </div>
    </div>
  );
}

/*
 SelectedVehicleTypes component
*/
const SelectedVehicleTypes = ({ vehicleTypes }: { vehicleTypes: string[] }) => {
  if (vehicleTypes.length === 0) {
    return null;
  }

  return (
    <span className="vehicle-types-heading">
      <span className="mx-2 text-[1.4rem] font-semibold"> | </span>
      {vehicleTypes.length > 3 ? (
        <span className="text-[1.1rem] font-normal">
          {vehicleTypes[0]}, {vehicleTypes[1]}, {vehicleTypes[2]} and more...
        </span>
      ) : (
        vehicleTypes.map((type, index) => (
          <span key={index} className="text-[1.1rem] font-normal">
            {type}
            {index < vehicleTypes.length - 1 && ", "}
          </span>
        ))
      )}
    </span>
  );
};
