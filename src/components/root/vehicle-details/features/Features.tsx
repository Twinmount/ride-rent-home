import React from 'react';
import FeaturesSidebar from './FeaturesSidebar';
import { FeatureType } from '@/types/vehicle-types';
import LimitedFeatures from './LimitedFeatures';
import MotionDiv from '@/components/general/framer-motion/MotionDiv';

type VehicleFeaturesProps = {
  features: Record<string, FeatureType[]>;
  vehicleCategory: string;
};

const VehicleFeatures = ({
  features,
  vehicleCategory,
}: VehicleFeaturesProps) => {
  return (
    <MotionDiv className="relative mx-auto my-4 w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm xl:w-1/2 xl:flex-1">
      <h3 className="text-sm font-medium text-gray-900 md:text-lg lg:text-xl">
        Features
      </h3>

      <p className="border-b pb-4 text-xs text-text-secondary lg:text-sm">
        Lorem ipsum dolor sit amet consectetur. Ut felis lacinia neque
      </p>

      {/* showing limited features */}
      <LimitedFeatures features={features} />

      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-24 items-end justify-center bg-gradient-to-b from-transparent to-white/90">
        <FeaturesSidebar
          features={features}
          vehicleCategory={vehicleCategory}
        />
      </div>
    </MotionDiv>
  );
};

export default React.memo(VehicleFeatures);
