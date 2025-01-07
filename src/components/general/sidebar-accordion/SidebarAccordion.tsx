"use client";
import "./SidebarAccordion.scss";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  fetchCategories,
  fetchQuickLinksByValue,
} from "@/lib/next-api/next-api";
import { CategoryType, LinkType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaLink } from "react-icons/fa6";
import { GiSteeringWheel } from "react-icons/gi";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

type SidebarAccordionType = {
  toggleSidebar: () => void;
};

export function SidebarAccordion({ toggleSidebar }: SidebarAccordionType) {
  const { state, category } = useParams<{ state: string; category: string }>();
  // Fetch categories using react-query
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch quick links using react-query
  const { data: linksData, isLoading: isLinksLoading } = useQuery({
    queryKey: ["quick-links", state],
    queryFn: () => fetchQuickLinksByValue(state),
    enabled: !!state, // Only fetch if state is provided
  });

  // Extract categories and links from the response
  const categories: CategoryType[] = categoryData?.result?.list || [];
  const quickLinks: LinkType[] = linksData?.result?.list || [];

  return (
    <Accordion
      defaultValue="item-1"
      type="single"
      collapsible
      className="mx-auto mt-5 w-[95%]"
    >
      {/* Vehicle Categories Section */}
      <AccordionItem value="item-1">
        <AccordionTrigger className="no-underline hover:no-underline">
          <div className="flex items-center">
            <GiSteeringWheel className="mr-3 text-lg text-orange" />
            Vehicle Category
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-y-1 rounded-xl bg-slate-100 p-1 pl-2">
          {isCategoryLoading ? (
            <div>Loading...</div>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.categoryId}
                href={`/${state}/${cat.value}`}
                onClick={toggleSidebar}
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

      {/* Quick Links Section */}
      {quickLinks.length > 0 && (
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
                  onClick={toggleSidebar}
                  className="accordion-item flex cursor-pointer items-center gap-2 text-base hover:text-yellow hover:underline"
                >
                  <MdKeyboardDoubleArrowRight />
                  {link.label}
                </Link>
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
