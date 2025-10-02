import MotionSection from "@/components/general/framer-motion/MotionSection";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllButton from "@/components/common/ViewAllButton";
import { BrandType, FetchTopBrandsResponse } from "@/types";
import Link from "next/link";
import { convertToLabel } from "@/helpers";
import SafeImage from "@/components/common/SafeImage";

import { ENV } from "@/config/env";
import { API } from "@/utils/API";
import { SectionHeading } from "@/components/common/SectionHeading";

export const revalidate = 3600;

export default async function TopBrands({
  category,
  state,
  country,
}: {
  category: string | undefined;
  state: string | undefined;
  country: string | undefined;
}) {
  // Fetch brand data from your API endpoint
  const response = await API({
    path: `/vehicle-brand/top-brands?categoryValue=${category}&hasVehicle=true`,
    options: {},
    country: country,
  });

  // Parse the JSON response
  const data: FetchTopBrandsResponse = await response.json();

  // Extract the list of brands from the response
  const brands = data?.result || [];

  if (brands.length === 0) return null;

  const formattedState = convertToLabel(state as string);

  return (
    <MotionSection className="section-container wrapper">
      <SectionHeading
        title={`Rent From Top Brands In ${formattedState}`}
        subtitle="Premium cars from leading brands, ready for your journey."
      />

      <CarouselWrapper
        ariaLabel={`Top ${category} brands in ${formattedState} carousel`}
        previousLabel="Previous brand"
        nextLabel="Next brand"
      >
        {brands.map((brand: BrandType) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            category={category!}
            state={state!}
            country={country!}
          />
        ))}
      </CarouselWrapper>

      <ViewAllButton link={`/${country}/${state}/${category}/brands`} />
    </MotionSection>
  );
}

// Render a single brand card
function BrandCard({
  brand,
  category,
  state,
  country,
}: {
  brand: BrandType;
  category: string;
  state: string;
  country: string;
}) {
  const baseAssetsUrl = ENV.ASSETS_URL;

  return (
    <Link
      href={`/${country}/${state}/listing/${category}/brand/${brand.brandValue}`}
      key={brand.id}
      className="flex aspect-square h-[8rem] max-h-[8rem] min-h-[8rem] w-[8rem] min-w-[8rem] max-w-[8rem] cursor-pointer flex-col items-center justify-between rounded-[0.5rem] border border-black/10 bg-white p-2 shadow-[0px_2px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out hover:shadow-[0px_2px_2px_rgba(0,0,0,0.5)]"
      aria-label={`View ${brand.brandName} ${category} rentals in ${convertToLabel(state)}`} // Add descriptive aria-label
    >
      <div className="relative m-auto flex h-[6rem] min-h-[6rem] w-full min-w-full items-center justify-center">
        <SafeImage
          src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
          width={80}
          height={80}
          alt={`${brand.brandName} logo`} // More descriptive alt text
          className="h-full w-full object-contain"
          loading="lazy" // Add lazy loading for performance
        />
      </div>
      <div
        className="line-clamp-1 flex h-[20%] w-[95%] max-w-[95%] items-center justify-center truncate text-[0.9rem] text-[#181818]"
        aria-hidden="true" // Hide from screen readers since aria-label on link provides context
      >
        {brand.brandName}
      </div>
    </Link>
  );
}
