"use client";

import Link from "next/link";
import { generateCompanyProfilePageLink } from "@/helpers";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

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
  const { country } = useStateAndCategory();
  const companyProfilePageLink = generateCompanyProfilePageLink(
    element.companyName ?? "",
    element.companyId ?? "",
    country
  );

  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      href={companyProfilePageLink}
      className="flex flex-col items-center"
      onClick={() => (document.activeElement as HTMLElement)?.blur()}
    >
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 text-lg text-gray-600">
        {isLoading && (
          <motion.div
            className="absolute inset-0 h-full w-full bg-gray-300"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
        <img
          src={element?.companyLogo || "/assets/img/blur-profile.webp"}
          alt={`${element?.companyName || "Company"} Logo`}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
        />
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