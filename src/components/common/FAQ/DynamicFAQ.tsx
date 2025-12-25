import MotionSection from "@/components/general/framer-motion/MotionSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CACHE_TAGS } from "@/constants/cache.constants";

import { VehicleDetailsPageType } from "@/types/vehicle-details-types";
import { API } from "@/utils/API";
import { getCacheConfig } from "@/utils/cache.utils";

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
  let faqData: FAQItem[] = [];

  try {
    const response = await API({
      path: `/vehicle-faq/${vehicle.vehicleCode}`,
      options: {
        method: "GET",
        ...getCacheConfig({
          tags: [CACHE_TAGS.VEHICLE_DETAILS_FAQ],
        }),
      },
      country,
    });

    const result = await response.json();

    if (result.status === "SUCCESS" && Array.isArray(result.result)) {
      faqData = result.result;
    }
  } catch (error) {
    console.error("Failed to fetch FAQ data:", error);
  }

  if (faqData.length === 0) {
    return null;
  }

  return (
    <MotionSection className="w-full pb-12 pt-8">
      <h3 className="mb-6 text-center font-poppins text-[1.12rem] font-medium leading-[1] text-text-primary sm:text-[1.6rem] lg:text-[2rem]">
        Frequently Asked Questions
      </h3>

      <div className="mx-auto w-full max-w-7xl px-4">
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col gap-6 2xl:flex-row"
        >
          {/* Left Column (Even index items) */}
          <div className="w-full space-y-3 2xl:w-1/2">
            {faqData
              .filter((_, index) => index % 2 === 0)
              .map((item, originalIndex) => (
                <AccordionItem
                  className="mb-1 rounded-lg bg-white p-1 px-4 shadow lg:px-2"
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

          {/* Right Column (Odd index items) */}
          <div className="w-full space-y-3 2xl:w-1/2">
            {faqData
              .filter((_, index) => index % 2 === 1)
              .map((item, originalIndex) => (
                <AccordionItem
                  className="mb-1 rounded-lg bg-white p-1 px-4 shadow lg:px-2"
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
    </MotionSection>
  );
}
