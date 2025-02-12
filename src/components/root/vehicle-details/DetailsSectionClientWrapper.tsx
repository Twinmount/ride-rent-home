"use client";

import { useRef } from "react";
import MobileProfileCard from "@/components/root/vehicle-details/profile-card/mobile-profile-card/MobileProfileCard";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { sendPortfolioVisit } from "@/lib/api/general-api";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import { useQuery } from "@tanstack/react-query";

type DetailsSectionClientWrapperProps = {
  children: React.ReactNode;
  profileData: ProfileCardDataType;
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
}: DetailsSectionClientWrapperProps) => {
  const { vehicleId } = profileData;

  const detailsSectionRef = useRef(null);
  const isInViewPort = useIntersectionObserver(detailsSectionRef);

  useQuery({
    queryKey: ["portfolioVisit", vehicleId],
    queryFn: () => sendPortfolioVisit(vehicleId),
    staleTime: 600000, // 10 minutes in milliseconds
    enabled: !!vehicleId,
  });

  return (
    <div ref={detailsSectionRef}>
      {children}

      {/* Conditionally render MobileProfileCard based on the visibility of DetailsSectionClientWrapper*/}
      {isInViewPort && <MobileProfileCard profileData={profileData} />}
    </div>
  );
};

export default DetailsSectionClientWrapper;
