import "./VehicleDetailsPage.scss";

import ProfileCard from "@/components/card/owner-profile-card/ProfileCard";
import WhyOpt from "@/components/common/why-opt/WhyOpt";
import Description from "@/components/root/vehicle details/description/Description";
import Specification from "@/components/root/vehicle details/specifications/Specification";
import DetailsSectionClient from "@/components/root/vehicle details/DetailsSectionClient";
import Images from "@/components/root/vehicle details/vehicle-images/Images";
import VehicleFeatures from "@/components/root/vehicle details/features/Features";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { Suspense } from "react";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";
import Locations from "@/components/common/locations/Locations";
import RelatedResults from "@/components/root/vehicle details/related-results/RelatedResults";
import {
  ProfileCardDataType,
  VehicleDetailsResponse,
} from "@/types/vehicle-details-types";
import QuickLinks from "@/components/root/vehicle details/quick-links/QuickLinks";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { formatVehicleSpecification } from "@/helpers";
import DynamicFAQ from "@/components/common/FAQ/DynamicFAQ";
import { fetchVehicleData, generateVehicleMetadata } from "./metadata";
import RentalInfo from "@/components/root/vehicle details/RentalInfo";
import NoDeposit from "@/components/root/vehicle details/NoDeposit";
import AddOnServices from "@/components/root/vehicle details/add-on-services/AddOnServices";
import Location from "@/components/root/vehicle details/locations/Location";
import CurrentPageBreadcrumb from "@/components/root/vehicle details/CurrentPageBreadcrumb";

type ParamsProps = {
  params: { state: string; category: string; vehicleId: string };
};

// dynamic meta data generate
export async function generateMetadata({
  params: { state, category, vehicleId },
}: ParamsProps): Promise<Metadata> {
  const data = await fetchVehicleData(vehicleId);

  if (!data || data.status === "NOT_SUCCESS" || !data.result) {
    return notFound();
  }

  return generateVehicleMetadata(data, state, category, vehicleId);
}

export default async function VehicleDetails({
  params: { state, category, vehicleId },
}: ParamsProps) {
  const baseUrl = process.env.API_URL;

  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleId=${vehicleId}`,
    {
      method: "GET",
      cache: "no-cache",
    },
  );

  const data: VehicleDetailsResponse = await response.json();

  if (
    data?.status === "NOT_SUCCESS" ||
    response.status === 400 ||
    !data.result
  ) {
    return notFound();
  }

  const vehicle = data.result;

  // data for profile card and mobile profile card
  const ProfileCardData: ProfileCardDataType = {
    company: vehicle?.company,
    rentalDetails: vehicle?.rentalDetails,
    vehicleId: vehicleId,
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
          {vehicle?.vehicleTitle || vehicle.modelName}
        </h1>
        {/* sub heading */}
        <RentalInfo
          modelName={vehicle?.modelName}
          stateLabel={vehicle?.state.label}
          isCryptoAccepted={vehicle?.company.companySpecs.isCryptoAccepted}
          rentalDetails={vehicle?.rentalDetails}
        />

        <div className="important-features">
          <div className="spec-deposit-container">
            {/* no deposit box */}
            {!vehicle.securityDeposit.enabled && <NoDeposit />}

            <div className="specification-info">
              Specification:{" "}
              {formatVehicleSpecification(vehicle.vehicleSpecification)}
            </div>

            {/* add-on services */}
            <AddOnServices
              additionalVehicleTypes={vehicle.additionalVehicleTypes}
            />
          </div>
        </div>

        {/* state and cities */}
        <Location
          stateLabel={vehicle?.state.label}
          cities={vehicle?.cities || []}
        />
      </MotionDiv>

      {/* breadcrumb for current page path*/}
      <CurrentPageBreadcrumb
        category={category}
        state={state}
        vehicleTitle={vehicle?.vehicleTitle || vehicle.modelName}
      />

      {/* Wrapper to handle client side logic regarding mobile profile card */}
      <DetailsSectionClient profileData={ProfileCardData}>
        {/* Vehicle Details Section */}
        <section className="details-section">
          <div className="details-container">
            {/* container left */}
            <div className="details">
              {/* Vehicle Images Slider */}
              <Images photos={vehicle?.vehiclePhotos} />

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
              <QuickLinks state={state} />
            </div>
          </div>
        </section>
      </DetailsSectionClient>

      {/* related result */}
      <RelatedResults state={state} category={category} vehicleId={vehicleId} />

      {/* Description */}
      <Description description={vehicle.description} />

      {/* FAQ */}
      <DynamicFAQ vehicle={vehicle} />

      {/* Why Opt Ride.Rent and Available Locations */}
      <WhyOpt state={state} category={category} />

      {/* available locations */}
      <Suspense fallback={<SectionLoading />}>
        <Locations state={state} category={category} />
      </Suspense>
    </section>
  );
}
