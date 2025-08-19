import { FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatKeyForIcon } from '@/helpers';
import { ENV } from '@/config/env';
import { ISpecificationItem } from './Specification';

/**
 * Renders an individual specification item with tooltip, icon, and details.
 */
export const SpecificationItem: FC<{
  name: string;
  spec: ISpecificationItem;
  vehicleCategory?: string;
}> = ({ name, spec, vehicleCategory }) => {
  // Base URL for fetching icons
  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  const iconSrc = `${baseAssetsUrl}/icons/vehicle-specifications/${vehicleCategory}/${formatKeyForIcon(
    name
  )}.svg`;

  return (
    <div className="group mt-4 flex h-12 max-h-12 min-h-12 cursor-pointer gap-2">
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild className="flex w-full gap-1">
            <div>
              {/* Icon Container */}
              <div className="flex h-12 max-h-12 w-12 min-w-12 items-center justify-center rounded-[0.5rem]">
                <img
                  src={iconSrc}
                  alt={`${name} icon`}
                  className="transition-filter h-[70%] w-[70%] object-contain duration-300 group-hover:[filter:brightness(0)_saturate(100%)_invert(63%)_sepia(43%)_saturate(2214%)_hue-rotate(6deg)_brightness(103%)_contrast(101%)]"
                />
              </div>
              {/* Specification Details */}
              <div className="flex h-full w-full max-w-full flex-col items-start justify-center gap-[0.1rem] text-left">
                <span className="text-[0.8rem] font-medium">{name}</span>
                <span className="max-w-full text-left text-[0.8rem] text-gray-600">
                  {spec.name}
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="rounded-xl bg-slate-800 text-white shadow-md">
            <p>{spec?.hoverInfo || name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
