"use client";

import "./ProfileCard.scss";
import { memo } from 'react';
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

const ProfileCard = memo(({ profileData, country }: ProfileCardProps) => {
  const { isCompanyValid, rentalDetails, securityDeposit } = useProfileData(
    profileData,
    country
  );

  const { company, seriesDescription, vehicleData } = profileData;
  const { state, model } = vehicleData;

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

      <VehicleStats state={state} />
      <VehicleDescription description={seriesDescription} />
      <RentalDetailsTab
        rentalDetails={rentalDetails}
        securityDeposit={securityDeposit}
      />
      <CompanySpecifications specs={company.companySpecs} />

      <div className="py-2">
        <RentNowbuttonWide
          contactDetails={company.contactDetails}
          vehicleName={model}
          state={state}
        />
      </div>
    </MotionDiv>
  );
});

ProfileCard.displayName = 'ProfileCard';
export default ProfileCard;

