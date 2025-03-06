"use client";
import Link from "next/link";
import { generateCompanyProfilePageLink } from "@/helpers";

interface CompanyPromotion {
  companyLogo?: string;
  companyName?: string;
  companyId?: string;
  totalVehicleCount?: number;
}

interface CompanyPromotionItemProps {
  element: CompanyPromotion;
}

export const CompanyPromotionItem = ({
  element,
}: CompanyPromotionItemProps) => {
  const companyProfilePageLink = generateCompanyProfilePageLink(
    element.companyName ?? "",
    element.companyId ?? "",
  );

  return (
    <Link
      href={companyProfilePageLink}
      className="flex flex-col items-center"
      onClick={() => (document.activeElement as HTMLElement)?.blur()}
    >
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 text-lg text-gray-600">
        {element.companyLogo ? (
          <img
            src={element.companyLogo}
            alt={`${element.companyName || "Company"} Logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="/assets/img/blur-profile.webp"
            alt="profile-icon"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <p className="mt-1 text-center text-xs font-medium text-gray-700">
        {element.companyName}
      </p>
      <p className="text-xs text-gray-500">
        ({element.totalVehicleCount} Vehicles)
      </p>
    </Link>
  );
};
