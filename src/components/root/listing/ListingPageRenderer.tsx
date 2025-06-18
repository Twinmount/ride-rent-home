import VehicleGrid from "@/components/root/listing/vehicle-grids/VehicleGrid";
import { convertToLabel, singularizeType } from "@/helpers";
import PriceFilterTag from "@/components/root/listing/PriceFilterTag";
import JsonLd from "@/components/common/JsonLd";
import MapClientWrapper from "@/components/listing/MapClientWrapper";
import ListingHeading from "@/components/root/listing/ListingHeading";
import {
  fetchListingMetadata,
  getListingPageJsonLd,
} from "@/app/(root)/[country]/[state]/listing/listing-metadata";

type ListingPageRendererProps = {
  category: string;
  vehicleType?: string;
  brand?: string;
  state: string;
  country: string;
  searchParams: {
    [key: string]: string | undefined;
  };
};

/**
 * This centralized component renders the page content on all types of listing pages.
 */
const ListingPageRenderer = async ({
  category,
  vehicleType,
  brand,
  state,
  country,
  searchParams,
}: ListingPageRendererProps) => {
  // Format display labels
  const formattedCategory = singularizeType(convertToLabel(category));
  const formattedState = convertToLabel(state);
  const formattedBrand = brand ? convertToLabel(brand) : "";

  // Prepare vehicleTypes array
  const vehicleTypes = vehicleType ? [convertToLabel(vehicleType)] : [];
  const oneVehicleType = vehicleTypes.length === 1;

  // Fetch metadata
  const data: any = await fetchListingMetadata(
    state,
    category,
    vehicleType ?? "other",
    country,
  );

  // Prepare JSON-LD schema
  const jsonLdData = getListingPageJsonLd(state, formattedCategory, country);

  return (
    <>
      <JsonLd
        id={`json-ld-listing-${state}-${category}`}
        jsonLdData={jsonLdData}
      />
      <div className="-mx-2 flex flex-wrap">
        {/* LEFT: Listing & Filters */}
        <div className="w-full px-2 lg:w-1/2">
          <div className="relative h-auto min-h-screen bg-lightGray px-3 pb-8 pt-4">
            <ListingHeading
              formattedCategory={formattedCategory}
              formattedState={formattedState}
              formattedBrand={formattedBrand}
              vehicleTypes={vehicleTypes}
              heading={data?.result?.h1}
              subheading={data?.result?.h2}
              oneVehicleType={oneVehicleType}
            />

            <PriceFilterTag />

            <VehicleGrid
              key={JSON.stringify(searchParams)}
              country={country}
              state={state}
              category={category}
              vehicleType={vehicleType}
              brand={brand}
            />
          </div>
        </div>

        {/* RIGHT: Map */}
        {/* <div className="hidden w-full px-2 lg:block lg:w-1/2">
          <div
            className="sticky top-[4rem] p-3"
            style={{ height: "calc(100vh - 4rem)" }}
          >
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <MapClientWrapper />
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default ListingPageRenderer;
