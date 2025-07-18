import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { fetchFAQ } from '@/lib/api/general-api';
import { SectionHeading } from '../SectionHeading';
import ViewAllButton from '../ViewAllButton';
import { CiCircleQuestion } from 'react-icons/ci';

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
    <section className="section-container wrapper bg-white">
      <SectionHeading title={`Frequently Asked Questions `} />

      <Accordion
        type="single"
        collapsible
        className="mx-auto mt-7 w-full space-y-3 lg:max-w-[70%]"
      >
        {displayedFAQs.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="mx-4 overflow-hidden rounded-lg border border-border-default bg-white lg:mx-0"
          >
            <AccordionTrigger className="px-4 py-3 text-start text-sm font-normal text-text-secondary hover:no-underline lg:text-base">
              <div className="flex items-start gap-3">
                <CiCircleQuestion className="mt-0.5 h-6 w-6 flex-shrink-0 text-text-secondary" />
                <span className="text-left leading-relaxed">
                  {item.question}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-text px-4 pb-4 leading-relaxed text-text-secondary">
              <div className="ml-9">{item.answer}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ViewAllButton link={`/${country}/faq/${state}`} />
    </section>
  );
}
