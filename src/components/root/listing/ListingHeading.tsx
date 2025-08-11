import { FilterSidebar } from '@/components/root/listing/filter/FilterSidebar';
import { convertToLabel } from '@/helpers';

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
  const formattedState = convertToLabel(state);
  const formattedCategory = convertToLabel(category);
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : '';
  const formattedBrand = brand ? convertToLabel(brand) : '';

  const headingH1 =
    heading ||
    `Rent ${formattedBrand ? `${formattedBrand} ` : ''}${formattedVehicleType ? `${formattedVehicleType} ` : ''}${formattedCategory} in ${formattedState}`;

  const headingH2 =
    subheading ||
    `Explore verified ${formattedBrand ? `${formattedBrand} ` : ''}${formattedVehicleType ? `${formattedVehicleType} ` : ''}${formattedCategory} rentals in ${formattedState}`;

  return (
    <div className="flex-between mb-2 mt-[5rem] h-fit w-full">
      <div className="overflow-wrap-anywhere max-w-[calc(100%-180px)] pr-4 max-md:max-w-[calc(100%-90px)] max-sm:max-w-full">
        <h1 className="ml-2 break-words text-lg font-[500] max-md:mr-auto md:text-xl lg:text-3xl">
          {headingH1}
        </h1>

        <h2 className="ml-2 mt-2 break-words text-xs font-[400] max-md:mr-auto lg:text-sm">
          {headingH2}
        </h2>
      </div>

      {/* filter sidebar */}
      <FilterSidebar />
    </div>
  );
}
