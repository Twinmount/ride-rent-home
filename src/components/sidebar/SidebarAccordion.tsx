"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { fetchCategories, fetchQuickLinksByValue } from "@/lib/api/general-api";
import { CategoryType, LinkType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";
import { GiSteeringWheel } from "react-icons/gi";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export function SidebarAccordion() {
  return (
    <Accordion
      defaultValue="item-1"
      type="single"
      collapsible
      className="mx-auto mt-5 w-[95%]"
    >
      {/* Vehicle Categories accordion */}
      <CategoriesAccordion />

      {/* Quick Links accordion */}
      <QuickLinksAccordion />
    </Accordion>
  );
}

// Categories accordion
const CategoriesAccordion = () => {
  const { state, category } = useStateAndCategory();

  const { categories, isCategoriesLoading } = useFetchVehicleCategories();

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger className="w-full no-underline hover:no-underline">
        <div className="flex items-center">
          <GiSteeringWheel className="mr-2 text-lg text-orange" />
          Vehicle Category
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-y-1 rounded-xl bg-slate-100 p-1 pl-2">
        {isCategoriesLoading ? (
          <div>Loading...</div>
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <Link
              key={cat.categoryId}
              href={`/${state}/${cat.value}`}
              className={`accordion-item flex cursor-pointer items-center gap-2 text-base hover:text-yellow hover:underline ${
                category === cat.value ? "text-yellow" : ""
              }`}
            >
              <MdKeyboardDoubleArrowRight />
              {cat.name}
            </Link>
          ))
        ) : (
          <div className="accordion-item text-base text-red-500">
            No Categories found
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

// quick links accordion
const QuickLinksAccordion = () => {
  const { state } = useStateAndCategory();

  const { data: linksData, isLoading: isLinksLoading } = useQuery({
    queryKey: ["quick-links", state],
    queryFn: () => fetchQuickLinksByValue(state),
    enabled: !!state, // Only fetch if state is provided
    staleTime: 15 * 60 * 1000, //15 minutes
  });

  const quickLinks: LinkType[] = linksData?.result?.list || [];

  if (quickLinks.length === 0) return null;

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="no-underline hover:no-underline">
        <div className="flex items-center">
          <FaLink className="mr-3 text-lg text-orange" />
          Quick Links
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-y-1 rounded-xl bg-slate-100 p-1 pl-2">
        {isLinksLoading ? (
          <div>Loading...</div>
        ) : (
          quickLinks.map((link) => (
            <Link
              key={link.linkId}
              href={link.link}
              className="accordion-item flex cursor-pointer items-center gap-2 text-base hover:text-yellow hover:underline"
            >
              <MdKeyboardDoubleArrowRight />
              {link.label}
            </Link>
          ))
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
