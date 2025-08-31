'use client';

import React, { useState } from 'react';
import FeaturesSidebar from './FeaturesSidebar';
import { FeatureType } from '@/types/vehicle-types';
import LimitedFeatures from './LimitedFeatures';
import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import { BsEyeFill } from 'react-icons/bs';
import DesktopShowAllOverlayButton from '../DesktopShowAllOverlayButton';
import MobileViewAllCard from '../MobileViewAllCard';
import { Star } from 'lucide-react';
import FeaturesStarSVG from '../icons/FeaturesStarSVG';
import { shouldShowDesktopFeaturesButton } from '@/helpers';

type VehicleFeaturesProps = {
  features: Record<string, FeatureType[]>;
  vehicleCategory: string;
};

const VehicleFeatures = ({
  features,
  vehicleCategory,
}: VehicleFeaturesProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showViewAllDesktopButton = shouldShowDesktopFeaturesButton(features);
  return (
    <>
      {/* Desktop Layout */}
      <MotionDiv className="relative mx-auto my-4 hidden w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm xl:block xl:w-1/2 xl:flex-1">
        <h3 className="text-sm font-medium text-gray-900 md:text-lg lg:text-xl">
          Features
        </h3>

        <p className="border-b pb-4 text-xs text-text-secondary lg:text-sm">
          Learn more about the features available.
        </p>

        {/* Desktop: showing limited features */}
        <div className="mb-4">
          <LimitedFeatures features={features} />
        </div>

        {/* Desktop gradient overlay with button */}
        <DesktopShowAllOverlayButton
          onClick={() => setIsSidebarOpen(true)}
          show={showViewAllDesktopButton}
          text="Show All"
        />
      </MotionDiv>

      {/* Mobile Layout - Simple card only */}
      <MobileViewAllCard
        onClick={() => setIsSidebarOpen(true)}
        title="Features"
        description="Lorem ipsum dolor sit amet consectetur."
        icon={<FeaturesStarSVG />}
      />

      {/* Single FeaturesSidebar component */}
      <FeaturesSidebar
        features={features}
        vehicleCategory={vehicleCategory}
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </>
  );
};

export default React.memo(VehicleFeatures);
