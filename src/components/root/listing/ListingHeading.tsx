import { FilterSidebar } from "@/components/root/listing/filter/FilterSidebar";
import { convertToLabel } from "@/helpers";

type ListingHeadingProps = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
  heading?: string;
  subheading?: string;
};

export default function ListingHeading({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
  heading,
  subheading,
}: ListingHeadingProps) {
  const formattedState = convertToLabel(state);
  const formattedCategory = convertToLabel(category);
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : "";
  const formattedBrand = brand ? convertToLabel(brand) : "";
  const formattedCity = city ? convertToLabel(city) : "";

  const headingH1 =
    heading ||
    `Rent ${formattedBrand ? `${formattedBrand} ` : ""}${formattedVehicleType ? `${formattedVehicleType} ` : ""}${formattedCategory} in ${formattedState} ${formattedCity ? `| ${formattedCity}` : ""}`;

  const headingH2 =
    subheading ||
    `Explore verified ${formattedBrand ? `${formattedBrand} ` : ""}${formattedVehicleType ? `${formattedVehicleType} ` : ""}${formattedCategory} rentals in ${formattedState}`;

  return (
    <div className="flex-between mb-2 mt-20 h-fit w-full min-w-full">
      <div className="w-fit max-w-full pr-4">
        <h1 className="break-words text-lg font-[500] max-md:mr-auto md:text-xl lg:text-3xl">
          {headingH1}
        </h1>

        <h2 className="mt-2 break-words text-xs font-[400] max-md:mr-auto lg:text-sm">
          {headingH2}
        </h2>
      </div>

      {/* filter sidebar */}
      <FilterSidebar />
    </div>
  );
}
