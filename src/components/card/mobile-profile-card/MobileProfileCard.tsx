import "./MobileProfileCard.scss";
import { MdOutlineExpandCircleDown, MdVerifiedUser } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import ProfileSpecification from "@/components/root/vehicle details/profile-specifications/ProfileSpecification";
import { ProfileCardDataType } from "@/types/vehicle-details-types";

import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
  generateWhatsappUrl,
  getFormattedPhoneNumber,
} from "@/helpers";
import RentNowSection from "@/components/common/rent-now/RentNowSection";
import Link from "next/link";

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
};

const MobileProfileCard = ({ profileData }: MobileProfileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState("9rem"); //
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    company,
    rentalDetails,
    vehicleId,
    vehicleCode,
    isLease,
    vehicleData,
    securityDeposit,
    vehicleTitle,
  } = profileData;

  const contactDetails = company?.contactDetails;
  const { state, model, category } = vehicleData;

  // Toggle function
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // Mouse leave toggle function
  const handleMouseLeave = () => {
    if (!isExpanded) return;
    setIsExpanded(false);
  };

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      if (isExpanded) {
        const expandedHeight = content.scrollHeight; // Get the full height when expanded
        setHeight(`${expandedHeight}px`); // Set the height explicitly
      } else {
        setHeight("9rem"); // Set the height back to the initial height
      }
    }
  }, [isExpanded]);

  // Handle case where contactDetails is null

  const formattedPhoneNumber = getFormattedPhoneNumber(
    contactDetails?.countryCode,
    contactDetails?.phone,
  );

  // link for the vehicle details page
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicleTitle,
    state: state,
    vehicleCategory: category,
    vehicleCode: vehicleCode,
  });

  // whatsapp url
  const whatsappUrl = generateWhatsappUrl({
    whatsappPhone: contactDetails?.whatsappPhone,
    whatsappCountryCode: contactDetails?.whatsappCountryCode,
    model: model,
    vehicleDetailsPageLink,
  });

  // company profile page link
  const companyProfilePageLink = generateCompanyProfilePageLink(
    company.companyName,
    company.companyId,
  );

  return (
    <>
      {/* Overlay */}
      <div className={`black-overlay ${isExpanded ? "visible" : "hidden"}`} />

      <div
        ref={contentRef}
        onMouseLeave={handleMouseLeave}
        className={`mobile-profile-card ${isExpanded ? "expanded-view" : ""}`}
        style={{ height: height }}
      >
        <div className="profile-heading top-heading">
          <h2 className="custom-heading mobile-profile-heading">
            Owner Details
            {(!company.companyName || !company.companyProfile) && (
              <span className="disabled-text">
                &#40;Currently unavailable&#41;
              </span>
            )}
          </h2>
          <button className="expand" onClick={handleToggle}>
            {isExpanded ? "show less" : "show more"}{" "}
            <MdOutlineExpandCircleDown className="icon" />
          </button>
        </div>
        {/* profile */}
        <div className="top">
          {/* left */}

          <div className="border-wrapper">
            {/* animated border */}
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
                {/* Placeholder image or replace with actual company logo if available */}
                <img
                  src={
                    company.companyProfile || "/assets/img/blur-profile.webp"
                  }
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
                {/* Assuming verification logic based on specs */}

                <div className="verified-vendor">
                  <MdVerifiedUser className="icon" />
                  <span>Verified Vendor</span>
                </div>
              </div>
            </Link>
          </div>

          {/* rent now button */}
          <div className="profile-right">
            <div className="contact-container">
              <RentNowSection
                vehicleId={vehicleId}
                whatsappUrl={whatsappUrl}
                email={contactDetails?.email}
                formattedPhoneNumber={formattedPhoneNumber}
                isPing={true}
                isMobileProfileCard={true}
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <ProfileSpecification
          specs={company.companySpecs}
          rentalDetails={rentalDetails}
          isLease={isLease}
          securityDeposit={securityDeposit}
        />
      </div>
    </>
  );
};

export default MobileProfileCard;
