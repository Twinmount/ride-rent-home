"use client";

import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { formatKeyForIcon } from "@/helpers";
import { ENV } from "@/config/env";

// Types for specifications
interface SpecificationItem {
  name: string;
  value: string;
  selected: boolean;
  hoverInfo?: string;
}

type SpecificationsProps = {
  specifications: Record<string, SpecificationItem>;
  vehicleCategory?: string;
};

// Base URL for fetching icons
const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

/**
 * Renders an individual specification item with tooltip, icon, and details.
 */
const SpecificationItem: FC<{
  name: string;
  spec: SpecificationItem;
  vehicleCategory?: string;
}> = ({ name, spec, vehicleCategory }) => {
  const iconSrc = `${baseAssetsUrl}/icons/vehicle-specifications/${vehicleCategory}/${formatKeyForIcon(
    name,
  )}.svg`;

  return (
    <div className="group mt-4 flex h-12 max-h-12 min-h-12 cursor-pointer gap-2">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="flex w-full gap-1">
            {/* Icon Container */}
            <div className="flex h-12 max-h-12 w-12 min-w-12 items-center justify-center rounded-[0.5rem] border border-gray-300">
              <img
                src={iconSrc}
                alt={`${name} icon`}
                className="transition-filter h-[70%] w-[70%] object-contain duration-300 group-hover:[filter:brightness(0)_saturate(100%)_invert(63%)_sepia(43%)_saturate(2214%)_hue-rotate(6deg)_brightness(103%)_contrast(101%)]"
              />
            </div>
            {/* Specification Details */}
            <div className="flex h-full w-full max-w-full flex-col items-start justify-center gap-[0.1rem] text-left">
              <span className="text-[0.7rem] font-medium md:text-[0.8rem]">
                {name}
              </span>
              <span className="max-w-full text-left text-[0.75rem] text-gray-600">
                {spec.name}
              </span>
            </div>
          </TooltipTrigger>
          {/* Tooltip Content */}
          <TooltipContent className="rounded-xl bg-slate-800 text-white shadow-md">
            <p>{spec?.hoverInfo || name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

/**
 * Renders the full specification list.
 */
const Specification: FC<SpecificationsProps> = ({
  specifications,
  vehicleCategory,
}) => {
  return (
    <MotionDiv className="mx-auto my-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="custom-heading mb-8 text-gray-900">Specifications</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(specifications).map(([key, spec]) => (
          <SpecificationItem
            key={key}
            name={key}
            spec={spec}
            vehicleCategory={vehicleCategory}
          />
        ))}
      </div>
    </MotionDiv>
  );
};

export default Specification;
