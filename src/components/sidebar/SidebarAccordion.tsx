"use client";

import { useState } from "react";
import Link from "next/link";
import { GiSteeringWheel } from "react-icons/gi";
import { FaLink, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useParams } from "next/navigation";
import RegisterLinkButton from "../common/RegisterLinkButton";
import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { useQuery } from "@tanstack/react-query";
import { fetchQuickLinksByValue } from "@/lib/api/general-api";
import { LinkType, BrandType, FetchTopBrandsResponse } from "@/types";
import { API } from "@/utils/API";
import { ENV } from "@/config/env";
import Image from "next/image";

// Custom collapsible section component
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
    {isOpen && (
      <div className="px-2 pb-4">
        <div className="rounded-xl bg-slate-100 p-1 pl-2">{children}</div>
      </div>
    )}
  </div>
);

// Vehicle Categories Section
const VehicleCategoriesSection = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { state, category } = useStateAndCategory();
  const { categories, isCategoriesLoading } = useFetchVehicleCategories();

  return (
    <CollapsibleSection
      title="Vehicle Category"
      icon={<GiSteeringWheel className="mr-2 text-lg text-orange" />}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {isCategoriesLoading ? (
        <div className="py-2 text-gray-500">Loading...</div>
      ) : categories.length > 0 ? (
        <div className="flex flex-col gap-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.categoryId}
              href={`/${state}/${cat.value}`}
              className={`flex cursor-pointer items-center gap-2 py-1 text-base transition-colors hover:text-yellow hover:underline ${
                category === cat.value ? "text-yellow" : ""
              }`}
            >
              <MdKeyboardDoubleArrowRight />
              {cat.name}
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-2 text-base text-red-500">No Categories found</div>
      )}
    </CollapsibleSection>
  );
};

// Quick Links Section
const QuickLinksSection = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { state, country } = useStateAndCategory();

  const { data: linksData, isLoading: isLinksLoading } = useQuery({
    queryKey: ["quick-links", state],
    queryFn: () => fetchQuickLinksByValue(state, country),
    enabled: !!state,
    staleTime: 15 * 60 * 1000,
  });

  const quickLinks: LinkType[] = linksData?.result?.list || [];

  if (quickLinks.length === 0) return null;

  return (
    <CollapsibleSection
      title="Quick Links"
      icon={<FaLink className="mr-3 text-lg text-orange" />}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {isLinksLoading ? (
        <div className="py-2 text-gray-500">Loading...</div>
      ) : (
        <div className="flex flex-col gap-y-1">
          {quickLinks.map((link) => (
            <Link
              key={link.linkId}
              href={link.link}
              className="flex cursor-pointer items-center gap-2 py-1 text-base transition-colors hover:text-yellow hover:underline"
            >
              <MdKeyboardDoubleArrowRight />
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
};

// Brands Section with conditional fetching and better loading
const BrandsSection = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { state, country, category } = useStateAndCategory();
  const params = useParams<{ country: string }>();
  const currentCountry = (params?.country as string) || "ae";

  // Only fetch when the section is open
  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["top-brands", category, state, country],
    queryFn: async () => {
      const response = await API({
        path: `/vehicle-brand/top-brands?categoryValue=${category}&hasVehicle=true`,
        options: {},
        country: currentCountry,
      });
      const data: FetchTopBrandsResponse = await response.json();
      return data?.result || [];
    },
    enabled: isOpen && !!category && !!state, // Only fetch when section is open
    staleTime: 30 * 60 * 1000,
  });

  const brands: BrandType[] = brandsData || [];
  const baseAssetsUrl = ENV.ASSETS_URL;

  return (
    <CollapsibleSection
      title="Brands"
      icon={<GiSteeringWheel className="mr-2 text-lg text-orange" />}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {isBrandsLoading && isOpen ? (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange"></div>
            <span className="text-sm">Loading brands...</span>
          </div>
        </div>
      ) : brands.length > 0 ? (
        <div className="space-y-2">
          <div className="relative">
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto pr-1">
              {brands.map((brand: BrandType, index) => (
                <Link
                  key={brand.id}
                  href={`/${currentCountry}/${state}/listing/${category}/brand/${brand.brandValue}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 transition-all duration-200 hover:border-orange hover:shadow-sm"
                >
                  <div className="relative h-8 w-8 flex-shrink-0">
                    <Image
                      src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
                      width={32}
                      height={32}
                      alt={brand.brandName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="line-clamp-1 flex-1 text-sm font-medium text-gray-800">
                    {brand.brandName}
                  </span>
                </Link>
              ))}
            </div>

            {/* Sticky View All button at bottom */}
            <div className="sticky bottom-0 mt-2 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent pt-2">
              <Link
                href={`/${currentCountry}/${state}/${category}/brands`}
                className="block w-full rounded-lg bg-orange px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-orange/90"
              >
                View All Brands ({brands.length})
              </Link>
            </div>
          </div>
        </div>
      ) : isOpen ? (
        <div className="py-2 text-base text-red-500">No Brands found</div>
      ) : null}
    </CollapsibleSection>
  );
};

// Main Sidebar Component
export function SidebarAccordion() {
  const params = useParams<{ country: string }>();
  const country = (params?.country as string) || "ae";

  // State for controlling which sections are open
  const [openSections, setOpenSections] = useState({
    categories: true,
    quickLinks: false,
    brands: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="relative h-full">
      <div className="mx-auto mt-2 w-[95%]">
        {/* Vehicle Categories */}
        <VehicleCategoriesSection
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
        />

        {/* Quick Links */}
        <QuickLinksSection
          isOpen={openSections.quickLinks}
          onToggle={() => toggleSection("quickLinks")}
        />

        {/* Brands */}
        <BrandsSection
          isOpen={openSections.brands}
          onToggle={() => toggleSection("brands")}
        />
      </div>

      <RegisterLinkButton
        country={country}
        className="absolute bottom-0 left-0 right-0 z-[60] w-full"
      />
    </div>
  );
}