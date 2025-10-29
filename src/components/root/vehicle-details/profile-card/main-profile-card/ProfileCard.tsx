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
import Link from "next/link";

type ProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
  vehicle: any;
};

const ProfileCard = memo(
  ({ profileData, country, vehicle }: ProfileCardProps) => {
    const { isCompanyValid, rentalDetails, securityDeposit } = useProfileData(
      profileData,
      country
    );

    const {
      company,
      seriesDescription,
      vehicleData: { state, model, category, brandName },
      vehicleId,
    } = profileData;

    // Enhanced availability check
    const isVehicleAvailable = () => {
      if (!isCompanyValid) return false;
      if (!rentalDetails) return false;

      const hasAvailableRentalPeriod = [
        rentalDetails.hour?.enabled,
        rentalDetails.day?.enabled,
        rentalDetails.week?.enabled,
        rentalDetails.month?.enabled,
      ].some((enabled) => enabled === true);

      if (!hasAvailableRentalPeriod) return false;

      return true;
    };

    const vehicleAvailable = isVehicleAvailable();

    // Check if listing policy link should be shown
    const shouldShowListingPolicy = () => {
      return country === "in" && (category === "cars" || category === "bike");
    };

    const showListingPolicy = shouldShowListingPolicy();

    // Extract vehicle series from vehicle object
    const vehicleSeries = vehicle?.vehicleSeries?.vehicleSeries || "";

    return (
      <MotionDiv className="profile-card h-auto">
        <div className="align-center flex justify-between">
          <div className="p-2 text-lg font-normal text-text-primary md:text-2xl">
            {model}
          </div>
          <ShareLikeComponent vehicleId={vehicleId} />
        </div>

        <VehicleStats state={state} />
        <VehicleDescription description={seriesDescription} />

        {/* Rental Details - now handles both available and unavailable states */}
        <RentalDetailsTab
          rentalDetails={rentalDetails}
          securityDeposit={securityDeposit}
          isDisabled={!vehicleAvailable}
          brandValue={brandName}
          category={category}
          country={country}
          state={state}
          formattedCategory={category}
          vehicleSeries={vehicleSeries} // Fixed: use vehicle.vehicleSeries.vehicleSeries
          vehicleId={vehicleId}
        />

        <CompanySpecifications specs={company.companySpecs} />

        {/* Rent Now button or Unavailable message - Desktop only */}
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

        {/* Vehicle Listing Policy Link - shown on both mobile and desktop */}
        {showListingPolicy && (
          <div className="mt-2 flex justify-end px-2 pt-2">
            <Link
              href={`/${country}/vehicle-listing-policy`}
              className="text-[.6rem] font-medium text-gray-500 hover:text-gray-700"
            >
              Vehicle Listing Policy*
            </Link>
          </div>
        )}
      </MotionDiv>
    );
  }
);

ProfileCard.displayName = "ProfileCard";
export default ProfileCard;
