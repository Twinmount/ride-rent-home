import VehicleGrid from '@/components/root/listing/vehicle-grids/VehicleGrid';
import PriceFilterTag from '@/components/root/listing/PriceFilterTag';
import JsonLd from '@/components/common/JsonLd';
import MapClientWrapper from '@/components/listing/MapClientWrapper';
import ListingHeading from '@/components/root/listing/ListingHeading';
import {
  fetchListingMetadata,
  getListingPageJsonLd,
} from '@/app/(root)/[country]/[state]/listing/listing-metadata';
import ListingPageBreadcrumb from './ListingPageBreadcrumb';

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
 * This centralized component renders the page content on all 4 types of listing pages such as:
 * /listing/[category]
 * eg: /listing/[category]/[vehicleType]
 * eg: /listing/[category]/brand/[brand]
 * eg: /listing/[category]/[vehicleType]/brand/[brand]
 */
const ListingPageRenderer = async ({
  category,
  vehicleType,
  brand,
  state,
  country,
  searchParams,
}: ListingPageRendererProps) => {
  // Fetch metadata for heading h1 and h2
  const data = await fetchListingMetadata({
    country,
    state,
    category,
    vehicleType: vehicleType || 'other',
  });

  // Prepare JSON-LD schema
  const jsonLdData = getListingPageJsonLd({
    country,
    state,
    category,
    vehicleType,
    brand,
  });

  const jsonLdId = `json-ld-listing-${country}-${state}-${category}-${vehicleType || 'all'}-${brand || 'all'}`;

  return (
    <>
      <JsonLd id={jsonLdId} key={jsonLdId} jsonLdData={jsonLdData} />
      <div className="no-global-padding -mx-2 flex flex-wrap">
        {/* Left: Map */}
        <div className="hidden w-full px-2 lg:block lg:w-1/2">
          <div
            className="sticky top-[4rem] p-3"
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <MapClientWrapper />
            </div>
          </div>
        </div>

        {/* Right: Listing & Filters */}
        <div className="w-full px-2 lg:w-1/2">
          <div className="relative mb-0 h-auto min-h-[90vh] px-1 pb-3 pt-8">
            <ListingHeading
              country={country}
              state={state}
              category={category}
              vehicleType={vehicleType}
              brand={brand}
              heading={data?.result?.h1}
              subheading={data?.result?.h2}
            />

            {/* <ListingPageBreadcrumb
              country={country}
              state={state}
              category={category}
              vehicleType={vehicleType}
              brand={brand}
            /> */}

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
      </div>
    </>
  );
};

export default ListingPageRenderer;
