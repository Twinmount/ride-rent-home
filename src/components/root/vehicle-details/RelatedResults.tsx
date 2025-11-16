import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllLinkButton from "@/components/common/ViewAllLinkButton";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { convertToLabel } from "@/helpers";
import {
  fetchSectionData,
  getBestOfferParams,
  getSectionConfig,
} from "@/helpers/vehicle-details-section.helper";
import { cn } from "@/lib/utils";
import { FetchVehicleCardsResponseV2 } from "@/types/vehicle-types";
import { API } from "@/utils/API";

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

export default async function RelatedResults({
  state,
  category,
  vehicleCode,
  country,
  currentVehicle,
}: RelatedResultsType) {
  // Randomly select one section type to display
  const sections = ["BEST_OFFERS", "MORE_FROM_BRAND", "NEWLY_ARRIVED"];
  let selectedSection = sections[Math.floor(Math.random() * sections.length)];
  let vehicleData: any[] = [];
  let fallbackAttempted = false;
  let sectionData: any = {};

  // Try selected section, fallback to others if no results
  while (vehicleData.length === 0 && !fallbackAttempted) {
    try {
      const response = await fetchSectionData(
        selectedSection,
        state,
        category,
        vehicleCode,
        country,
        currentVehicle
      );

      const data: FetchVehicleCardsResponseV2 = await response.json();
      let tempVehicleData = data?.result?.list || [];

      // Filter out current vehicle
      tempVehicleData = tempVehicleData.filter(
        (vehicle) => vehicle.vehicleCode !== vehicleCode
      );

      if (tempVehicleData.length > 0) {
        vehicleData = tempVehicleData;

        // Store section-specific data for URL generation
        sectionData = getSectionDataForUrl(
          selectedSection,
          currentVehicle,
          vehicleData
        );
        break;
      } else {
        // Try next section type
        if (selectedSection === "BEST_OFFERS") {
          selectedSection = "MORE_FROM_BRAND";
        } else if (selectedSection === "MORE_FROM_BRAND") {
          selectedSection = "NEWLY_ARRIVED";
        } else {
          fallbackAttempted = true;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${selectedSection}:`, error);
      fallbackAttempted = true;
    }
  }

  // Final fallback to basic vehicle listing
  if (vehicleData.length === 0) {
    try {
      const response = await API({
        path: "/vehicle/filter",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: "1",
            limit: "6",
            sortOrder: "DESC",
            category: category,
            state: state,
          }),
          cache: "no-cache",
        },
        country: country,
      });

      const data: FetchVehicleCardsResponseV2 = await response.json();
      const filteredList =
        data?.result?.list?.filter(
          (vehicle) => vehicle.vehicleCode !== vehicleCode
        ) || [];

      if (filteredList.length > 0) {
        vehicleData = filteredList;
        selectedSection = "SIMILAR_FALLBACK";
        sectionData = {};
      }
    } catch (error) {
      console.error("Final fallback failed:", error);
    }
  }

  // Don't render if no vehicles found
  if (vehicleData.length === 0) {
    return null;
  }

  // Get section configuration with dynamic URL
  const sectionConfig = getSectionConfig(
    selectedSection,
    convertToLabel(category),
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

// Helper function to extract section data for URL generation
function getSectionDataForUrl(
  sectionType: string,
  currentVehicle: any,
  vehicleData: any[]
) {
  switch (sectionType) {
    case "BEST_OFFERS":
      // Extract rental type and price range from current vehicle
      const bestOfferParams = getBestOfferParams(currentVehicle?.rentalDetails);
      if (bestOfferParams) {
        return {
          rentalType: bestOfferParams.rentalType,
          minPrice: 0, // Start from 0
          maxPrice: bestOfferParams.maxPrice,
        };
      }
      return { rentalType: "day", minPrice: 0, maxPrice: 1000 };

    case "MORE_FROM_BRAND":
      return {
        brandValue: currentVehicle?.brandValue,
      };

    case "NEWLY_ARRIVED":
    default:
      return {};
  }
}
