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
import PriceOfferDetails from "../PriceOfferDetails";
import { cn } from "@/lib/utils";

type ProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
  vehicle: any;
};

const ProfileCard = memo(
  ({ profileData, country, vehicle }: ProfileCardProps) => {
    const {
      isCompanyValid,
      rentalDetails,
      securityDeposit,
      additionalVehicleTypes,
    } = useProfileData(profileData, country);

    const {
      company,
      seriesDescription,
      vehicleData: { state, model, category, brandName },
      vehicleId,
      priceOffer,
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

    // Extract vehicle series and isVehicleModified from vehicle object
    const vehicleSeries = vehicle?.vehicleSeries?.vehicleSeries || "";
    const isVehicleModified = vehicle?.isVehicleModified || false;

    return (
      <MotionDiv className="profile-card h-auto">
        <div className="align-center flex justify-between">
          <div className="text-lg font-normal text-text-primary md:text-xl lg:text-[1.3rem]">
            {model}
          </div>
          <ShareLikeComponent vehicleId={vehicleId} />
        </div>

        <VehicleStats state={state} />
        <VehicleDescription description={seriesDescription} />

        {/* Rental Details - now handles both available and unavailable states */}
        <RentalDetailsTab
          rentalDetails={rentalDetails}
          additionalVehicleTypes={additionalVehicleTypes}
          securityDeposit={securityDeposit}
          isDisabled={!vehicleAvailable}
          brandValue={brandName}
          category={category}
          country={country}
          state={state}
          formattedCategory={category}
          vehicleSeries={vehicleSeries}
          vehicleId={vehicleId}
        />

        <CompanySpecifications specs={company.companySpecs} />

        <PriceOfferDetails priceOffer={priceOffer} isMobile={true} />

        {/* Rent Now button or Unavailable message - Desktop only */}
        <div className="mt-2 hidden py-2 lg:block">
          {vehicleAvailable ? (
            <div className="flex-center gap-4">
              <PriceOfferDetails priceOffer={priceOffer} isMobile={false} />

              <RentNowbuttonWide
                vehicle={vehicle}
                state={state}
                country={country}
                vehicleName={model}
                vehicleId={vehicleId}
                agentId={profileData.agentId}
                contactDetails={company.contactDetails}
                className={cn("!my-auto", priceOffer ? "!w-[30%]" : "w-full")}
              />
            </div>
          ) : (
            <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-medium text-red-600">
                This vehicle is currently unavailable.
              </p>
            </div>
          )}
        </div>

        {/* Vehicle Modification and Listing Policy Section */}
        <div className="flex items-center justify-between px-2 text-[.7rem]">
          {/* Left side - Vehicle Modified Badge */}
          {isVehicleModified && (
            <div className="mt-2 flex items-center gap-1.5 rounded-md border border-amber-500 bg-amber-50 px-2 py-1 text-orange lg:mt-0">
              <span className="text-sm">🔧</span>
              <span className="text-xs font-semibold">Modified Vehicle</span>
            </div>
          )}

          {/* Right side - Vehicle Listing Policy Link */}
          {showListingPolicy && (
            <Link
              href={`/${country}/vehicle-listing-policy`}
              target="_blank"
              className="ml-auto font-medium text-gray-500 hover:text-gray-700"
            >
              Vehicle Listing Policy*
            </Link>
          )}
        </div>
      </MotionDiv>
    );
  }
);

ProfileCard.displayName = "ProfileCard";
export default ProfileCard;

