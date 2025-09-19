import { PageProps } from "@/types";
import { Metadata } from "next";
import { FC } from "react";
import { generateListingMetadata } from "../../../listing-metadata";
import ListingPageRenderer from "@/components/root/listing/ListingPageRenderer";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { country, state, category, brand } = params;

  return generateListingMetadata({
    country,
    state,
    category,
    brand,
  });
}

const ListingCategoryBrandPage: FC<PageProps> = async (props) => {
  const params = await props.params;

  const { country, state, category, brand } = params;

  const searchParams = await props.searchParams;

  return (
    <ListingPageRenderer
      country={country}
      state={state}
      category={category}
      searchParams={searchParams}
      brand={brand}
    />
  );
};

export default ListingCategoryBrandPage;
