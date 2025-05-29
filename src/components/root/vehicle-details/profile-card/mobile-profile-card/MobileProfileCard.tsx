import "./MobileProfileCard.scss";
import {useState } from "react";
import ProfileSpecification from "@/components/root/vehicle-details/profile-specifications/ProfileSpecification";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import RentNowSection from "@/components/common/rent-now/RentNowSection";
import RentalDetailsTab from "../../profile-specifications/RentalDetailsTab";
import SecurityDepositInfo from "../../profile-specifications/SecurityDepositInfo";
import useProfileData from "@/hooks/useProfileCardData";
import LeaseInfo from "../../profile-specifications/LeaseInfo";
import ExpandableHeader from "./expandable-header/ExpandableHeader";
import MobileProfileInfo from "./mobile-profile-info/MobileProfileInfo";
import Overlay from "./overlay/Overlay";
import MobileProfileCardWrapper from "./MobileProfileCardWrapper";
import RentalPriceHeader from "../../profile-specifications/RentalPriceHeader";

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
};

const MobileProfileCard = ({ profileData, country }: MobileProfileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    formattedPhoneNumber,
    whatsappUrl,
    companyProfilePageLink,
    rentalDetails,
    isLease,
    securityDeposit,
    vehicleId,
    company,
  } = useProfileData(profileData, country);

  // Toggle function
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {/* Overlay */}
      <Overlay isVisible={isExpanded} setIsExpanded={setIsExpanded} />

      <MobileProfileCardWrapper
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      >
        {/* Expandable Header */}
        <ExpandableHeader
          isExpanded={isExpanded}
          onToggle={handleToggle}
          heading={
            <RentalPriceHeader 
              rentalDetails={rentalDetails}
              className="text-sm font-medium bg-[#ffa733] px-3 m-1  rounded-full"
            />
          }
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
                email={company.contactDetails?.email}
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
        <RentalDetailsTab rentalDetails={rentalDetails} country={country} />

        {/* Security Deposit */}
        <SecurityDepositInfo securityDeposit={securityDeposit} />

        {/* Lease Info */}
        <LeaseInfo isLease={isLease} />
      </MobileProfileCardWrapper>
    </>
  );
};

export default MobileProfileCard;
