import VehicleSeriesInfo from "@/components/root/series/VehicleSeriesInfo";
import { fetchVehicleSeriesData } from "./action";
import LoadMoreSeries from "@/components/root/series/LoadMoreSeries";
import { Metadata } from "next";
import {
  generateSeriesListingPageMetadata,
  getSeriesListingPageJsonLd,
} from "./metadata";
import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";
import JsonLd from "@/components/common/JsonLd";

export type PageProps = {
  params: Promise<{
    state: string;
    brand: string;
    series: string;
    country: string;
  }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { state, brand, series, country } = params;

  return generateSeriesListingPageMetadata({ state, brand, series, country });
}

export default async function VehicleSeriesPage(props: PageProps) {
  const params = await props.params;

  const { country, state, brand, series } = params;

  const data = await fetchVehicleSeriesData({
    page: 1,
    state,
    vehicleSeries: series,
    country,
  });

  const hasVehicles = !!data.vehicles?.length;

  // Generate JSON-LD
  const jsonLdData = getSeriesListingPageJsonLd(state, brand, series, country);

  return (
    <>
      {/* Inject JSON-LD into the <head> */}
      <JsonLd
        id={`json-ld-series-${brand}-${series}`}
        jsonLdData={jsonLdData}
      />
      <div className="wrapper flex h-auto min-h-screen flex-col bg-lightGray pb-8 pt-4">
        <VehicleSeriesInfo series={series} state={state} brand={brand} />

        {hasVehicles ? (
          <>
            {/* initial first page of data (SSR) */}
            <section className={`mt-6 w-full`}>
              <VehicleGridWrapper classNames="mb-4">
                {data.vehicles}
              </VehicleGridWrapper>

              {/* infinitely loading remaining data from page 2 onwards (CSR) */}
              <LoadMoreSeries state={state} series={series} />
            </section>
          </>
        ) : (
          <NoSeriesVehiclesFound />
        )}
      </div>
    </>
  );
}

// no vehicles found for this series
function NoSeriesVehiclesFound() {
  return (
    <section className="flex h-screen w-full justify-center bg-lightGray pb-8 pt-48">
      <span className="w-fit text-lg italic text-gray-500">
        No Vehicles Found
      </span>
    </section>
  );
}
