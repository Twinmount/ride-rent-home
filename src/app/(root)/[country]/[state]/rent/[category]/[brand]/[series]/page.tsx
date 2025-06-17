import VehicleSeriesInfo from "@/components/root/series/VehicleSeriesInfo";
import { Metadata } from "next";
import {
  generateSeriesListingPageMetadata,
  getSeriesListingPageJsonLd,
} from "./metadata";
import JsonLd from "@/components/common/JsonLd";
import SeriesListingGrid from "@/components/root/listing/vehicle-grids/SeriesListingGrid";
import { extractCategory } from "@/helpers";

export type PageProps = {
  params: Promise<{
    country: string;
    state: string;
    category: string;
    brand: string;
    series: string;
  }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
 
  const { country, state, category, brand, series } = params;
 
  const categoryValue = extractCategory(category);
 
  return generateSeriesListingPageMetadata({
    state,
    category: categoryValue,
    brand,
    series,
    country
  });
}


export default async function VehicleSeriesPage(props: PageProps) {
  const params = await props.params;
 
  const { country, state, category, brand, series } = params;

 
  const categoryValue = extractCategory(category);
 
  // Generate JSON-LD
  const jsonLdData = getSeriesListingPageJsonLd(state, brand, series, country, categoryValue);

  return (
    <>
      {/* Inject JSON-LD into the <head> */}
      <JsonLd
        id={`json-ld-series-${brand}-${series}`}
        jsonLdData={jsonLdData}
      />
      <div className="wrapper flex h-auto min-h-screen flex-col bg-lightGray pb-8 pt-4">
        <VehicleSeriesInfo
          series={series}
          state={state}
          brand={brand}
          country={country}
        />
       
        <SeriesListingGrid
          brand={brand}
          series={series}
          state={state}
          country={country}
          category={categoryValue}
        />
      </div>
    </>
  );
}