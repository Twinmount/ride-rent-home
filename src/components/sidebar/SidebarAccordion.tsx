"use client";

import { useState } from "react";
import Link from "next/link";
import { GiSteeringWheel } from "react-icons/gi";
import { FaLink, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useParams } from "next/navigation";
import RegisterLinkButton from "../common/RegisterLinkButton";
import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { useQuery } from "@tanstack/react-query";
import { fetchQuickLinksByValue } from "@/lib/api/general-api";
import { LinkType, BrandType, FetchTopBrandsResponse } from "@/types";
import { API } from "@/utils/API";
import { getAssetsUrl } from "@/utils/getCountryAssets";
import SafeImage from "@/components/common/SafeImage";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) => (
  <div className="border-b">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-2 py-4 transition-colors duration-200 hover:bg-gray-50"
      aria-expanded={isOpen}
    >
      <div className="flex items-center">
        {icon}
        <span className="font-[500]">{title}</span>
      </div>
      {isOpen ? (
        <FaChevronUp className="text-sm text-gray-500" />
      ) : (
        <FaChevronDown className="text-sm text-gray-500" />
      )}
    </button>
    {isOpen && <div className="px-2 pb-4 pl-6">{children}</div>}
  </div>
);

export function SidebarAccordion({
  onLinkClick,
}: {
  onLinkClick?: () => void;
}) {
  const params = useParams<{ country: string }>();
  const country = (params?.country as string) || "ae";
  const { state, category } = useStateAndCategory();

  const baseAssetsUrl = getAssetsUrl(country);

  const [openSections, setOpenSections] = useState({
    categories: false,
    quickLinks: false,
    brands: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Vehicle categories
  const { categories, isCategoriesLoading } = useFetchVehicleCategories();

  // Quick links - only fetch when open
  const { data: linksData, isLoading: isLinksLoading } = useQuery({
    queryKey: ["quick-links", state],
    queryFn: () => fetchQuickLinksByValue(state, country),
    enabled: openSections.quickLinks && !!state,
    staleTime: 15 * 60 * 1000,
  });

  // Brands - only fetch when open
  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["top-brands", category, state, country],
    queryFn: async () => {
      const response = await API({
        path: `/vehicle-brand/top-brands?categoryValue=${category}&hasVehicle=true`,
        options: {},
        country,
      });
      const data: FetchTopBrandsResponse = await response.json();
      return data?.result || [];
    },
    enabled: openSections.brands && !!category && !!state,
    staleTime: 30 * 60 * 1000,
  });

  const quickLinks: LinkType[] = linksData?.result?.list || [];
  const brands: BrandType[] = brandsData || [];

  return (
    <div className="relative h-full">
      <div className="mx-auto mt-2 w-[95%]">
        {/* Vehicle Categories */}
        <CollapsibleSection
          title="Vehicle Category"
          icon={<GiSteeringWheel className="mr-2 text-lg text-orange" />}
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
        >
          {isCategoriesLoading ? (
            <div className="py-2 text-gray-500">Loading...</div>
          ) : categories.length > 0 ? (
            <div className="flex flex-col gap-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.categoryId}
                  href={`/${state}/${cat.value}`}
                  onClick={onLinkClick}
                  className={`flex items-center gap-2 py-1 text-sm transition-colors hover:text-yellow hover:underline ${
                    category === cat.value ? "text-yellow" : ""
                  }`}
                >
                  <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange"></div>
                  {cat.name}
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-2 text-sm text-red-500">No Categories found</div>
          )}
        </CollapsibleSection>

        {/* Quick Links */}
        {(quickLinks.length > 0 || openSections.quickLinks) && (
          <CollapsibleSection
            title="Quick Links"
            icon={<FaLink className="mr-3 text-lg text-orange" />}
            isOpen={openSections.quickLinks}
            onToggle={() => toggleSection("quickLinks")}
          >
            {isLinksLoading ? (
              <div className="py-2 text-gray-500">Loading...</div>
            ) : quickLinks.length > 0 ? (
              <div className="flex flex-col gap-y-1">
                {quickLinks.map((link) => (
                  <Link
                    key={link.linkId}
                    href={link.link}
                    onClick={onLinkClick}
                    className="flex items-center gap-2 py-1 text-sm transition-colors hover:text-yellow hover:underline"
                  >
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange"></div>
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-2 text-sm text-red-500">
                No Quick Links found
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* Brands */}
        <CollapsibleSection
          title="Brands"
          icon={<GiSteeringWheel className="mr-2 text-lg text-orange" />}
          isOpen={openSections.brands}
          onToggle={() => toggleSection("brands")}
        >
          {isBrandsLoading && openSections.brands ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange"></div>
                <span className="text-sm">Loading brands...</span>
              </div>
            </div>
          ) : brands.length > 0 ? (
            <div className="space-y-1">
              <div className="flex max-h-48 flex-col gap-1 overflow-y-auto pr-1">
                {brands.map((brand: BrandType) => (
                  <Link
                    key={brand.id}
                    href={`/${country}/${state}/listing/${category}/brand/${brand.brandValue}`}
                    onClick={onLinkClick}
                    className="flex items-center gap-2 py-1 text-sm transition-colors hover:text-yellow hover:underline"
                  >
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange"></div>
                    <div className="relative h-4 w-4 flex-shrink-0">
                      <SafeImage
                        src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
                        width={16}
                        height={16}
                        alt={brand.brandName}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="line-clamp-1 flex-1 text-base">
                      {brand.brandName}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/${country}/${state}/${category}/brands`}
                onClick={onLinkClick}
                className="mt-2 block py-1 text-base font-medium text-orange transition-colors hover:text-yellow hover:underline"
              >
                View All Brands ({brands.length})
              </Link>
            </div>
          ) : openSections.brands ? (
            <div className="py-2 text-base text-red-500">No Brands found</div>
          ) : null}
        </CollapsibleSection>
      </div>

      <RegisterLinkButton
        country={country}
        className="absolute bottom-0 left-0 right-0 z-[60] w-full"
      />
    </div>
  );
}
