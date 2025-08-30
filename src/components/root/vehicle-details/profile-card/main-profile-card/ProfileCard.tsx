"use client";

import "./ProfileCard.scss";

import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import { ProfileCardDataType } from '@/types/vehicle-details-types';
import useProfileData from '@/hooks/useProfileCardData';
import RentalDetailsTab from '../../profile-specifications/RentalDetailsTab';
import VehicleStats from '../../profile-specifications/VehicleStats';
import CompanySpecifications from '../../profile-specifications/CompanySpecifications';
import RentNowbuttonWide from '@/components/common/RentNowbuttonWide';
import ShareLikeComponent from '../../profile-specifications/ShareLikeComponent';
import VehicleDescription from '../../profile-specifications/VehicleDescription';

type ProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
};

const ProfileCard = ({ profileData, country }: ProfileCardProps) => {
  const { isCompanyValid, rentalDetails, securityDeposit } = useProfileData(
    profileData,
    country
  );

  const {
    company,
    seriesDescription,
    vehicleId,
    vehicleData: { state, model },
  } = profileData;

  return (
    <MotionDiv className="profile-card h-auto">
      <div className="align-center flex justify-between">
        <div className="p-2 text-lg font-normal text-text-primary md:text-2xl">
          {model}
        </div>
        <ShareLikeComponent />
      </div>

      {!isCompanyValid && (
        <p className="disabled-text">This vehicle is currently unavailable.</p>
      )}

      {/* top container */}
      <VehicleStats state={state} />

      {/* vehicle specifications */}
      <VehicleDescription description={seriesDescription} />

      {/* rental details tab */}
      <RentalDetailsTab
        rentalDetails={rentalDetails}
        securityDeposit={securityDeposit}
      />

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
        <RentNowbuttonWide
          contactDetails={company.contactDetails}
          vehicleName={model}
          state={state}
        />
      </div>
    </MotionDiv>
  );
};

export default ProfileCard;
