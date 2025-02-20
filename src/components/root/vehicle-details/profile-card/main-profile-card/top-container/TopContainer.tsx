import "./TopContainer.scss";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import { MdVerifiedUser } from "react-icons/md";
import { Company } from "@/types/vehicle-details-types";

type TopContainerProps = {
  company: Company;
  companyProfilePageLink: string;
};

const TopContainer = ({
  company,
  companyProfilePageLink,
}: TopContainerProps) => {
  return (
    <div className="top-container">
      <div className="top">
        {/* moving border animation */}
        <div className="absolute inset-0 z-0 h-full w-full animate-rotate rounded-full bg-[conic-gradient(#ffa733_20deg,transparent_120deg)]" />
        <Link
          href={companyProfilePageLink}
          target="_blank"
          className="company-black-overlay"
        >
          Visit Company
          <SquareArrowOutUpRight />
        </Link>

        <Link href={companyProfilePageLink} className="profile-details">
          <div
            className={`${
              company.companyProfile ? "" : "blurred-profile"
            } profile-logo`}
          >
            <img
              src={company.companyProfile || "/assets/img/blur-profile.webp"}
              alt={
                company?.companyName
                  ? `${company.companyName} logo`
                  : "Company logo"
              }
              loading="lazy"
              className="company-profile-logo"
              draggable={false}
            />
          </div>
          <div>
            <p
              className={`${
                company.companyName ? "" : "blurred-text"
              } company-name`}
            >
              {company.companyName || "Company Disabled"}
            </p>
            <div className="verified">
              <MdVerifiedUser className="icon" />
              <span>Verified Vendor</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="view-portfolio">View Portfolio</div>
    </div>
  );
};

export default TopContainer;
