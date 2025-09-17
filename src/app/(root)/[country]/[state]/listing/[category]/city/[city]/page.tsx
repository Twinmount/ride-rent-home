import { PageProps } from "@/types";
import { Metadata } from "next";
import { FC } from "react";

import ListingPageRenderer from "@/components/root/listing/ListingPageRenderer";
import { generateListingMetadata } from "../../../listing-metadata";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { country, state, category, city } = params;

  return generateListingMetadata({
    country,
    state,
    category,
    city,
  });
}

const ListingCategoryCityPage: FC<PageProps> = async (props) => {
  const params = await props.params;

  const { country, state, category, city } = params;

  const searchParams = await props.searchParams;

  return (
    <ListingPageRenderer
      country={country}
      state={state}
      category={category}
      city={city}
      searchParams={searchParams}
    />
  );
};

export default ListingCategoryCityPage;
