import { formatToUrlFriendly } from "@/helpers";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type FetchCompanyDetailsResponse = {
  result?: {
    companyName: string;
    companyAddress: string;
    companyLogo: string;
  };
};

export async function fetchCompanyDetails(
  companyId: string,
): Promise<FetchCompanyDetailsResponse | null> {
  const baseUrl = process.env.API_URL;

  try {
    const response = await fetch(
      `${baseUrl}/company/public?companyId=${companyId}`,
      {
        method: "GET",
        cache: "no-cache",
      },
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch company details:", error);
    return null;
  }
}

export function generateCompanyMetadata(
  companyDetails: FetchCompanyDetailsResponse["result"],
  companyId: string,
): Metadata {
  if (!companyDetails) {
    notFound();
  }

  const companyName = companyDetails.companyName || "Ride.Rent";
  const companyAddress = companyDetails.companyAddress || "UAE";

  const title = `${companyName}, Affordable Vehicle Renting & Leasing Company in ${companyAddress} | A Ride.Rent Partner.`;

  const description = `Rent or Lease cars, bikes, sports cars, bicycles, buses, vans, buggies, and charters effortlessly with ${companyName}. Partnering with the best rental agencies, Ride.Rent is your trusted vehicle rental platform for seamless bookings, unbeatable prices, and top-quality service when it comes to vehicle renting and leasing.`;

  const formattedCompanyName = formatToUrlFriendly(companyName);
  const companyProfilePageLink = `/profile/${formattedCompanyName}/${companyId}`;

  const canonicalUrl = `https://ride.rent/${companyProfilePageLink}`;
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
