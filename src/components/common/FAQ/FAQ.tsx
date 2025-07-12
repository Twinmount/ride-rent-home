import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchFAQ } from "@/lib/api/general-api";
import { SectionHeading } from "../SectionHeading";
import ViewAllButton from "../ViewAllButton";

type FAQStateProps = {
  state: string;
  country: string;
};

type faqType = { question: string; answer: string }[];

// Server Component
export default async function FAQ({ state, country }: FAQStateProps) {
  let faqData: faqType = [];

  try {
    const response = await fetchFAQ(state, country);
    faqData = response?.result?.faqs || [];
  } catch (error) {
    faqData = [];
  }

  if (faqData.length === 0) {
    return null;
  }

  return (
    <section className="section-container wrapper">
      <SectionHeading title={`Frequently Asked Questions `} />

      {/* <Accordion
        type="single"
        collapsible
        className="mx-auto grid w-full grid-cols-1 items-start gap-3 gap-x-6 lg:grid-cols-2"
      > */}
      <Accordion
        type="single"
        collapsible
        className="mx-auto w-full lg:max-w-[80%]"
      >
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="mb-1 rounded-lg bg-white p-1 px-4 shadow"
          >
            <AccordionTrigger className="text-start hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ViewAllButton link={`/${country}/${state}`} />
    </section>
  );
}
