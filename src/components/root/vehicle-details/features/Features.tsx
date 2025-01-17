import React from "react";
import FeaturesSidebar from "./FeaturesSidebar";
import { MotionH2 } from "@/components/general/framer-motion/MotionElm";
import { FeatureType } from "@/types/vehicle-types";
import LimitedFeatures from "./LimitedFeatures";

type VehicleFeaturesProps = {
  features: Record<string, FeatureType[]>;
  vehicleCategory: string;
};

const VehicleFeatures = ({
  features,
  vehicleCategory,
}: VehicleFeaturesProps) => {
  return (
    <div className="relative mx-auto my-4 w-full max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <MotionH2
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="custom-heading mb-8 text-gray-900"
      >
        Features
      </MotionH2>

      {/* showing limited features */}
      <LimitedFeatures features={features} />

      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-24 items-end justify-center bg-gradient-to-b from-transparent to-white/90">
        <FeaturesSidebar
          features={features}
          vehicleCategory={vehicleCategory}
        />
      </div>
    </div>
  );
};

export default React.memo(VehicleFeatures);
