import "./VehicleDetailsPage.scss";

import ProfileCard from "@/components/card/owner-profile-card/ProfileCard";
import WhyOpt from "@/components/common/why-opt/WhyOpt";
import Description from "@/components/root/vehicle details/description/Description";
import Specification from "@/components/root/vehicle details/specifications/Specification";
import { IoLocationOutline } from "react-icons/io5";
import DetailsSectionClient from "@/components/root/vehicle details/DetailsSectionClient";
import Images from "@/components/root/vehicle details/vehicle-images/Images";
import VehicleFeatures from "@/components/root/vehicle details/features/Features";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { Suspense } from "react";
import SectionLoading from "@/components/general/section-loading/SectionLoading";
import Locations from "@/components/common/locations/Locations";
import RelatedResults from "@/components/root/vehicle details/related-results/RelatedResults";
import { VehicleDetailsResponse } from "@/types/vehicle-details-types";
import QuickLinks from "@/components/root/vehicle details/quick-links/QuickLinks";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { formatVehicleSpecification } from "@/helpers";
import DynamicFAQ from "@/components/common/FAQ/DynamicFAQ";
import CityListSubheading from "@/components/root/vehicle details/CityListSubheading";
import {
  fetchVehicleData,
  generateVehicleMetadata,
} from "./vehicle-details-metadata";
import RentalInfo from "@/components/root/vehicle details/RentalInfo";
import NoDeposit from "@/components/root/vehicle details/NoDeposit";
import AddOnServices from "@/components/root/vehicle details/AddOnServices";

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
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/vehicle/details?vehicleId=${vehicleId}`,
    {
      method: "GET",
      cache: "no-cache",
    }
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

  //profile card prop
  const vehicleData = {
    brandName: vehicle.brand.value,
    model: vehicle.modelName,
    state: state,
    category: category,
  };

  return (
    <section className="vehicle-details-section wrapper">
      {/* Details heading */}
      <MotionDiv className="heading-box">
        <h1 className="custom-heading model-name">{vehicle?.modelName}</h1>
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

        {/* state and first 5 cities */}
        <div className="location-container">
          <span className="location">
            <IoLocationOutline
              size={20}
              className="text-yellow relative bottom-[2px]"
              strokeWidth={3}
              fill="yellow"
            />
          </span>
          <span className="state">{vehicle?.state.label} : </span>
          <CityListSubheading cities={vehicle?.cities || []} />
        </div>
      </MotionDiv>

      {/* Vehicle Details */}
      <DetailsSectionClient
        company={vehicle?.company}
        rentalDetails={vehicle?.rentalDetails}
        vehicleId={vehicleId}
        isLease={vehicle.isAvailableForLease}
        vehicleData={vehicleData}
        securityDeposit={vehicle.securityDeposit}
      >
        <section className="details-section">
          <div className="details-container">
            {/* container left */}
            <div className="details">
              {/* Images */}
              <Images photos={vehicle?.vehiclePhotos} />

              {/* Specification */}
              <Specification
                specifications={vehicle?.specs}
                vehicleCategory={category}
              />

              {/* Features */}
              <VehicleFeatures
                features={vehicle?.features}
                vehicleCategory={category}
              />
            </div>

            {/* container right */}
            <div className="right">
              {/* Profile */}
              <ProfileCard
                company={vehicle?.company}
                rentalDetails={vehicle?.rentalDetails}
                vehicleId={vehicleId}
                isLease={vehicle.isAvailableForLease}
                vehicleData={vehicleData}
                securityDeposit={vehicle.securityDeposit}
              />

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
