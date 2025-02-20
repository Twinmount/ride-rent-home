import { LinkType } from "@/types";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { ENV } from "@/config/env";

export default async function RelatedLinks({ state }: { state: string }) {
  const baseUrl = ENV.API_URL || ENV.NEXT_PUBLIC_API_URL;

  // generating api URL
  const apiUrl = `${baseUrl}/recomented-links/list?page=1&limit=10&sortOrder=ASC&stateValue=${state}`;

  const res = await fetch(apiUrl, {
    method: "GET",
    cache: "no-cache",
  });

  const data = await res.json();

  const linksData: LinkType[] = data?.result?.list || [];

  if (linksData.length === 0) {
    return null;
  }

  return (
    <MotionDiv className="flex w-full flex-col gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm lg:max-w-[25rem]">
      <div className="mb-8">
        <h2 className="custom-heading font-medium">Related links</h2>
      </div>
      <div className="flex w-full flex-col gap-4">
        {linksData.map((link) => (
          <Link
            href={`${link.link}`}
            className="hover:text-orange-500 flex w-full max-w-full items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-black underline"
            key={link.linkId}
            target="_blank"
          >
            <LinkIcon
              width={15}
              height={15}
              className="text-orange-500 min-w-[1rem]"
            />
            <span className="truncate">{link.label}</span>
          </Link>
        ))}
      </div>
    </MotionDiv>
  );
}
