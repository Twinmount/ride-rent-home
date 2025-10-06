import { redirect } from "next/navigation";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    state: string;
    category: string;
    vehicleCode: string;
    modelDetails: string;
    country: string;
  }>;
};

export default async function VehicleDetailsLayout({
  children,
  params,
}: LayoutProps) {
  const resolvedParams = await params;
  const { country, state, category } = resolvedParams;

  // Check if the URL contains "/rent/" and redirect to the vehicle-rentals page. this broken url happens when category is missing in the series listing page, which next renders this vehicle details page
  if (category === "rent") {
    redirect(`/${country}/${state}/vehicle-rentals`);
  }

  return <>{children}</>;
}
