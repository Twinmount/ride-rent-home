"use client";

import { useRef, useEffect, useCallback } from "react";
import MobileProfileCard from "@/components/root/vehicle-details/profile-card/mobile-profile-card/MobileProfileCard";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { sendPortfolioVisit } from "@/lib/api/general-api";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthContext } from "@/auth";

type DetailsSectionClientWrapperProps = {
  children: React.ReactNode;
  profileData: ProfileCardDataType;
  country: string;
};

/**
 * DetailsSectionClientWrapper is a higher-order "use client"/CSR component that wraps a section of a vehicle
 * details page (which includes the Images, Specification, VehicleFeatures, right side ProfileCard and RelatedLinks components ). It conditionally renders the MobileProfileCard component at the
 * bottom of the page based on whether the element is in the viewport or not.
 * It also sends a portfolio visit request to the server when the element comes into
 * view.
 *
 * @param children - The children to be rendered inside the component.
 * @param profileData - The profile data of the vehicle.
 *
 * @returns The wrapped component with the MobileProfileCard rendered at the
 * bottom of the page if the element is in the viewport.
 */

const DetailsSectionClientWrapper = ({
  children,
  profileData,
  country,
}: DetailsSectionClientWrapperProps) => {
  const { vehicleCode, vehicleId } = profileData;
  const { authStorage } = useAuthContext();
  const userId = authStorage.getUser()?.id.toString();

  const detailsSectionRef = useRef(null);
  const isInViewPort = useIntersectionObserver(detailsSectionRef);

  // Ref to track if the API has already been called to prevent double calls
  const hasTrackedView = useRef(false);

  const { trackCarViewMutation } = useUserProfile({
    userId: userId || "",
  });

  // Memoized function to track car view to prevent recreation on every render
  const trackCarView = useCallback(() => {
    if (userId && vehicleId && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackCarViewMutation.mutate({
        carId: vehicleId,
        metadata: {
          timestamp: new Date().toISOString(),
          page: "vehicle-details",
          vehicleCode: vehicleCode,
          country: country,
          action: "page-load",
        },
      });
    }
  }, [userId, vehicleId, vehicleCode, country, trackCarViewMutation]);

  // Track car view when component mounts (page loads) - only once
  useEffect(() => {
    trackCarView();
  }, [trackCarView]);

  return (
    <section ref={detailsSectionRef}>
      {children}

      {/* Conditionally render MobileProfileCard based on the visibility of DetailsSectionClientWrapper*/}
      {/* {isInViewPort && (
        <MobileProfileCard profileData={profileData} country={country} />
      )} */}
    </section>
  );
};

export default DetailsSectionClientWrapper;
