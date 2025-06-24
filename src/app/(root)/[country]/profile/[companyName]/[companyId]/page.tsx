import AgentProfile from "@/components/agent-profile/AgentProfile";
import AgentVehicleFilter from "@/components/agent-profile/AgentVehicleFilter";
import AgentVehicleGrid from "@/components/agent-profile/AgentVehicleGrid";
import VehicleCardSkeletonGrid from "@/components/skelton/VehicleCardSkeleton";
import { FetchCompanyDetailsResponse } from "@/types";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";
import { generateCompanyMetadata, getCompanyJsonLd } from "./profile-metadata";
import JsonLd from "@/components/common/JsonLd";
import {
  convertToValue,
  generateCompanyProfilePageLink,
  sortFilters,
} from "@/helpers";
import { API } from "@/utils/API";

type PropsType = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ country: string; companyId: string; companyName: string }>;
};

// // Generate Meta Data
export async function generateMetadata(props: PropsType): Promise<Metadata> {
  const params = await props.params;

  const { companyId, country } = params;

  return generateCompanyMetadata(companyId, country);
}

export default async function AgentProfilePage(props: PropsType) {
  const params = await props.params;

  const { country, companyId, companyName } = params;

  const searchParams = await props.searchParams;

  // Default filter category set to "car"
  const filter = searchParams.filter;
  const page = parseInt(searchParams.page || "1", 10);

  // Fetch Data from API
  const response = await API({
    path: `/company/public?companyId=${companyId}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });

  const data: FetchCompanyDetailsResponse = await response.json();

  // Handle API errors or invalid data
  if (!response.ok || !data.result) {
    console.error("Invalid API response:", response.statusText);
    console.warn("triggering not found");
    return notFound();
  }

  // Extract company details and filters
  const companyDetails = data.result;
  const filters = data.result.categories || [];
  const sortedFilters = sortFilters(filters);

  // convert to lowercased-hyphen separated version
  const formattedCompanyName = convertToValue(
    companyDetails.companyName as string,
  );

  // if url companyName doesn't match the formattedCompanyName, then redirect to the correct url
  if (companyName !== formattedCompanyName) {
    const validProfileLink = generateCompanyProfilePageLink(
      companyDetails.companyName,
      companyId,
      country,
    );

    return redirect(validProfileLink);
  }

  // Generate JSON-LD
  const jsonLdData = getCompanyJsonLd(
    companyId,
    formattedCompanyName,
    companyDetails.companyName,
    companyDetails.companyAddress,
    companyDetails.companyLogo,
    country,
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
        <AgentVehicleFilter filters={sortedFilters} />

        <Suspense fallback={<VehicleCardSkeletonGrid count={9} />}>
          <AgentVehicleGrid
            filter={(filter ?? sortedFilters[0].value) as string}
            page={page}
            companyId={companyId}
            country={country}
          />
        </Suspense>
      </div>
    </>
  );
}
