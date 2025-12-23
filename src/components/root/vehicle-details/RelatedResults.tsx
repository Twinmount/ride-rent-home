"use client";

import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllLinkButton from "@/components/common/ViewAllLinkButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import SectionLoading from "@/components/skelton/section-loading/SectionLoading";

import { getSectionConfig } from "@/helpers/vehicle-details-section.helper";
import { useRelatedVehicles } from "@/hooks/useRelatedVehicles";
import { cn } from "@/lib/utils";

type RelatedResultsType = {
  state: string;
  category: string;
  vehicleCode: string;
  country: string;
  currentVehicle?: {
    brandValue: string;
    rentalDetails: any;
  };
};

export default function RelatedResults({
  state,
  category,
  vehicleCode,
  country,
  currentVehicle,
}: RelatedResultsType) {
  const { data, isLoading } = useRelatedVehicles({
    state,
    category,
    vehicleCode,
    country,
    currentVehicle,
  });

  if (isLoading) {
    return <SectionLoading />;
  }

  const vehicleData = data?.vehicleData || [];
  const selectedSection = data?.selectedSection || "";
  const sectionData = data?.sectionData || {};

  // Don't render if no vehicles found
  if (vehicleData.length === 0) {
    return null;
  }

  // Get section configuration with dynamic URL
  const sectionConfig = getSectionConfig(
    selectedSection,
    category,
    country,
    state,
    category,
    sectionData
  );

  return (
    <MotionSection className="section-container mx-auto">
      <div className="ml-3 flex items-center justify-between lg:mb-4 lg:ml-2 lg:mt-8">
        <div className={cn("mb-4 flex w-full flex-col gap-y-3 text-left")}>
          <h2 className="text-lg font-medium text-text-primary md:text-xl lg:text-2xl">
            {sectionConfig.title}
          </h2>
          <p className="heading-secondary hidden lg:block">
            {sectionConfig.description}
          </p>
        </div>
        <ViewAllLinkButton link={sectionConfig.url} />
      </div>
      <CarouselWrapper isButtonVisible={false} parentWrapperClass="w-full">
        {vehicleData.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.vehicleId}
            vehicle={vehicle}
            index={index}
            country={country}
            layoutType="carousel"
          />
        ))}
      </CarouselWrapper>
    </MotionSection>
  );
}
