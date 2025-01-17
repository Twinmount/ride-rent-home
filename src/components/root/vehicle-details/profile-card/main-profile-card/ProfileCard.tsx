"use client";

import "./ProfileCard.scss";

import ProfileSpecification from "@/components/root/vehicle-details/profile-specifications/ProfileSpecification";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import RentNowSection from "@/components/common/rent-now/RentNowSection";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import useProfileData from "@/hooks/useProfileCardData";
import TopContainer from "./TopContainer";
import RentalDetailsTab from "../../profile-specifications/RentalDetailsTab";
import LeaseInfo from "../../profile-specifications/LeaseInfo";
import SecurityDepositInfo from "../../profile-specifications/SecurityDepositInfo";

type ProfileCardProps = {
  profileData: ProfileCardDataType;
};

const ProfileCard = ({ profileData }: ProfileCardProps) => {
  const {
    formattedPhoneNumber,
    whatsappUrl,
    companyProfilePageLink,
    isCompanyValid,
    rentalDetails,
    isLease,
    securityDeposit,
    vehicleId,
  } = useProfileData(profileData);

  return (
    <MotionDiv className="profile-card">
      <div className="profile-heading">
        <h2 className="custom-heading">Listing Owner Details</h2>
      </div>

      {!isCompanyValid && (
        <p className="disabled-text">This vehicle is currently unavailable.</p>
      )}

      {/* top container */}
      <TopContainer
        company={profileData.company}
        companyProfilePageLink={companyProfilePageLink}
      />

      {/* profile specifications */}
      <ProfileSpecification
        specs={profileData.company.companySpecs}
        rentalDetails={rentalDetails}
      />

      {/* rental details tab */}
      <RentalDetailsTab rentalDetails={rentalDetails} />

      {/* Security Deposit */}
      <SecurityDepositInfo securityDeposit={securityDeposit} />

      {/* Lease Info */}
      <LeaseInfo isLease={isLease} />

      <div className="bottom">
        <RentNowSection
          vehicleId={vehicleId}
          whatsappUrl={whatsappUrl}
          email={profileData.company.contactDetails?.email}
          formattedPhoneNumber={formattedPhoneNumber}
          isPing={true}
        />
      </div>
    </MotionDiv>
  );
};

export default ProfileCard;
