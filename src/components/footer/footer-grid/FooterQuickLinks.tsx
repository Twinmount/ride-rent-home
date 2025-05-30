"use client";

import { LinkType } from "@/types";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchQuickLinksByValue } from "@/lib/api/general-api";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

export default function FooterQuickLinks() {
  const { state, country } = useStateAndCategory();
  // Fetch quick links based on the current state
  const { data, isLoading } = useQuery({
    queryKey: ["quick-links", state],
    queryFn: () => fetchQuickLinksByValue(state as string, country as string),
    enabled: !!state,
    staleTime: 15 * 60 * 1000, //15 minutes
  });

  const linksData: LinkType[] = data?.result?.list || [];

  return (
    <div>
      {/* locations  link */}
      <h3 className="mb-2 text-[1.1rem] text-yellow">Quick Links</h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-y-1 text-base font-light text-gray-400">
          {linksData.length > 0 ? (
            linksData.map((link) => (
              <Link
                href={`${link.link}`}
                className="flex w-fit gap-[0.2rem] text-white hover:text-white"
                key={link.linkId}
                target="_blank"
              >
                &sdot;{" "}
                <span className="w-fit cursor-pointer text-white transition-transform duration-300 ease-out hover:translate-x-2 hover:text-yellow hover:underline">
                  {link.label}
                </span>
              </Link>
            ))
          ) : (
            <div>No Links available</div>
          )}
        </div>
      )}
    </div>
  );
}
