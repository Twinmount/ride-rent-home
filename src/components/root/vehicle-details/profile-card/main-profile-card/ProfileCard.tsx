"use client";
import "./ProfileCard.scss";
import { memo } from "react";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import useProfileData from "@/hooks/useProfileCardData";
import RentalDetailsTab from "../../profile-specifications/RentalDetailsTab";
import VehicleStats from "../../profile-specifications/VehicleStats";
import CompanySpecifications from "../../profile-specifications/CompanySpecifications";
import RentNowbuttonWide from "@/components/common/RentNowbuttonWide";
import ShareLikeComponent from "../../profile-specifications/ShareLikeComponent";
import VehicleDescription from "../../profile-specifications/VehicleDescription";

type ProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
  vehicle: any;
};

const ProfileCard = memo(
  ({ profileData, country, vehicle }: ProfileCardProps) => {
    // console.log("profileData:[ProfileCard] ", profileData);
    // console.log("vehicle:[ProfileCard] ", vehicle);
    const { isCompanyValid, rentalDetails, securityDeposit } = useProfileData(
      profileData,
      country
    );

    const {
      company,
      seriesDescription,
      vehicleData: { state, model },
      vehicleId,
    } = profileData;

    // Enhanced availability check
    const isVehicleAvailable = () => {
      // Check if company is valid
      if (!isCompanyValid) return false;

      // Check if rental details exist and at least one rental period is enabled
      if (!rentalDetails) return false;

      const hasAvailableRentalPeriod = [
        rentalDetails.hour?.enabled,
        rentalDetails.day?.enabled,
        rentalDetails.week?.enabled,
        rentalDetails.month?.enabled,
      ].some((enabled) => enabled === true);

      if (!hasAvailableRentalPeriod) return false;

      // You can add more checks here based on your business logic:
      // - Check if vehicle is marked as available in your data
      // - Check if it's not currently rented
      // - Check maintenance status, etc.

      return true;
    };

    const vehicleAvailable = isVehicleAvailable();

    return (
      <MotionDiv className="profile-card h-auto">
        <div className="align-center flex justify-between">
          <div className="p-2 text-lg font-normal text-text-primary md:text-2xl">
            {model}
          </div>
          <ShareLikeComponent />
        </div>

        <VehicleStats state={state} />
        <VehicleDescription description={seriesDescription} />

        {/* Rental Details with conditional styling */}
        <div
          className={vehicleAvailable ? "" : "pointer-events-none opacity-60"}
        >
          <RentalDetailsTab
            rentalDetails={rentalDetails}
            securityDeposit={securityDeposit}
            isDisabled={!vehicleAvailable}
          />
        </div>

        <CompanySpecifications specs={company.companySpecs} />

        {/* Rent Now button or Unavailable message */}
        <div className="hidden py-2 lg:block">
          {vehicleAvailable ? (
            <RentNowbuttonWide
              vehicle={vehicle}
              state={state}
              country={country}
              vehicleName={model}
              vehicleId={vehicleId}
              agentId={profileData.agentId}
              contactDetails={company.contactDetails}
            />
          ) : (
            <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-medium text-red-600">
                This vehicle is currently unavailable.
              </p>
            </div>
          )}
        </div>
      </MotionDiv>
    );
  }
);

ProfileCard.displayName = "ProfileCard";
export default ProfileCard;
