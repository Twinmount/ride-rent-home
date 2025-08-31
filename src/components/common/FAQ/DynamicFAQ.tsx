import React from 'react';
import MotionSection from '@/components/general/framer-motion/MotionSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';

import { VehicleDetailsPageType } from '@/types/vehicle-details-types';
import { ENV } from '@/config/env';

type DynamicFAQProps = {
  vehicle: VehicleDetailsPageType;
  country: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

export default async function DynamicFAQ({
  vehicle,
  country,
}: DynamicFAQProps) {
  const baseUrl = country === 'in' ? ENV.API_URL_INDIA : ENV.API_URL;

  let faqData: FAQItem[] = [];

  try {
    const response = await fetch(
      `${baseUrl}/vehicle-faq/${vehicle.vehicleCode}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );

    const result = await response.json();

    if (result.status === 'SUCCESS' && Array.isArray(result.result)) {
      faqData = result.result;
    }
  } catch (error) {
    console.error('Failed to fetch FAQ data:', error);
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
      <h3 className="mb-6 text-center font-poppins text-[1.12rem] font-medium leading-[1] text-text-primary sm:text-[1.6rem] lg:text-[2rem]">
        Frequently Asked Questions
      </h3>

      <div className="mx-auto w-full">
        {/* Mobile/Tablet: Single column accordion (below lg) */}
        <div className="2xl:hidden">
          <Accordion
            type="single"
            collapsible
            className="mx-auto w-full gap-y-3 space-y-2"
          >
            {faqData.map((item, index) => (
              <AccordionItem
                className="mb-1 rounded-lg bg-white p-1 px-4 shadow lg:px-2"
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

        {/* Desktop: Single Accordion, but items are split between two columns */}
        <div className="hidden w-full 2xl:flex 2xl:gap-6">
          <Accordion type="single" collapsible className="flex w-full gap-6">
            {/* Left Column (Accordion items with even index) */}
            <div className="w-1/2 space-y-3">
              {faqData
                .filter((_, index) => index % 2 === 0)
                .map((item, originalIndex) => (
                  <AccordionItem
                    className="mb-1 rounded-lg bg-white p-1 px-4 shadow"
                    key={`left-item-${originalIndex}`}
                    value={`item-${originalIndex * 2 + 1}`}
                  >
                    <AccordionTrigger className="text-start hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
            </div>

            {/* Right Column (Accordion items with odd index) */}
            <div className="w-1/2 space-y-3">
              {faqData
                .filter((_, index) => index % 2 === 1)
                .map((item, originalIndex) => (
                  <AccordionItem
                    className="mb-1 rounded-lg bg-white p-1 px-4 shadow"
                    key={`right-item-${originalIndex}`}
                    value={`item-${originalIndex * 2 + 2}`}
                  >
                    <AccordionTrigger className="text-start hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
            </div>
          </Accordion>
        </div>
      </div>
    </MotionSection>
  );
}
