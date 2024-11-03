import "./QuickLinks.scss";
import { LinkType } from "@/types";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";

export default async function QuickLinks({ state }: { state: string }) {
  const baseUrl = process.env.API_URL;

  // generating api URL
  const apiUrl = `${baseUrl}/recomented-links/list?page=1&limit=10&sortOrder=ASC&stateValue=${state}`;

  const res = await fetch(apiUrl, {
    method: "GET",
    cache: "no-cache",
  });

  const data = await res.json();

  const linksData: LinkType[] = data?.result?.list || [];

  return (
    <MotionDiv className="quick-links-container">
      <div className="links-heading">
        <h2 className="custom-heading">Related links</h2>
      </div>
      <div className="links-box">
        {linksData.length > 0 ? (
          linksData.map((link) => (
            <Link
              href={`${link.link}`}
              className="link truncate"
              key={link.linkId}
              target="_blank"
            >
              <LinkIcon width={15} height={15} className="link-icon" />
              <span className="link">{link.label}</span>
            </Link>
          ))
        ) : (
          <div>No Links available</div>
        )}
      </div>
    </MotionDiv>
  );
}
