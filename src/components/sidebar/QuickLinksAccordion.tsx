import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { fetchQuickLinksByValue } from "@/lib/api/general-api";
import { LinkType } from "@/types";
import { FaLink } from "react-icons/fa6";

export const QuickLinksAccordion = () => {
  const { state, country } = useStateAndCategory();

  const { data: linksData, isLoading: isLinksLoading } = useQuery({
    queryKey: ["quick-links", state],
    queryFn: () => fetchQuickLinksByValue(state, country),
    enabled: !!state, // Only fetch if state is provided
    staleTime: 15 * 60 * 1000, //15 minutes
  });

  const quickLinks: LinkType[] = linksData?.result?.list || [];

  if (quickLinks.length === 0) return null;

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="no-underline hover:no-underline">
        <div className="flex items-center">
          <FaLink className="mr-3 text-lg text-orange" />
          Quick Links
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-y-1 rounded-xl bg-slate-100 p-1 pl-2">
        {isLinksLoading ? (
          <div>Loading...</div>
        ) : (
          quickLinks.map((link) => (
            <Link
              key={link.linkId}
              href={link.link}
              className="accordion-item flex cursor-pointer items-center gap-2 text-base hover:text-yellow hover:underline"
            >
              <MdKeyboardDoubleArrowRight />
              {link.label}
            </Link>
          ))
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
