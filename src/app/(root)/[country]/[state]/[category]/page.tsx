import type { Metadata } from "next";
import FAQ from "@/components/common/FAQ/FAQ";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import Documents from "@/components/root/landing/documents/Documents";
import RideRentFeatures from "@/components/root/landing/features/Features";
import States from "@/components/root/landing/states/States";
import FeaturedVehicles from "@/components/root/landing/FeaturedVehicles";
import TopBrands from "@/components/root/landing/TopBrands";
import { Suspense } from "react";
import { PageProps } from "@/types";
import {
  generateHomePageMetadata,
  getHomePageJsonLd,
} from "./landing-metadata";
import BrandsCarouselSkeleton from "@/components/skelton/BrandsCarouselSkeleton";
import NewlyArrived from "@/components/root/landing/NewlyArrived";
import CategoryTypesAndFilter from "@/components/root/landing/CategoryTypesAndFilter";
import HeroSection from "@/components/root/landing/HeroSection";
import VehicleCardCarouselSkeleton from "@/components/skelton/VehicleCardCarouselSkeleton";
import FeaturedVehiclesSkeleton from "@/components/skelton/FeaturedVehiclesSkeleton";
import StatesGridSkeleton from "@/components/skelton/StatesGridSkeleton";
import JsonLd from "@/components/common/JsonLd";
import Banner from "@/components/root/landing/Banner";
import CarSection from "@/components/root/landing/CarSection";
import PromotionDeals from "@/components/root/landing/PromotionDeals";
import BannerSkeleton from "@/components/skelton/BannerSkeleton";
import PromotionSkeleton from "@/components/skelton/PromotionSkeleton";
import ComponentErrorBoundary from "@/app/ComponentErrorBoundary";

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { country, state, category } = params;
  const vehicleType = searchParams.type;

  return generateHomePageMetadata(state, category, country, vehicleType);
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { country, state, category } = params;

  const vehicleType = searchParams.type;
  // console.log("Page params:", { country, state, category });

  // Generate JSON-LD
  const jsonLdData = await getHomePageJsonLd(state, category, country);

  return (
    <>
      {/* Inject JSON-LD into the <head> */}
      <ComponentErrorBoundary componentName="JsonLd">
        <JsonLd jsonLdData={jsonLdData} id="json-ld-homepage" />
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="Banner">
        <Suspense fallback={<BannerSkeleton />}>
          <Banner state={state} country={country} />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="HeroSection">
        <HeroSection country={country} state={state} category={category} />
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="CategoryTypesAndFilter">
        <CategoryTypesAndFilter />
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="FeaturedVehicles">
        <Suspense fallback={<FeaturedVehiclesSkeleton layoutType="carousel" />}>
          <FeaturedVehicles
            state={state}
            category={category}
            vehicleType={vehicleType}
            country={country}
          />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="PromotionDeals">
        <Suspense fallback={<PromotionSkeleton />}>
          <PromotionDeals state={state} country={country} />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="NewlyArrived">
        <Suspense
          fallback={<VehicleCardCarouselSkeleton layoutType="carousel" />}
        >
          <NewlyArrived state={state} category={category} country={country} />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="TopBrands">
        <Suspense fallback={<BrandsCarouselSkeleton state={state} />}>
          <TopBrands state={state} category={category} country={country} />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="CarSection">
        <Suspense fallback={<BrandsCarouselSkeleton state={state} />}>
          <CarSection />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="RideRentFeatures">
        <Suspense fallback={<SectionLoading />}>
          <RideRentFeatures
            state={state}
            category={category}
            country={country}
          />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="States">
        <Suspense fallback={<StatesGridSkeleton />}>
          <States category={category} country={country} state={state} />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="Documents">
        <Suspense fallback={<StatesGridSkeleton />}>
          <Documents state={state} category={category} country={country} />
        </Suspense>
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="FAQ">
        <Suspense fallback={<SectionLoading />}>
          <FAQ
            state={state || (country === "in" ? "bangalore" : "dubai")}
            limit={8}
            country={country}
          />
        </Suspense>
      </ComponentErrorBoundary>
    </>
  );
}
