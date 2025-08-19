"use client";

import "./ProfileCard.scss";

import ProfileSpecification from "@/components/root/vehicle-details/profile-specifications/ProfileSpecification";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import RentNowSection from "@/components/common/rent-now/RentNowSection";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import useProfileData from "@/hooks/useProfileCardData";
import TopContainer from "./top-container/TopContainer";
import RentalDetailsTab from "../../profile-specifications/RentalDetailsTab";
import LeaseInfo from "../../profile-specifications/LeaseInfo";
import SecurityDepositInfo from "../../profile-specifications/SecurityDepositInfo";
import VehicleStats from '../../profile-specifications/VehicleStats';
import VehicleDescription from '../../profile-specifications/VehicleDescription';
import CompanySpecifications from '../../profile-specifications/CompanySpecifications';
import RentNowButton from '@/components/common/RentNowButton/RentNowButton';
import RentNowbuttonWide from '@/components/common/RentNowbuttonWide';
import ShareLikeComponent from '../../profile-specifications/ShareLikeComponent';

type ProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
};

const ProfileCard = ({ profileData, country }: ProfileCardProps) => {
  const {
    formattedPhoneNumber,
    whatsappUrl,
    companyProfilePageLink,
    isCompanyValid,
    rentalDetails,
    isLease,
    securityDeposit,
    vehicleId,
  } = useProfileData(profileData, country);

  const {
    company,
    vehicleTitleH1,
    vehicleData: { state },
  } = profileData;

  return (
    <MotionDiv className="profile-card">
      <div className="align-center flex justify-between">
        <div className="p-2 text-xl font-medium md:text-2xl">
          {vehicleTitleH1}
        </div>
        <ShareLikeComponent />
      </div>

      {!isCompanyValid && (
        <p className="disabled-text">This vehicle is currently unavailable.</p>
      )}

      {/* top container */}
      <VehicleStats state={state} />

      {/* profile specifications */}
      <VehicleDescription />

      {/* rental details tab */}
      <RentalDetailsTab
        rentalDetails={rentalDetails}
        securityDeposit={securityDeposit}
      />

      {/* Security Deposit */}

      {/* Lease Info */}
      <CompanySpecifications specs={company.companySpecs} />

      {/* <div className="bottom">
        <RentNowSection
          vehicleId={vehicleId}
          whatsappUrl={whatsappUrl}
          email={company.contactDetails?.email}
          formattedPhoneNumber={formattedPhoneNumber}
          isPing={true}
        />
      </div> */}
      <div className="py-2">
        <RentNowbuttonWide />
      </div>
    </MotionDiv>
  );
};

export default ProfileCard;
