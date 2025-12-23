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
  limit?: number;
};

type faqType = { question: string; answer: string }[];

// Server Component
export default async function FAQ({ state, country, limit }: FAQStateProps) {
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

  // Apply limit if provided, otherwise show all
  const displayedFAQs = limit ? faqData.slice(0, limit) : faqData;

  return (
    <section className="section-container wrapper">
      <SectionHeading title={`Frequently Asked Questions `} />

      <Accordion
        type="single"
        collapsible
        className="mx-auto mt-7 w-full space-y-3 lg:max-w-[70%]"
      >
        {displayedFAQs.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {limit && <ViewAllButton link={`/${country}/faq/${state}`} />}
    </section>
  );
}
