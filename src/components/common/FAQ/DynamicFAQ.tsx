import React from "react";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

import { VehicleDetailsPageType } from "@/types/vehicle-details-types";
import { ENV } from "@/config/env";

type DynamicFAQProps = {
  vehicle: VehicleDetailsPageType;
};

type FAQItem = {
  question: string;
  answer: string;
};

export default async function DynamicFAQ({ vehicle }: DynamicFAQProps) {
  const baseUrl = ENV.API_URL;

  let faqData: FAQItem[] = [];

  try {
    const response = await fetch(
      `${baseUrl}/vehicle-faq/${vehicle.vehicleCode}`,
      {
        method: "GET",
        cache: "no-cache",
      },
    );

    const result = await response.json();

    if (result.status === "SUCCESS" && Array.isArray(result.result)) {
      faqData = result.result;
    }
  } catch (error) {
    console.error("Failed to fetch FAQ data:", error);
  }

  if (faqData.length === 0) {
    return (
      <MotionSection className="w-full pb-12 pt-8">
        <div className="text-center text-lg text-gray-600">No FAQ found</div>
      </MotionSection>
    );
  }

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
