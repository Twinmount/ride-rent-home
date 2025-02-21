import type { Metadata } from "next";
import FAQ from "@/components/common/FAQ/FAQ";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import Documents from "@/components/root/landing/documents/Documents";
import RideRentFeatures from "@/components/root/landing/features/Features";
import Locations from "@/components/common/locations/Locations";
import States from "@/components/root/landing/states/States";
import MainGrid from "@/components/root/landing/MainGrid";
import Recommended from "@/components/root/landing/Recommended";
import TopBrands from "@/components/root/landing/TopBrands";
import { Suspense } from "react";
import { PageProps } from "@/types";
import TrustedReviewsSection from "@/components/root/landing/trusted-reviews/TrustedReviewsSection";
import { generateHomePageMetadata } from "./landing-metadata";
import BrandsCarouselSkeleton from "@/components/skelton/BrandsCarouselSkeleton";
import NewlyArrived from "@/components/root/landing/NewlyArrived";
import VehicleCategoryAndFilter from "@/components/root/landing/VehicleCategoryAndFilter";
import HeroSection from "@/components/root/landing/HeroSection";
import VehicleCardSkeletonGrid from "@/components/skelton/VehicleCardSkeleton";
import VehicleCardCarouselSkeleton from "@/components/skelton/VehicleCardCarouselSkeleton";
import StatesGridSkeleton from "@/components/skelton/StatesGridSkeleton";

export async function generateMetadata({
  params: { state, category },
}: PageProps): Promise<Metadata> {
  return generateHomePageMetadata(state, category);
}
export default function Home({
  params: { state, category },
  searchParams,
}: PageProps) {
  // accessing vehicle type from the url if its available for the MainGrid component.
  const vehicleType = searchParams.type;
  return (
    <>
      <HeroSection state={state} category={category} />
      <VehicleCategoryAndFilter />

      <Suspense fallback={<VehicleCardSkeletonGrid />}>
        <MainGrid state={state} category={category} vehicleType={vehicleType} />
      </Suspense>

      <Suspense fallback={<BrandsCarouselSkeleton state={state} />}>
        <TopBrands state={state} category={category} />
      </Suspense>



      <Suspense fallback={<VehicleCardCarouselSkeleton />}>
        <NewlyArrived state={state} category={category} />
      </Suspense>

      <Suspense fallback={<StatesGridSkeleton />}>
        <States category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Recommended state={state} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <RideRentFeatures state={state} category={category} />
        <Documents state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <FAQ stateValue={state || "dubai"} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Locations state={state} category={category} />
        <TrustedReviewsSection />
      </Suspense>
    </>
  );
}
