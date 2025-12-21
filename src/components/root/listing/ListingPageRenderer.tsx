import VehicleGridWithInfiniteLoading from "@/components/root/listing/vehicle-grids/VehicleGridWithInfiniteLoading";
import JsonLd from "@/components/common/JsonLd";
import MapClientWrapper from "@/components/listing/MapClientWrapper";
import ListingHeader from "@/components/root/listing/ListingHeader";
import {
  generateListingHeadings,
  getListingPageJsonLd,
} from "@/app/(root)/[country]/[state]/listing/listing-metadata";
import ListingPageBreadcrumb from "./ListingPageBreadcrumb";

type ListingPageRendererProps = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
  searchParams: {
    [key: string]: string | undefined;
  };
};

/**
 * This centralized component renders the page content on all 5 types of listing pages such as:
 * /listing/[category]
 * /listing/[category]/[vehicleType]
 * /listing/[category]/brand/[brand]
 * /listing/[category]/[vehicleType]/brand/[brand]
 * /listing/[category]/city/[city]
 */
const ListingPageRenderer = async ({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
  searchParams,
}: ListingPageRendererProps) => {
  const pageHeading = await generateListingHeadings({
    country,
    state,
    category,
    vehicleType,
    brand,
    city,
  });

  // Prepare JSON-LD schema
  const jsonLdData = getListingPageJsonLd({
    country,
    state,
    category,
    vehicleType,
    brand,
  });

  const jsonLdId = `json-ld-listing-${country}-${state}-${category}-${vehicleType || "all"}-${brand || "all"}`;

  return (
    <>
      <JsonLd id={jsonLdId} key={jsonLdId} jsonLdData={jsonLdData} />

      <ListingHeader pageHeading={pageHeading} />

      <div className="flex flex-wrap">
        {/* Left: Map */}
        <div className="hidden w-full lg:block lg:w-[45%]">
          <div
            className="sticky top-[4rem] pr-3 pt-3"
            style={{ height: "calc(90vh - 4rem)" }}
          >
            <div
              style={{
                borderRadius: "0.6rem",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <MapClientWrapper />
            </div>
          </div>
        </div>

        {/* Right: Listing & Filters */}
        <div className="w-full pt-2 lg:w-[55%] lg:p-2">
          <div className="relative mb-0 h-auto min-h-[90vh] pb-3">
            <ListingPageBreadcrumb
              country={country}
              state={state}
              category={category}
              vehicleType={vehicleType}
              brand={brand}
              city={city}
            />

            <VehicleGridWithInfiniteLoading
              key={JSON.stringify(searchParams)}
              country={country}
              state={state}
              category={category}
              vehicleType={vehicleType}
              brand={brand}
              city={city}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingPageRenderer;
