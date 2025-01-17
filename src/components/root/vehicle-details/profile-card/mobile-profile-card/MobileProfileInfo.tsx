import { Company } from "@/types/vehicle-details-types";
import Link from "next/link";
import { MdVerifiedUser } from "react-icons/md";

type MobileProfileInfoProps = {
  companyProfilePageLink: string;
  company: Company;
};

const MobileProfileInfo = ({
  companyProfilePageLink,
  company,
}: MobileProfileInfoProps) => {
  return (
    <div className="border-wrapper">
      {/* Animated border */}
      <div className="absolute inset-0 z-0 h-full w-full animate-rotate rounded-full bg-[conic-gradient(#ffa733_20deg,transparent_120deg)]" />
      <Link
        href={companyProfilePageLink}
        target="_blank"
        className="profile-details"
      >
        <div
          className={` ${
            company.companyProfile ? "" : "blurred-profile"
          } profile`}
        >
          <img
            src={company?.companyProfile || "/assets/img/blur-profile.webp"}
            alt={
              company?.companyName
                ? `${company.companyName} logo`
                : "Company logo"
            }
            loading="lazy"
            className={"company-profile"}
            draggable={false}
          />
        </div>

        <div className="company-info">
          <p
            className={`${
              company.companyName ? "" : "blurred-text"
            } company-name`}
          >
            {company.companyName || "Company Disabled"}
          </p>
          <div className="verified-vendor">
            <MdVerifiedUser className="icon" />
            <span>Verified Vendor</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MobileProfileInfo;
