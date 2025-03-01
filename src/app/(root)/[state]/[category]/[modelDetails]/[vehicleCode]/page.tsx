import "./VehicleDetailsPage.scss";

import ProfileCard from "@/components/root/vehicle-details/profile-card/main-profile-card/ProfileCard";
import WhyOpt from "@/components/common/why-opt/WhyOpt";
import Description from "@/components/root/vehicle-details/description/Description";
import Specification from "@/components/root/vehicle-details/Specification";
import DetailsSectionClientWrapper from "@/components/root/vehicle-details/DetailsSectionClientWrapper";
import Images from "@/components/root/vehicle-details/Images";
import VehicleFeatures from "@/components/root/vehicle-details/features/Features";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import RelatedResults from "@/components/root/vehicle-details/RelatedResults";
import {
  ProfileCardDataType,
  VehicleDetailsPageResponse,
} from "@/types/vehicle-details-types";
import RelatedLinks from "@/components/root/vehicle-details/RelatedLinks";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import DynamicFAQ from "@/components/common/FAQ/DynamicFAQ";
import { fetchVehicleMetaData, generateVehicleMetadata } from "./metadata";
import CurrentPageBreadcrumb from "@/components/root/vehicle-details/CurrentPageBreadcrumb";
import { restoreVehicleCodeFormat } from ".";
import { ENV } from "@/config/env";
import { Suspense } from "react";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import { VehicleInfo } from "@/components/root/vehicle-details/VehicleInfo";

type ParamsProps = {
  params: { state: string; category: string; vehicleCode: string };
};

// dynamic meta data generate
export async function generateMetadata({
  params: { state, category, vehicleCode },
}: ParamsProps): Promise<Metadata> {
  return generateVehicleMetadata(state, category, vehicleCode);
}

export default async function VehicleDetails({
  params: { state, category, vehicleCode },
}: ParamsProps) {
  const baseUrl = ENV.API_URL;

  const formattedVehicleCode = restoreVehicleCodeFormat(vehicleCode);

  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleCode=${formattedVehicleCode}`,
    {
      method: "GET",
      cache: "no-cache",
    },
  );

  const data: VehicleDetailsPageResponse = await response.json();

  if (
    data?.status === "NOT_SUCCESS" ||
    response.status === 400 ||
    !data.result
  ) {
    return notFound();
  }

  const vehicle = data.result;

  // prop data for profile card and mobile profile card
  const ProfileCardData: ProfileCardDataType = {
    company: vehicle?.company,
    rentalDetails: vehicle?.rentalDetails,
    vehicleId: vehicle.vehicleId,
    vehicleCode: vehicle.vehicleCode,
    isLease: vehicle.isAvailableForLease,
    vehicleData: {
      brandName: vehicle.brand.value,
      model: vehicle.modelName,
      state: state,
      category: category,
    },
    securityDeposit: vehicle.securityDeposit,
    vehicleTitle: vehicle.vehicleTitle,
  };

  return (
    <section className="vehicle-details-section wrapper">
      {/* Details heading */}
      <MotionDiv className="heading-box">
        <h1 className="custom-heading model-name">
          {vehicle.vehicleTitle || vehicle.modelName}
        </h1>

        {/* breadcrumb for current page path*/}
        <CurrentPageBreadcrumb
          category={category}
          state={state}
          brand={vehicle?.brand}
          vehicleTitle={vehicle?.vehicleTitle}
        />
      </MotionDiv>

      {/* Wrapper to handle client side logic regarding mobile profile card */}
      <DetailsSectionClientWrapper profileData={ProfileCardData}>
        {/* Vehicle Details Section */}
        <section className="details-section">
          <div className="details-container">
            {/* container left */}
            <div className="details">
              {/* Vehicle Images Slider */}
              <Images photos={vehicle?.vehiclePhotos} />

              {/* vehicle information */}
              <VehicleInfo
                modelName={vehicle?.modelName}
                stateLabel={vehicle?.state.label}
                isCryptoAccepted={
                  vehicle?.company.companySpecs.isCryptoAccepted
                }
                rentalDetails={vehicle?.rentalDetails}
                securityDepositEnabled={vehicle?.securityDeposit.enabled}
                vehicleSpecification={vehicle?.vehicleSpecification}
                additionalVehicleTypes={vehicle?.additionalVehicleTypes}
                cities={vehicle?.cities}
              />

              {/* Vehicle Specifications */}
              <Specification
                specifications={vehicle?.specs}
                vehicleCategory={category}
              />

              {/* Vehicle Features */}
              <VehicleFeatures
                features={vehicle?.features}
                vehicleCategory={category}
              />
            </div>

            {/* container right side */}
            <div className="right">
              {/* Right Side Profile Card */}
              <ProfileCard profileData={ProfileCardData} />

              {/* Right Side Quick Links */}
              <RelatedLinks state={state} />
            </div>
          </div>
        </section>
      </DetailsSectionClientWrapper>

      {/* related result */}
      <Suspense fallback={<SectionLoading />}>
        <RelatedResults
          state={state}
          category={category}
          vehicleCode={vehicleCode}
        />
      </Suspense>

      {/* Description */}
      <Description description={vehicle.description} />

      {/* FAQ */}
      <DynamicFAQ vehicle={vehicle} />

      {/* Why Opt Ride.Rent  */}
      <WhyOpt state={state} category={category} />
    </section>
  );
}
