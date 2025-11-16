import { BsEyeFill } from 'react-icons/bs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { FeatureType } from '@/types/vehicle-types';
import { formatKeyForIcon } from '@/helpers';
import { getAssetsUrl } from "@/utils/getCountryAssets";
import { FeatureItem } from './FeatureSidebarItem';

type FeaturesSidebarProps = {
  features: Record<string, FeatureType[]>;
  vehicleCategory: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FeaturesSidebar({
  features,
  isOpen,
  onOpenChange,
}: FeaturesSidebarProps) {
  // Base URL for fetching icons (auto-detects country from URL)
  const baseAssetsUrl = getAssetsUrl();

  // Convert features object to an array for easier mapping
  const featureEntries = Object.entries(features);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="!z-[61] overflow-auto bg-white">
        <SheetHeader>
          <SheetTitle className="custom-heading mb-6 text-2xl">
            Features
          </SheetTitle>
          <div className="space-y-8">
            {featureEntries.map(([category, featureList]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-7 items-center justify-center">
                    <img
                      src={`${baseAssetsUrl}/icons/vehicle-features/${formatKeyForIcon(
                        category
                      )}.svg`}
                      alt={`${category} icon`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{category}</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {featureList.map((feature) => (
                    <FeatureItem key={feature.value} feature={feature} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
