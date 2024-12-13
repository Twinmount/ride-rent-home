import "./ListingPage.scss";
import Filter from "@/components/root/listing/filter/Filter";
import GridSwitch from "@/components/root/listing/grid-switch/GridSwitch";
import LimitDropdown from "@/components/root/listing/limit-dropdown/LimitDropdown";
import VehicleGrid from "@/components/root/listing/vehicle-grids/VehicleGrid";

import { convertToLabel } from "@/helpers";
import { ListingPageMetaResponse, PageProps } from "@/types";
import { Metadata } from "next";
import { FC, Suspense } from "react";

export async function generateMetadata({
  params: { state },
  searchParams,
}: PageProps): Promise<Metadata> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // Default to 'cars' if category is undefined, otherwise use the value from searchParams
  const category = searchParams.category || "cars";

  // Get vehicleTypes and use 'other' if not provided
  let vehicleTypesParam = searchParams.vehicleTypes;

  // If there are multiple values, split and get the first one
  const vehicleType = vehicleTypesParam
    ? vehicleTypesParam.split(",")[0]
    : "other";

  // Construct the API URL with state, category, and vehicleType
  let url = `${baseUrl}/metadata/listing?state=${state}`;

  if (category) {
    url += `&category=${category}`;
  }

  if (vehicleType) {
    url += `&type=${vehicleType}`;
  }

  // Fetch metadata from your API endpoint
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  // Parse the JSON response
  const data: ListingPageMetaResponse = await response.json();

  // Check if the API returned valid metadata
  const metaTitle =
    data?.result?.metaTitle ||
    `Explore the best ${category} for rent in ${state}`;
  const metaDescription =
    data?.result?.metaDescription ||
    "Find and rent top-quality vehicles including cars, bikes, and more across various locations in UAE.";

  // Construct the canonical URL dynamically based on state, category, and search parameters
  const canonicalUrl = `https://ride.rent/${state}/listing?category=${category}`;

  // Fallback OpenGraph image or use the one from the API
  const ogImage = "/assets/icons/ride-rent.png";

  // Shortened versions for social media (optional)
  const shortTitle =
    metaTitle.length > 60 ? `${metaTitle.substring(0, 57)}...` : metaTitle;
  const shortDescription =
    metaDescription.length > 155
      ? `${metaDescription.substring(0, 152)}...`
      : metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: `${category}, ${vehicleType}, rental in ${state}, vehicle rental near me`,
    openGraph: {
      title: shortTitle,
      description: shortDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${category} listings for rent`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shortTitle,
      description: shortDescription,
      images: [ogImage],
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const ListingPage: FC<PageProps> = ({ searchParams, params: { state } }) => {
  // Determine the initial view based on URL parameters
  const isGridView = searchParams.view === "grid";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "6", 10);

  const category = searchParams.category;
  const brand = searchParams.brand;

  const isHourlyRental = searchParams.isHourlyRental === "true";

  const formattedCategory = convertToLabel(category);
  const formattedState = convertToLabel(state);
  const formattedBrand = convertToLabel(brand);

  // Parse and format the vehicleTypes from searchParams
  const vehicleTypes = searchParams.vehicleTypes
    ? searchParams.vehicleTypes.split(",").map((type) => convertToLabel(type))
    : [];

  return (
    <div className="listing-section wrapper">
      <div className="listing-navbar">
        <h1 className="listing-heading">
          Rent or Lease&nbsp;
          {formattedBrand && <span>{formattedBrand}&nbsp;</span>}
          <span>{formattedCategory} </span>in <span>{formattedState}</span>
          {/*rendering vehicle types, if there are any */}
          {vehicleTypes.length > 0 && (
            <span className="vehicle-types-heading">
              <span className="separator"> | </span>
              {vehicleTypes.length > 3 ? (
                <span className="vehicle-types">
                  {vehicleTypes[0]}, {vehicleTypes[1]}, {vehicleTypes[2]} and
                  more...
                </span>
              ) : (
                vehicleTypes.map((type, index) => (
                  <span key={index} className="vehicle-types">
                    {type}
                    {index < vehicleTypes.length - 1 && ", "}
                  </span>
                ))
              )}
            </span>
          )}
        </h1>

        <div className="list-navbar-right">
          {/* Limit dropdown */}
          <LimitDropdown />
          {/* grid vs list switch button */}
          <Suspense fallback={<div>...</div>}>
            <GridSwitch isGridView={isGridView} />
          </Suspense>
        </div>
      </div>

      <div className="listing-container">
        {/*dynamically imported filter */}
        <Filter category={searchParams.category} isMobile={false} />

        {/* vehicle grid */}
        <VehicleGrid
          isGridView={isGridView}
          page={page}
          limit={limit}
          state={state}
          isHourlyRental={isHourlyRental}
        />
      </div>
    </div>
  );
};

export default ListingPage;
