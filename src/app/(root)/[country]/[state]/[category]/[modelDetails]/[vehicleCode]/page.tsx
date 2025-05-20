import "./VehicleDetailsPage.scss";
import ProfileCard from "@/components/root/vehicle-details/profile-card/main-profile-card/ProfileCard";
import WhyOpt from "@/components/common/why-opt/WhyOpt";
import Description from "@/components/root/vehicle-details/description/Description";
import Specification from "@/components/root/vehicle-details/Specification";
import DetailsSectionClientWrapper from "@/components/root/vehicle-details/DetailsSectionClientWrapper";
// import Images from "@/components/root/vehicle-details/Images";
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
import BrandImage from "@/components/common/BrandImage";
import ImagesGrid from "@/components/root/vehicle-details/ImagesGrid";
import LocationMap from "@/components/root/vehicle-details/LocationMap";

type ParamsProps = {
  params: Promise<{
    state: string;
    category: string;
    vehicleCode: string;
    modelDetails: string;
    country: string;
  }>;
};

// dynamic meta data generate
export async function generateMetadata(props: ParamsProps): Promise<Metadata> {
  const params = await props.params;

  const { state, category, vehicleCode, modelDetails, country } = params;

  return generateVehicleMetadata(
    state,
    category,
    vehicleCode,
    modelDetails,
    country,
  );
}

export default async function VehicleDetails(props: ParamsProps) {
  const params = await props.params;

  const { country, state, category, vehicleCode, modelDetails } = params;

  const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;

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
  const jsonLdData = getVehicleJsonLd(
    vehicle,
    state,
    category,
    vehicleCode,
    country,
  );

  type MediaItem = {
    source: string;
    type: "video" | "image";
  };

  const mediaSourceList: MediaItem[] = [];

  if (vehicle?.vehicleVideos?.length) {
    // Add video as the first item
    mediaSourceList.push({
      source: vehicle.vehicleVideos[0],
      type: "video",
    });
  }

  // Add up to 5 - (video count already added) images
  const remainingSlots = 5 - mediaSourceList.length;
  const images = vehicle?.vehiclePhotos ?? [];

  for (let i = 0; i < remainingSlots && i < images.length; i++) {
    mediaSourceList.push({
      source: images[i],
      type: "image",
    });
  }

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
          <div className="flex items-center gap-2">
            {/* brand logo */}
            <BrandImage
              category={category}
              brandValue={vehicle?.brand.value}
              className="h-12 w-12 rounded-full border-2 border-amber-500 object-contain"
            />
            <h1 className="custom-heading model-name">
              {vehicle.vehicleTitleH1 ||
                vehicle.vehicleTitle ||
                vehicle.modelName}
            </h1>
          </div>

          {/* breadcrumb for current page path*/}
          <CurrentPageBreadcrumb
            category={category}
            state={state}
            country={country}
            brand={vehicle?.brand}
            vehicleTitle={vehicle?.vehicleTitleH1 || vehicle?.vehicleTitle}
          />
        </MotionDiv>

        {/* Wrapper to handle client side logic regarding mobile profile card */}
        <DetailsSectionClientWrapper
          profileData={ProfileCardData}
          country={country}
        >
          {/* Vehicle Images Slider */}
          <div>
            {/* <Images
              photos={vehicle?.vehiclePhotos}
              imageAlt={vehicle?.modelName}
            /> */}

            <ImagesGrid
              mediaItems={mediaSourceList}
              imageAlt={vehicle?.modelName}
            />
          </div>

          {/* Vehicle Details Section */}
          <section className="vehicle-details-section">
            {/* container left */}
            <div className="details-left !w-full !max-w-full">
              {/* vehicle information */}
              <VehicleInfo
                vehicleId={vehicle?.vehicleId}
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
              <div className="mt-4">
                {/* Right Side Profile Card */}
                <ProfileCard profileData={ProfileCardData} country={country} />
                {/* Right Side Quick Links */}
                <RelatedLinks state={state} country={country} />

                {/* Location map */}
                {vehicle?.location && (
                  <LocationMap location={vehicle?.location} />
                )}
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
            country={country}
          />
        </Suspense>

        {/* Description */}
        <Description description={vehicle.description} />

        {/* FAQ */}
        <Suspense fallback={<SectionLoading />}>
          <DynamicFAQ vehicle={vehicle} country={country} />
        </Suspense>

        {/* Why Opt Ride.Rent  */}
        <WhyOpt state={state} category={category} country={country} />
      </div>
    </>
  );
}