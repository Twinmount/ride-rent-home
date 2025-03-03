import AgentProfile from "@/components/agent-profile/AgentProfile";
import AgentVehicleFilter from "@/components/agent-profile/AgentVehicleFilter";
import AgentVehicleGrid from "@/components/agent-profile/AgentVehicleGrid";
import VehicleCardSkeletonGrid from "@/components/skelton/VehicleCardSkeleton";
import { FetchCompanyDetailsResponse } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { generateCompanyMetadata } from "./profile-metadata";
import { ENV } from "@/config/env";

type PropsType = {
  searchParams: { [key: string]: string | undefined };
  params: { companyId: string };
};

// // Generate Meta Data
export async function generateMetadata({
  params: { companyId },
}: PropsType): Promise<Metadata> {
  return generateCompanyMetadata(companyId);
}

export default async function AgentProfilePage({
  searchParams,
  params: { companyId },
}: PropsType) {
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

  return (
    <section className="wrapper pb-8 pt-4">
      {/* agent details */}
      <AgentProfile companyDetails={companyDetails} />

      <h1 className="mt-6 text-center text-2xl font-semibold lg:text-3xl">
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
    </section>
  );
}
