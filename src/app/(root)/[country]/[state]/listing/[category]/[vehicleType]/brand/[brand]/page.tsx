import { PageProps } from "@/types";
import { Metadata } from "next";
import { FC } from "react";
import {
  fetchListingMetadata,
  generateListingMetadata,
} from "../../../../listing-metadata";

import { getDefaultMetadata } from "@/app/root-metadata";
import ListingPageRenderer from "@/components/root/listing/ListingPageRenderer";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { country, state, category, vehicleType } = params;

  const host = "https://ride.rent";
  const canonicalUrl = `${host}/${country}/${state}/listing${
    searchParams
      ? `?${new URLSearchParams(searchParams as Record<string, string>)}`
      : ""
  }`;

  const data = await fetchListingMetadata(
    state,
    category,
    vehicleType,
    country,
  );

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

const ListingCategoryTypeBrandPage: FC<PageProps> = async (props) => {
  const params = await props.params;

  const { country, state, category, vehicleType, brand } = params;

  const searchParams = await props.searchParams;

  return (
    <ListingPageRenderer
      country={country}
      state={state}
      category={category}
      vehicleType={vehicleType}
      brand={brand}
      searchParams={searchParams}
    />
  );
};

export default ListingCategoryTypeBrandPage;
