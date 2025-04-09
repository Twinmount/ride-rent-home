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
import { generateVehicleMetadata, getVehicleJsonLd } from "./metadata";
import CurrentPageBreadcrumb from "@/components/root/vehicle-details/CurrentPageBreadcrumb";
import { restoreVehicleCodeFormat } from ".";
import { ENV } from "@/config/env";
import { Suspense } from "react";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import { VehicleInfo } from "@/components/root/vehicle-details/VehicleInfo";
import JsonLd from "@/components/common/JsonLd";

type ParamsProps = {
  params: Promise<{
    state: string;
    category: string;
    vehicleCode: string;
    modelDetails: string;
  }>;
};

// dynamic meta data generate
export async function generateMetadata(props: ParamsProps): Promise<Metadata> {
  const params = await props.params;

  const { state, category, vehicleCode, modelDetails } = params;

  return generateVehicleMetadata(state, category, vehicleCode, modelDetails);
}

export default async function VehicleDetails(props: ParamsProps) {
  const params = await props.params;

  const { state, category, vehicleCode, modelDetails } = params;

  const baseUrl = ENV.API_URL;

  const formattedVehicleCode = restoreVehicleCodeFormat(vehicleCode);

  const formattedModelDetails = modelDetails.replace(/-for-rent$/, "");
  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleCode=${formattedVehicleCode}&vehicleTitle=${formattedModelDetails}`,
    {
      method: "GET",
      cache: "no-cache",
    },
  );

  const data: VehicleDetailsPageResponse = await response.json();

  // if the vehicle data is not found, return 404 not found
  if (
    data?.status === "NOT_SUCCESS" ||
    response.status === 400 ||
    !data.result
  ) {
    return notFound();
  }

  // if the state in the url doesn't match the state in the data , return 404 not found
  if (state !== data.result.state.value) {
    return notFound();
  }

  const vehicle = data.result;

  // generating prop data for profile card and mobile profile card
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
    vehicleTitleH1: vehicle.vehicleTitle,
  };

  // Generate JSON-LD
  const jsonLdData = getVehicleJsonLd(vehicle, state, category, vehicleCode);

  return (
    <>
      {/* Inject JSON-LD into the <head> */}
      <JsonLd
        key={vehicleCode}
        jsonLdData={jsonLdData}
        id={`json-ld-vehicle-${vehicleCode}`}
      />

      <div className="vehicle-details-page wrapper">
        {/* Details heading */}
        <MotionDiv className="heading-box">
          <h1 className="custom-heading model-name">
            {vehicle.vehicleTitleH1 ||
              vehicle.vehicleTitle ||
              vehicle.modelName}
          </h1>

          {/* breadcrumb for current page path*/}
          <CurrentPageBreadcrumb
            category={category}
            state={state}
            brand={vehicle?.brand}
            vehicleTitle={vehicle?.vehicleTitleH1 || vehicle?.vehicleTitle}
          />
        </MotionDiv>

        {/* Wrapper to handle client side logic regarding mobile profile card */}
        <DetailsSectionClientWrapper profileData={ProfileCardData}>
          {/* Vehicle Details Section */}
          <section className="vehicle-details-section">
            {/* container left */}
            <div className="details-left">
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
            <div className="details-right">
              {/* Right Side Profile Card */}
              <ProfileCard profileData={ProfileCardData} />

              {/* Right Side Quick Links */}
              <RelatedLinks state={state} />
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
      </div>
    </>
  );
}
