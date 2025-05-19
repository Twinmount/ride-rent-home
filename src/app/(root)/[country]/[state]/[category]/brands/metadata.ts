import { singularizeType } from "@/helpers";

export async function generateBrandsListingPageMetadata({
  state,
  category,
  country,
}: {
  state: string;
  category: string;
  country: string;
}) {
  const canonicalUrl = `https://ride.rent/${country}/${state}/${category}/brands`;
  const title = `Explore Vehicle Brands - ${singularizeType(
    category,
  )} in ${state}`;
  const description = `Browse and explore top vehicle brands for ${singularizeType(
    category,
  )} rentals in ${state}. Find the perfect brand to suit your needs.`;

  return {
    title,
    description,
    keywords: `vehicle brands, ${singularizeType(
      category,
    )}, ${state}, vehicle rental brands`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
