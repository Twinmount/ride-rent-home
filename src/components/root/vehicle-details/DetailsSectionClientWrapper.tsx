"use client";

import { useRef, useEffect } from "react";
import MobileProfileCard from "@/components/root/vehicle-details/profile-card/mobile-profile-card/MobileProfileCard";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { sendPortfolioVisit } from "@/lib/api/general-api";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import { useQuery } from "@tanstack/react-query";
import { useUserActions } from "@/hooks/useUserActions";
import { useAppContext } from "@/context/useAppContext";
import useProfileData from "@/hooks/useProfileCardData";

type DetailsSectionClientWrapperProps = {
  children: React.ReactNode;
  profileData: ProfileCardDataType;
  country: string;
  vehicle?: any;
};

/**
 * DetailsSectionClientWrapper is a higher-order "use client"/CSR component that wraps a section of a vehicle
 * details page (which includes the Images, Specification, VehicleFeatures, right side ProfileCard and RelatedLinks components). It conditionally renders the MobileProfileCard component at the
 * bottom of the page based on whether the element is in the viewport or not and if the vehicle is available.
 * It also sends a portfolio visit request to the server when the element comes into
 * view.
 *
 * @param children - The children to be rendered inside the component.
 * @param profileData - The profile data of the vehicle.
 * @param country - The country code.
 * @param vehicle - The vehicle data object.
 *
 * @returns The wrapped component with the MobileProfileCard rendered at the
 * bottom of the page if the element is in the viewport and vehicle is available.
 */

const DetailsSectionClientWrapper = ({
  children,
  profileData,
  country,
  vehicle,
}: DetailsSectionClientWrapperProps) => {
  const { vehicleCode, vehicleId } = profileData;
  const { auth } = useAppContext();
  const { user, authStorage, isAuthenticated } = auth;

  const userId = user?.id || authStorage.getUser()?.id;

  const detailsSectionRef = useRef(null);
  const isInViewPort = useIntersectionObserver(detailsSectionRef);

  // Ref to track if the view has already been tracked to prevent double calls
  const hasTrackedView = useRef(false);

  // Use useUserActions hook to get track view functionality
  const { trackCarView } = useUserActions();

  // Get profile data to check vehicle availability
  const { isCompanyValid, rentalDetails } = useProfileData(
    profileData,
    country
  );

  // Enhanced availability check (same logic as ProfileCard)
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

  useQuery({
    queryKey: ["portfolioVisit", vehicleCode],
    queryFn: () => sendPortfolioVisit(vehicleCode, country, isAuthenticated),
    staleTime: 1 * 60 * 1000,
  });

  // Simple direct call to track view when component mounts
  useEffect(() => {
    // Prevent double execution in React Strict Mode or component re-renders
    if (hasTrackedView.current) {
      return;
    }

    if (userId && vehicleId && isAuthenticated) {
      trackCarView(vehicleId, {
        source: "vehicle-details-page",
        country: country,
        timestamp: new Date().toISOString(),
      });

      // Mark as tracked to prevent future calls
      hasTrackedView.current = true;
    }
  }, []);

  return (
    <section ref={detailsSectionRef}>
      {children}

      {/* Conditionally render MobileProfileCard based on:
          1. Visibility of DetailsSectionClientWrapper
          2. Vehicle availability */}
      {isInViewPort && vehicleAvailable && (
        <MobileProfileCard
          profileData={profileData}
          country={country}
          vehicle={vehicle}
        />
      )}
    </section>
  );
};

export default DetailsSectionClientWrapper;
