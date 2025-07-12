import type { Metadata } from "next";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import Documents from "@/components/root/landing/documents/Documents";
import RideRentFeatures from "@/components/root/landing/features/Features";
import Locations from "@/components/common/locations/Locations";
import MainVehicleGrid from "@/components/root/landing/FeaturedVehicles";
import Recommended from "@/components/root/landing/PromotionDeals";
import TopBrands from "@/components/root/landing/TopBrands";
import { Suspense } from "react";
import { PageProps } from "@/types";
import TrustedReviewsSection from "@/components/root/landing/trusted-reviews/TrustedReviewsSection";
import {
  generateHomePageMetadata,
  getHomePageJsonLd,
} from "./landing-metadata";
import BrandsCarouselSkeleton from "@/components/skelton/BrandsCarouselSkeleton";
import NewlyArrived from "@/components/root/landing/NewlyArrived";
import VehicleCategoryAndFilter from "@/components/root/landing/VehicleCategoryAndFilter";
import HeroSection from "@/components/root/landing/HeroSection";
import VehicleCardSkeletonGrid from "@/components/skelton/VehicleCardSkeleton";
import VehicleCardCarouselSkeleton from "@/components/skelton/VehicleCardCarouselSkeleton";
import StatesGridSkeleton from "@/components/skelton/StatesGridSkeleton";
import JsonLd from "@/components/common/JsonLd";
import Banner from "@/components/root/landing/Banner";
import BannerSkeleton from "@/components/skelton/BannerSkeleton";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { country, state, category } = params;

  return generateHomePageMetadata(state, category, country);
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { country, state, category } = params;

  // accessing vehicle type from the url if its available for the MainVehicleGrid component.
  const vehicleType = searchParams.type;

  // Generate JSON-LD
  const jsonLdData = getHomePageJsonLd(state, category, country);
  return (
    <>
      {/* Inject JSON-LD into the <head> */}
      <JsonLd jsonLdData={jsonLdData} id="json-ld-homepage" />

      <Suspense fallback={<BannerSkeleton />}>
        <Banner state={state} country={country} />
      </Suspense>

      <HeroSection state={state} category={category} />

      <VehicleCategoryAndFilter />

      <Suspense fallback={<VehicleCardSkeletonGrid />}>
        <MainVehicleGrid
          state={state}
          category={category}
          vehicleType={vehicleType}
          country={country}
        />
      </Suspense>

      <Suspense fallback={<BrandsCarouselSkeleton state={state} />}>
        <TopBrands state={state} category={category} country={country} />
      </Suspense>

      <Suspense fallback={<VehicleCardCarouselSkeleton />}>
        <NewlyArrived state={state} category={category} country={country} />
      </Suspense>

      <Suspense fallback={<StatesGridSkeleton />}>
        {/* <States category={category} country={country} /> */}
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Recommended state={state} country={country} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <RideRentFeatures state={state} category={category} country={country} />
        <Documents state={state} category={category} country={country} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        {/* <FAQ
          stateValue={state || country === "in" ? "bangalore" : "dubai"}
          country={country}
        /> */}
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Locations state={state} category={category} country={country} />
        <TrustedReviewsSection />
      </Suspense>
    </>
  );
}
