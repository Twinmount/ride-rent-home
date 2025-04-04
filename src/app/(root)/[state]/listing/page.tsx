import VehicleGrid from "@/components/root/listing/vehicle-grids/VehicleGrid";
import { convertToLabel, singularizeType } from "@/helpers";
import { PageProps } from "@/types";
import { Metadata } from "next";
import { FC } from "react";
import {
  fetchListingMetadata,
  generateListingMetadata,
  getListingPageJsonLd,
} from "./listing-metadata";

import { FilterSidebar } from "@/components/root/listing/filter/FilterSidebar";
import PriceFilterTag from "@/components/root/listing/PriceFilterTag";
import { getDefaultMetadata } from "@/app/root-metadata";
import JsonLd from "@/components/common/JsonLd";
import PriceFilterDialog from "@/components/dialog/price-filter-dialog/PriceFilterDialog";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { state } = params;

  const category = searchParams.category || "cars";
  const vehicleTypesParam = searchParams.vehicleTypes;
  const vehicleType = vehicleTypesParam
    ? vehicleTypesParam.split(",")[0]
    : "other";

  const host = "https://ride.rent";
  const canonicalUrl = `${host}/${state}/listing${
    searchParams
      ? `?${new URLSearchParams(searchParams as Record<string, string>)}`
      : ""
  }`;

  const data = await fetchListingMetadata(state, category, vehicleType);

  if (!data) {
    return getDefaultMetadata();
  }

  return generateListingMetadata(
    data,
    state,
    category,
    vehicleType,
    canonicalUrl,
  );
}

const ListingPage: FC<PageProps> = async (props) => {
  const params = await props.params;

  const { state } = params;

  const searchParams = await props.searchParams;
  const category = searchParams.category;
  const brand = searchParams.brand ? searchParams.brand.split(",")[0] : "";

  const formattedCategory = singularizeType(convertToLabel(category));
  const formattedState = convertToLabel(state);
  const formattedBrand = convertToLabel(brand);

  // Parse and format the vehicleTypes from searchParams
  const vehicleTypes = searchParams.vehicleTypes
    ? searchParams.vehicleTypes.split(",").map((type) => convertToLabel(type))
    : [];

  // generate JSON-LD
  const jsonLdData = getListingPageJsonLd(state, formattedCategory);

  return (
    <>
      {/* Inject JSON-LD into the <head> */}
      <JsonLd
        id={`json-ld-listing-${state}-${category}`}
        jsonLdData={jsonLdData}
      />
      <div className="wrapper h-auto min-h-screen bg-lightGray pb-8 pt-4">
        <div className="flex-between mb-6 h-fit w-full pr-[5%] max-md:flex-col">
          <h1 className="ml-2 break-words text-2xl font-[500] max-md:mr-auto lg:text-3xl">
            Rent or Lease&nbsp;
            {formattedBrand && (
              <span className="font-semibold">{formattedBrand}&nbsp;</span>
            )}
            {formattedCategory} in {formattedState}
            {/*rendering vehicle types, if there are any */}
            <SelectedVehicleTypes vehicleTypes={vehicleTypes} />
          </h1>

          {/* filter sidebar */}
          <div className="flex">
            <div className="me-2 max-sm:hidden">
              <PriceFilterDialog isListingPage={true} />
            </div>
            <FilterSidebar />
          </div>
        </div>

        {/* New Price Filter Tag */}
        <PriceFilterTag />

        <div className="mt-3 flex gap-8">
          {/* vehicle grid */}
          <VehicleGrid state={state} />
        </div>
      </div>
    </>
  );
};

export default ListingPage;

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
