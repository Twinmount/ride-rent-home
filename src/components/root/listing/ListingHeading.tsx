import { FilterSidebar } from "@/components/root/listing/filter/FilterSidebar";
import PriceFilterDialog from "@/components/dialog/price-filter-dialog/PriceFilterDialog";
import { convertToLabel } from "@/helpers";
import { getCountryName } from "@/utils/url";

type ListingHeadingProps = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  heading?: string;
  subheading?: string;
};

export default function ListingHeading({
  country,
  state,
  category,
  vehicleType,
  brand,
  heading,
  subheading,
}: ListingHeadingProps) {
  const formattedCountry = getCountryName(country);
  const formattedState = convertToLabel(state);
  const formattedCategory = convertToLabel(category);
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : "";
  const formattedBrand = brand ? convertToLabel(brand) : "";

  const headingH1 =
    heading ||
    `Rent ${formattedBrand ? `${formattedBrand} ` : ""}${formattedVehicleType ? `${formattedVehicleType} ` : ""}${formattedCategory} in ${formattedState}`;

  const headingH2 =
    subheading ||
    `Explore verified ${formattedBrand ? `${formattedBrand} ` : ""}${formattedVehicleType ? `${formattedVehicleType} ` : ""}${formattedCategory} rentals in ${formattedState}, ${formattedCountry}. Instant booking, flexible pricing, and trusted hosts.`;

  return (
    <div
      className="flex-between mb-6 h-fit w-full max-md:flex-col"
      style={{ alignItems: "start" }}
    >
      <div className="overflow-wrap-anywhere max-w-[calc(100%-180px)] pr-4 max-md:max-w-[calc(100%-90px)] max-sm:max-w-full">
        <h1 className="ml-2 break-words text-2xl font-[400] max-md:mr-auto lg:text-3xl">
          {headingH1}
        </h1>

        <h2 className="ml-2 mt-2 break-words text-lg font-[400] max-md:mr-auto lg:text-xl">
          {headingH2}
        </h2>
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
