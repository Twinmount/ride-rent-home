import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

type FAQStateProps = {
  stateValue: string;
};

type faqType = { question: string; answer: string }[];

async function fetchFAQData(stateValue: string): Promise<faqType> {
  try {
    // fetching FAQ data using dynamic import from the static folder
    const faqModule = await import(`@/constants/faq-data/${stateValue}`);
    return faqModule.default || [];
  } catch (error) {
    console.error("Failed to load FAQ data:", error);
    return [];
  }
}

// Server Component
export default async function FAQ({ stateValue }: FAQStateProps) {
  // dynamically fetch the FAQ data
  const faqData = await fetchFAQData(stateValue);

  if (faqData.length === 0) {
    return null;
  }

  return (
    <div className="section-container wrapper">
      <div className="relative mb-8 text-xl">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <Image
          width={50}
          height={50}
          src={"/assets/img/general/title-head.png"}
          alt="Custom Underline Image"
          className="absolute bottom-[0.8rem] left-1/2 h-auto w-16 -translate-x-1/2 transform"
        />
      </div>

      <Accordion type="single" collapsible className="mx-auto w-full md:w-3/4">
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
  );
}
