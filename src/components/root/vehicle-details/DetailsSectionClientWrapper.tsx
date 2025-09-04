'use client';

import { useRef, useEffect } from 'react';
import MobileProfileCard from '@/components/root/vehicle-details/profile-card/mobile-profile-card/MobileProfileCard';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { sendPortfolioVisit } from '@/lib/api/general-api';
import { ProfileCardDataType } from '@/types/vehicle-details-types';
import { useQuery } from '@tanstack/react-query';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuthContext } from '@/auth';

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
  console.log('profileData: ', profileData);

  const { vehicleCode, vehicleId } = profileData;
  const { authStorage } = useAuthContext();
  const userId = authStorage.getUser()?.id.toString();

  const detailsSectionRef = useRef(null);
  const isInViewPort = useIntersectionObserver(detailsSectionRef);

  // Use the existing useUserProfile hook to get trackCarViewMutation
  const { trackCarViewMutation } = useUserProfile({
    userId: userId || '',
  });

  useQuery({
    queryKey: ['portfolioVisit', vehicleCode],
    queryFn: () => sendPortfolioVisit(vehicleCode, country),
    staleTime: 0,
  });

  // Track car view when component mounts (page loads)
  useEffect(() => {
    if (userId && vehicleId) {
      trackCarViewMutation.mutate({
        carId: vehicleId,
        metadata: {
          timestamp: new Date().toISOString(),
          page: 'vehicle-details',
          vehicleCode: vehicleCode,
          country: country,
          action: 'page-load',
        },
      });
    }
  }, [userId, vehicleId]);

  return (
    <section ref={detailsSectionRef}>
      {children}

      {/* Conditionally render MobileProfileCard based on the visibility of DetailsSectionClientWrapper*/}
      {isInViewPort && (
        <MobileProfileCard profileData={profileData} country={country} />
      )}
    </section>
  );
};

export default DetailsSectionClientWrapper;
