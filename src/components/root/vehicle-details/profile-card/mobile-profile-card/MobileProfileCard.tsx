import "./MobileProfileCard.scss";

import { useEffect, useRef, useState } from "react";
import ProfileSpecification from "@/components/root/vehicle-details/profile-specifications/ProfileSpecification";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import RentNowSection from "@/components/common/rent-now/RentNowSection";
import RentalDetailsTab from "../../profile-specifications/RentalDetailsTab";
import SecurityDepositInfo from "../../profile-specifications/SecurityDepositInfo";
import useProfileData from "@/hooks/useProfileCardData";
import LeaseInfo from "../../profile-specifications/LeaseInfo";
import ExpandableHeader from "./ExpandableHeader";
import MobileProfileInfo from "./MobileProfileInfo";
import Overlay from "./Overlay";

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
};

const MobileProfileCard = ({ profileData }: MobileProfileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState("9rem"); //
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    formattedPhoneNumber,
    whatsappUrl,
    companyProfilePageLink,
    rentalDetails,
    isLease,
    securityDeposit,
    vehicleId,
  } = useProfileData(profileData);

  const { company } = profileData;

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

  return (
    <>
      {/* Overlay */}
      <Overlay isVisible={isExpanded} />

      <div
        ref={contentRef}
        onMouseLeave={handleMouseLeave}
        className={`mobile-profile-card ${isExpanded ? "expanded-view" : ""}`}
        style={{ height: height }}
      >
        {/* Expandable Header */}
        <ExpandableHeader
          isExpanded={isExpanded}
          onToggle={handleToggle}
          heading="Owner Details"
          isUnavailable={!company.companyName || !company.companyProfile}
        />

        {/* profile */}
        <div className="top">
          {/* left */}
          <MobileProfileInfo
            companyProfilePageLink={companyProfilePageLink}
            company={company}
          />

          {/* right -  rent now button */}
          <div className="profile-right">
            <div className="contact-container">
              <RentNowSection
                vehicleId={vehicleId}
                whatsappUrl={whatsappUrl}
                email={profileData.company.contactDetails?.email}
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
        />

        {/* rental details tab */}
        <RentalDetailsTab rentalDetails={rentalDetails} />

        {/* Security Deposit */}
        <SecurityDepositInfo securityDeposit={securityDeposit} />

        {/* Lease Info */}
        <LeaseInfo isLease={isLease} />
      </div>
    </>
  );
};

export default MobileProfileCard;
