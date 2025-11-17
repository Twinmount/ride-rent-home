import { FetchBlogFAQResponse } from "@/types/blog.types";
import BlogViewTracker from "./BlogViewTracker";
import { API } from "@/utils/API";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type Props = {
  blogId: string;
  country: string;
};

export default async function BlogFaq({ blogId, country }: Props) {
  // Fetch brand data from  API endpoint
  const response = await API({
    path: `/blog-faqs/public/${blogId}`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country: country,
  });

  const data: FetchBlogFAQResponse = await response.json();

  const faqData = (data.result && data.result.faqs) || [];

  if (faqData.length === 0) {
    return null;
  }

  return (
    <div className="wrapper mt-4 py-8">
      <BlogViewTracker blogId={blogId} />
      <h2 className="custom-heading mx-auto w-fit text-center text-2xl font-bold lg:text-3xl">
        FAQ
      </h2>
      <Accordion
        type="single"
        collapsible
        className="mx-auto mt-7 w-full space-y-3 lg:max-w-[70%]"
      >
        {faqData.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
