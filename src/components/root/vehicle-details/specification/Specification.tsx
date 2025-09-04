'use client';

import { FC, useState } from 'react';
import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import SpecificationSidebar from '../specification/SpecificationSidebar';
import DesktopShowAllOverlayButton from '../DesktopShowAllOverlayButton';
import MobileViewAllCard from '../MobileViewAllCard';
import SpecificationGearSVG from '../icons/SpecificationGearSVG';
import { SpecificationItem } from './SpecificationItem';

// Types for specifications
export interface ISpecificationItem {
  name: string;
  value: string;
  selected: boolean;
  hoverInfo?: string;
}

type SpecificationsProps = {
  specifications: Record<string, ISpecificationItem>;
  vehicleCategory?: string;
};

/**
 * Renders the full specification list.
 */
const Specification: FC<SpecificationsProps> = ({
  specifications,
  vehicleCategory,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Limit specs for desktop view (show first 8)
  const limitedSpecs = Object.entries(specifications).slice(0, 16);

  return (
    <>
      {/* Desktop Layout */}
      <MotionDiv className="relative mx-auto my-4 hidden w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm xl:block xl:w-1/2 xl:flex-1">
        <h3 className="text-sm font-medium text-gray-900 md:text-lg lg:text-xl">
          Specifications
        </h3>

        <p className="border-b pb-4 text-xs text-text-secondary lg:text-sm">
          Learn more about the specifications available.​
        </p>

        {/* Desktop: showing limited specifications */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {limitedSpecs.map(([key, spec]) => (
              <SpecificationItem
                key={key}
                name={key}
                spec={spec}
                vehicleCategory={vehicleCategory}
              />
            ))}
          </div>
        </div>

        {/* Desktop gradient overlay with button - only show if more than 10 specs */}
        <DesktopShowAllOverlayButton
          onClick={() => setIsSidebarOpen(true)}
          show={Object.entries(specifications).length > 10}
          text="Show All"
        />
      </MotionDiv>

      {/* Mobile Layout - Simple card only */}
      <MobileViewAllCard
        onClick={() => setIsSidebarOpen(true)}
        title="Specifications"
        description="Learn more about the specifications available​"
        icon={<SpecificationGearSVG />}
      />

      {/* Single SpecificationSidebar component */}
      <SpecificationSidebar
        specifications={specifications}
        vehicleCategory={vehicleCategory}
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </>
  );
};

export default Specification;
