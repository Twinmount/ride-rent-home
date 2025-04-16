import AgentProfile from "@/components/agent-profile/AgentProfile";
import AgentVehicleFilter from "@/components/agent-profile/AgentVehicleFilter";
import AgentVehicleGrid from "@/components/agent-profile/AgentVehicleGrid";
import VehicleCardSkeletonGrid from "@/components/skelton/VehicleCardSkeleton";
import { FetchCompanyDetailsResponse } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { generateCompanyMetadata, getCompanyJsonLd } from "./profile-metadata";
import { ENV } from "@/config/env";
import JsonLd from "@/components/common/JsonLd";

type PropsType = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ companyId: string; companyName: string }>;
};

// // Generate Meta Data
export async function generateMetadata(props: PropsType): Promise<Metadata> {
  const params = await props.params;

  const { companyId } = params;

  return generateCompanyMetadata(companyId);
}

export default async function AgentProfilePage(props: PropsType) {
  const params = await props.params;

  const { companyId, companyName } = params;

  const searchParams = await props.searchParams;
  const baseUrl = ENV.API_URL;

  // Default filter category set to "car"
  const filter = searchParams.filter;
  const page = parseInt(searchParams.page || "1", 10);

  const url = `${baseUrl}/company/public?companyId=${companyId}`;

  // Fetch Data from API
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  const data: FetchCompanyDetailsResponse = await response.json();

  // Handle API errors or invalid data
  if (!response.ok || !data.result) {
    console.error("Invalid API response:", response.statusText);
    return notFound();
  }

  // Extract company details and filters
  const companyDetails = data.result;
  const filters = data.result.categories || [];

  // Generate JSON-LD
  const jsonLdData = getCompanyJsonLd(
    companyId,
    companyName,
    companyDetails.companyName,
    companyDetails.companyAddress,
    companyDetails.companyLogo,
  );

  return (
    <>
      {/*  Inject JSON-LD into the <head> */}
      <JsonLd id={`json-ld-company-${companyId}`} jsonLdData={jsonLdData} />

      <div className="wrapper pb-8 pt-4">
        {/* agent details */}
        <AgentProfile companyDetails={companyDetails} />

        <h1 className="mt-6 text-center text-xl font-[400] lg:text-2xl">
          Our Vehicles Available For Rent / Lease
        </h1>
        <AgentVehicleFilter filters={filters} />

        <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
          <AgentVehicleGrid
            filter={filter as string}
            page={page}
            companyId={companyId}
          />
        </Suspense>
      </div>
    </>
  );
}
