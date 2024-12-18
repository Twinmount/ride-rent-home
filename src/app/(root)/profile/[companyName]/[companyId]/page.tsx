import AgentProfile from "@/components/agent-profile/AgentProfile";
import AgentVehicleFilter from "@/components/agent-profile/AgentVehicleFilter";
import AgentVehicleGrid from "@/components/agent-profile/AgentVehicleGrid";
import VehicleCardSkeleton from "@/components/skelton/VehicleCardSkeleton";
import { formatToUrlFriendly } from "@/helpers";
import { FetchCompanyDetailsResponse } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type PropsType = {
  searchParams: { [key: string]: string | undefined };
  params: { companyId: string };
};

// // Generate Meta Data
export async function generateMetadata({
  params: { companyId },
}: PropsType): Promise<Metadata> {
  const baseUrl = process.env.API_URL;

  // Fetch company details from your API
  const response = await fetch(
    `${baseUrl}/company/public?companyId=${companyId}`,
    {
      method: "GET",
      cache: "no-cache",
    }
  );

  const data: FetchCompanyDetailsResponse = await response.json();

  if (!response.ok || !data.result) {
    return notFound();
  }

  const companyDetails = data.result;

  const companyName = companyDetails.companyName || "Ride.Rent";
  const companyAddress = companyDetails.companyAddress || "UAE";

  // Construct meta title
  const title = `${companyName}, Affordable Vehicle Renting & Leasing Company in ${companyAddress} | A Ride.Rent Partner.`;

  // Construct meta description
  const description = `Rent or Lease cars, bikes, sports cars, bicycles, buses, vans, buggies, and
charters effortlessly with ${companyName}. Partnering with the best rental agencies, Ride.Rent
is your trusted vehicle rental platform for seamless bookings, unbeatable prices, and top-quality
service when it comes to vehicle renting and leasing.`;

  // Construct canonical URL
  const formattedCompanyName = formatToUrlFriendly(companyName);
  const companyProfilePageLink = `/profile/${formattedCompanyName}/${companyId}`;

  const canonicalUrl = `https://ride.rent/${companyProfilePageLink}`;

  // Use the company logo as the Open Graph image, fallback to a default image if no logo is provided
  const ogImage = companyDetails.companyLogo || "/assets/icons/ride-rent.png";

  return {
    title,
    description,
    keywords: `rent vehicles, ${companyName}, cars, bikes, charters, vehicle rental platform`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${companyName} logo`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function AgentProfilePage({
  searchParams,
  params: { companyId },
}: PropsType) {
  const baseUrl = process.env.API_URL;

  // Default filter category set to "car"
  const filter = searchParams.filter;
  const page = parseInt(searchParams.page || "1", 10);

  // Fetch Data from API
  const response = await fetch(
    `${baseUrl}/company/public?companyId=${companyId}`,
    {
      method: "GET",
      cache: "no-cache",
    }
  );

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
    <section className="wrapper bg-white">
      <AgentProfile companyDetails={companyDetails} />
      <h1 className="text-2xl lg:text-3xl font-semibold mt-6 text-center">
        Our Vehicles Available For Rent / Lease
      </h1>
      <AgentVehicleFilter filters={filters} />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VehicleCardSkeleton />
          </div>
        }
      >
        <AgentVehicleGrid
          filter={filter as string}
          page={page}
          companyId={companyId}
        />
      </Suspense>
    </section>
  );
}
