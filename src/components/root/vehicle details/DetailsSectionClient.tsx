"use client";

import MobileProfileCard from "@/components/card/mobile-profile-card/MobileProfileCard";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { sendPortfolioVisit } from "@/lib/api/general-api";
import { ProfileCardDataType } from "@/types/vehicle-details-types";
import { useQuery } from "@tanstack/react-query";

import { useRef } from "react";

type DetailsSectionClientProps = {
  children: React.ReactNode;
  profileData: ProfileCardDataType;
};

const DetailsSectionClient = ({
  children,
  profileData,
}: DetailsSectionClientProps) => {
  const { vehicleId } = profileData;

  const detailsSectionRef = useRef(null);
  const isInViewPort = useIntersectionObserver(detailsSectionRef);

  useQuery({
    queryKey: ["portfolioVisit", vehicleId],
    queryFn: () => sendPortfolioVisit(vehicleId),
    staleTime: 600000, // 10 minutes in milliseconds
    enabled: !!vehicleId, // Ensures the query runs only when vehicleId is available
  });

  return (
    <div ref={detailsSectionRef}>
      {children}
      {isInViewPort && <MobileProfileCard profileData={profileData} />}
    </div>
  );
};

export default DetailsSectionClient;
