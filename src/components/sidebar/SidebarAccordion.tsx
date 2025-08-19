"use client";

import { Accordion } from "@/components/ui/accordion";
import { CategoriesAccordion } from "./CatgoriesAccordion";
import { QuickLinksAccordion } from "./QuickLinksAccordion";
import Link from "next/link";
import { GiSteeringWheel } from "react-icons/gi";
import { useParams } from "next/navigation";
import RegisterLinkButton from "../common/RegisterLinkButton";

export function SidebarAccordion() {
  const params = useParams<{
    country: string;
  }>();

  const country = (params?.country as string) || "ae";

  return (
    <div className="relative h-full">
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

      <RegisterLinkButton
        country={country}
        className="absolute bottom-0 left-0 right-0 z-[60] w-full"
      />
    </div>
  );
}
