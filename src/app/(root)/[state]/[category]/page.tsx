import type { Metadata } from "next";
import FAQ from "@/components/common/FAQ/FAQ";
import SectionLoading from "@/components/general/section-loading/SectionLoading";
import Affordable from "@/components/root/landing/affordable/Affordable";
import Documents from "@/components/root/landing/documents/Documents";
import RideRentFeatures from "@/components/root/landing/features/Features";
import Landing from "@/components/root/landing/landing/Landing";
import Latest from "@/components/root/landing/latest/Latest";
import Locations from "@/components/common/locations/Locations";
import States from "@/components/root/landing/states/States";
import MostPopular from "@/components/root/landing/most-popular/MostPopular";
import NewlyArrived from "@/components/root/landing/newly-arrived/NewlyArrived";
import Promotions from "@/components/root/landing/promotion/Promotions";
import TopBrands from "@/components/root/landing/top-brands/TopBrands";
import VehicleTypes from "@/components/root/landing/vehicle-types/VehicleTypes";
import { Suspense } from "react";
import { PageProps } from "@/types";
import HourlyRentals from "@/components/root/landing/hourly-rentals/HourlyRentals";
import TrustedReviewsSection from "@/components/root/landing/trusted-reviews/TrustedReviewsSection";
import {
  fetchHomepageMetadata,
  generateHomePageMetadata,
} from "./landing-metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { state, category },
}: PageProps): Promise<Metadata> {
  const data = await fetchHomepageMetadata(state);

  if (!data) {
    return notFound();
  }

  return generateHomePageMetadata(data, state, category);
}

export default function Home({ params: { state, category } }: PageProps) {
  return (
    <>
      <Landing state={state} category={category} />
      <VehicleTypes state={state} category={category} />

      <Suspense fallback={<SectionLoading />}>
        <MostPopular state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <TopBrands state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Latest state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <NewlyArrived state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <HourlyRentals state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Affordable state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <States category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Promotions state={state} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <RideRentFeatures state={state} category={category} />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
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
