"use client";

import { Accordion } from "@/components/ui/accordion";
import { CategoriesAccordion } from "./CatgoriesAccordion";
import { QuickLinksAccordion } from "./QuickLinksAccordion";
import Link from "next/link";
import { GiSteeringWheel } from "react-icons/gi";

export function SidebarAccordion() {
  return (
    <>
      <Link
        href={`https://agent.ride.rent/register`}
        target="_blank"
        rel="noopener noreferrer"
        className="yellow-gradient default-btn"
      >
        List your vehicle for FREE
      </Link>

      {/* sidebar accordion */}
      <Accordion type="single" collapsible className="mx-auto mt-2 w-[95%]">
        {/* Vehicle Categories accordion */}
        <CategoriesAccordion />

        {/* Quick Links accordion */}
        <QuickLinksAccordion />
      </Accordion>

      {/* brands */}
      <a
        href="#brands"
        className="ml-2 flex items-center gap-x-1 border-b py-4 font-[500]"
      >
        <GiSteeringWheel className="mr-2 text-lg text-orange" />
        Brands
      </a>
    </>
  );
}
