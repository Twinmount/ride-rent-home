"use client";

import MotionSection from "@/components/general/framer-motion/MotionSection";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllButton from "@/components/common/ViewAllButton";
import { BrandType } from "@/types";
import { convertToLabel } from "@/helpers";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { fetchTopBrands } from "@/lib/api/general-api";
import BrandsCarouselSkeleton from "@/components/skelton/BrandsCarouselSkeleton";
import BrandCard from "@/components/card/BrandCard";

type Props = {
  category: string;
  state: string;
  country: string;
};

export default function TopBrandsClient({ category, state, country }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["topBrands", category, country],
    queryFn: () => fetchTopBrands(category, country),
    staleTime: 10 * 60 * 1000,
    enabled: !!category && !!country,
  });

  if (isLoading) {
    return <BrandsCarouselSkeleton state={state} />;
  }

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
