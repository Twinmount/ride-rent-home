import AgentProfile from "@/components/agent-profile/AgentProfile";
import AgentVehicleFilter from "@/components/agent-profile/AgentVehicleFilter";
import AgentVehicleGrid from "@/components/agent-profile/AgentVehicleGrid";
import VehicleCardSkeleton from "@/components/skelton/VehicleCardSkeleton";
import { FetchCompanyDetailsResponse } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";



// Generate Meta Data
export async function generateMetadata({
  params: { companyName },
}: {
  params: { companyName: string };
}): Promise<Metadata> {
  const baseUrl = process.env.API_URL;

  // Fetch company details from your API
  const response = await fetch(`${baseUrl}/company/public?companyName=${companyName}`, {
    method: "GET",
    cache: "no-cache",
  });

  const data = await response.json();

  if (!response.ok || !data.result || !data.result.companyName) {
    return notFound();
  }

  const companyDetails = data.result;

  // Construct meta title
  const title = `${companyDetails.companyName} | Rent cars, bikes, sport cars, bicycles, buses, vans, buggies, and charters from Ride.Rent | Most trusted vehicle renting platform.`;

  // Construct meta description
  const description = `Rent cars, bikes, sports cars, bicycles, buses, vans, buggies, and charters effortlessly with ${companyDetails.companyName}. Partnering with the best rental agencies, Ride.Rent is your trusted vehicle rental platform for seamless bookings, unbeatable prices, and top-quality service.`;

  // Construct canonical URL
  const canonicalUrl = `https://ride.rent/${companyName.replace(/\s+/g, "-").toLowerCase()}`;

  // Use the company logo as the Open Graph image, fallback to a default image if no logo is provided
  const ogImage = companyDetails.companyLogo || "/assets/icons/ride-rent.png";

  return {
    title,
    description,
    keywords: `rent vehicles, ${companyDetails.companyName}, cars, bikes, charters, vehicle rental platform`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          alt: `${companyDetails.companyName} logo`,
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


export default async function AgentProfilePage({ searchParams, params: { companyId } }: { 
  searchParams: { [key: string]: string | undefined }; 
  params: { companyId: string; }; 
  }) {

  const baseUrl = process.env.API_URL;


  // Default filter category set to "car"
  const filter = searchParams.filter || "cars";
  const page = parseInt(searchParams.page || "1", 10);

  // Fetch Data from API
  const response = await fetch(`${baseUrl}/company/public?companyId=${companyId}`, {
    method: "GET",
    next: { revalidate: 600 },
  });

  const data: FetchCompanyDetailsResponse = await response.json();

  // Handle API errors or invalid data
  if (!response.ok || !data.result || !data.result.companyName) {
    console.error("Invalid API response:", response.statusText);
    return notFound();
  }
  
  
  
  // Extract company details and filters
  const companyDetails = data.result;
  const filters = data.result.categories || [];

  // Render Components

  return (
    <section className="wrapper bg-white">
      <AgentProfile companyDetails={companyDetails} />
      <AgentVehicleFilter filters={filters} />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">      
            <VehicleCardSkeleton />
          </div>
        }
      >
        <AgentVehicleGrid filter={filter} page={page} companyId={companyId} />
      </Suspense>
    </section>
  );
}