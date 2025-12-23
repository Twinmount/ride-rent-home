import { useQuery } from "@tanstack/react-query";
import {
  fetchSimilarVehiclesData,
  fetchBasicVehicleListing,
} from "@/lib/api/general-api";
import { getSectionDataForUrl } from "@/helpers/vehicle-details-section.helper";

type UseRelatedVehiclesParams = {
  state: string;
  category: string;
  vehicleCode: string;
  country: string;
  currentVehicle?: {
    brandValue: string;
    rentalDetails: any;
  };
};

type RelatedVehiclesResult = {
  vehicleData: any[];
  selectedSection: string;
  sectionData: any;
};
export function useRelatedVehicles({
  state,
  category,
  vehicleCode,
  country,
  currentVehicle,
}: UseRelatedVehiclesParams) {
  // BUSINESS LOGIC: Fetch related vehicles randomly
  async function fetchRelatedResultRandom() {
    // BUSINESS LOGIC: Randomly select section
    const sections = ["BEST_OFFERS", "MORE_FROM_BRAND", "NEWLY_ARRIVED"];
    let selectedSection = sections[Math.floor(Math.random() * sections.length)];
    let vehicleData: any[] = [];
    let fallbackAttempted = false;
    let sectionData: any = {};

    // BUSINESS LOGIC: Try selected section, fallback to others if no results
    while (vehicleData.length === 0 && !fallbackAttempted) {
      try {
        const data = await fetchSimilarVehiclesData(
          selectedSection,
          state,
          category,
          vehicleCode,
          country,
          currentVehicle
        );

        let tempVehicleData = data?.result?.list || [];

        // BUSINESS LOGIC: Filter out current vehicle
        tempVehicleData = tempVehicleData.filter(
          (vehicle) => vehicle.vehicleCode !== vehicleCode
        );

        if (tempVehicleData.length > 0) {
          vehicleData = tempVehicleData;
          sectionData = getSectionDataForUrl(selectedSection, currentVehicle);
          break;
        } else {
          // BUSINESS LOGIC: Try next section type
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

    // BUSINESS LOGIC: Final fallback to basic vehicle listing
    if (vehicleData.length === 0) {
      try {
        const data = await fetchBasicVehicleListing(state, category, country);

        const filteredList = (data?.result?.list || []).filter(
          (vehicle) => vehicle.vehicleCode !== vehicleCode
        );

        if (filteredList.length > 0) {
          vehicleData = filteredList;
          selectedSection = "SIMILAR_FALLBACK";
          sectionData = {};
        }
      } catch (error) {
        console.error("Final fallback failed:", error);
      }
    }

    return {
      vehicleData,
      selectedSection,
      sectionData,
    };
  }

  // returning useQuery
  return useQuery<RelatedVehiclesResult>({
    queryKey: ["relatedVehicles", state, category, vehicleCode, country],
    queryFn: fetchRelatedResultRandom,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!state && !!category && !!vehicleCode && !!country,
  });
}
