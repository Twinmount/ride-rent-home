import type { Metadata } from "next";
import FAQ from "@/components/common/FAQ/FAQ";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import Documents from "@/components/root/landing/documents/Documents";
import RideRentFeatures from "@/components/root/landing/RideRentFeatures";
import FeaturedVehicles from "@/components/root/landing/FeaturedVehicles";
import { Suspense } from "react";
import { PageProps } from "@/types";
import {
  generateHomePageMetadata,
  getHomePageJsonLd,
} from "./landing-metadata";
import CategoryTypesAndFilter from "@/components/root/landing/CategoryTypesAndFilter";
import HeroSection from "@/components/root/landing/HeroSection";
import FeaturedVehiclesSkeleton from "@/components/skelton/FeaturedVehiclesSkeleton";
import JsonLd from "@/components/common/JsonLd";
import Banner from "@/components/root/landing/Banner";
import CarSection from "@/components/root/landing/CarSection";
import BannerSkeleton from "@/components/skelton/BannerSkeleton";
import ComponentErrorBoundary from "@/app/ComponentErrorBoundary";
import PromotionDealsClient from "@/components/root/landing/PromotionDealsClient";
import NewlyArrivedClient from "@/components/root/landing/NewlyArrivedClient";
import TopBrandsClient from "@/components/root/landing/TopBrandsClient";
import StatesClient from "@/components/root/landing/StatesClient";

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

  // Generate JSON-LD
  const jsonLdData = await getHomePageJsonLd(state, category, country);

  return (
    <>
      {/* Inject JSON-LD into the <head> */}
      <JsonLd jsonLdData={jsonLdData} id="json-ld-homepage" />

      {/* SSR */}
      <ComponentErrorBoundary componentName="Banner">
        <Suspense fallback={<BannerSkeleton />}>
          <Banner state={state} country={country} />
        </Suspense>
      </ComponentErrorBoundary>

      {/* SSR */}
      <ComponentErrorBoundary componentName="HeroSection">
        <HeroSection country={country} state={state} category={category} />
      </ComponentErrorBoundary>

      <ComponentErrorBoundary componentName="CategoryTypesAndFilter">
        <CategoryTypesAndFilter />
      </ComponentErrorBoundary>

      {/* SSR */}
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

      {/* CSR*/}
      <ComponentErrorBoundary componentName="PromotionDealsClient">
        <PromotionDealsClient state={state} country={country} />
      </ComponentErrorBoundary>

      {/* CSR*/}
      <ComponentErrorBoundary componentName="NewlyArrivedClient">
        <NewlyArrivedClient
          state={state}
          category={category}
          country={country}
        />
      </ComponentErrorBoundary>

      {/* CSR*/}
      <ComponentErrorBoundary componentName="TopBrandsClient">
        <TopBrandsClient state={state} category={category} country={country} />
      </ComponentErrorBoundary>

      {/* CSR */}
      <CarSection />

      {/* SSR */}
      <ComponentErrorBoundary componentName="RideRentFeatures">
        <RideRentFeatures state={state} category={category} country={country} />
      </ComponentErrorBoundary>

      {/* CSR */}
      <ComponentErrorBoundary componentName="StatesClient">
        <StatesClient category={category} country={country} state={state} />
      </ComponentErrorBoundary>

      {/* CSR */}
      <Documents state={state} category={category} country={country} />

      {/* SSR */}
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
