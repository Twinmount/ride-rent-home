import React from "react";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

import { generateDynamicFAQ } from "@/helpers";
import { VehicleDetailsPageType } from "@/types/vehicle-details-types";

type DynamicFAQProps = {
  vehicle: VehicleDetailsPageType;
};

export default function DynamicFAQ({ vehicle }: DynamicFAQProps) {
  // helper function to generate dynamic FAQ based on the vehicle
  const faqData = generateDynamicFAQ(vehicle);

  if (faqData.length === 0) return null;

  return (
    <MotionSection className="w-full pb-12 pt-8">
      <div className="relative mb-12 text-xl">
        <h2 className="mb-6 text-center text-xl">Frequently Asked Questions</h2>
        <Image
          width={50}
          height={50}
          src={"/assets/img/general/title-head.png"}
          alt="Custom Underline Image"
          className="absolute bottom-[-1.25rem] left-1/2 h-auto w-16 -translate-x-1/2 transform"
        />
      </div>

      <div className="mx-auto w-full md:w-[95%]">
        <Accordion type="single" collapsible className="mx-auto w-full">
          {faqData.map((item, index) => (
            <AccordionItem
              className="mb-1 rounded-lg bg-white p-1 px-4 shadow"
              key={index}
              value={`item-${index + 1}`}
            >
              <AccordionTrigger className="text-start hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </MotionSection>
  );
}
