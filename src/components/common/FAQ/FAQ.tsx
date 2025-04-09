import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fetchFAQ } from "@/lib/api/general-api";

type FAQStateProps = {
  stateValue: string;
};

type faqType = { question: string; answer: string }[];

// Server Component
export default async function FAQ({ stateValue }: FAQStateProps) {
  let faqData: faqType = [];

  try {
    const response = await fetchFAQ(stateValue);
    faqData = response?.result?.faqs || [];
  } catch (error) {
    console.error("Failed to load FAQ data:", error);
    faqData = [];
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

      {faqData.length === 0 ? (
        <p className="text-center text-gray-500">No FAQ found.</p>
      ) : (
        <Accordion type="single" collapsible className="mx-auto w-full md:w-3/4">
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
      )}
    </div>
  );
}
