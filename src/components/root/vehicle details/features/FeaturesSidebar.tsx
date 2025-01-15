import { BsEyeFill } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FeatureType } from "@/types/vehicle-types";
import { formatKeyForIcon } from "@/helpers";

type FeaturesSidebarProps = {
  features: Record<string, FeatureType[]>;
  vehicleCategory: string;
};

export default function FeaturesSidebar({ features }: FeaturesSidebarProps) {
  // Base URL for fetching icons
  const baseAssetsUrl = process.env.ASSETS_URL;

  // Convert features object to an array for easier mapping
  const featureEntries = Object.entries(features);

  return (
    <Sheet>
      <SheetTrigger className="mb-2 flex items-center gap-x-2 rounded-2xl bg-orange p-1 px-4 text-white shadow-sm transition-transform ease-in-out hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]">
        Show All <BsEyeFill />
      </SheetTrigger>
      <SheetContent className="!z-[61] overflow-auto bg-white">
        <SheetHeader>
          <SheetTitle className="custom-heading mb-6 text-2xl">
            Features
          </SheetTitle>
          <div className="space-y-8">
            {featureEntries.map(([category, featureList]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center">
                    <img
                      src={`${baseAssetsUrl}/icons/vehicle-features/${formatKeyForIcon(
                        category,
                      )}.svg`}
                      alt={`${category} icon`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{category}</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                  {featureList.map((feature) => (
                    <div
                      key={feature.value}
                      className="flex items-start gap-1.5 text-sm transition-transform hover:translate-x-1"
                    >
                      <span className="relative bottom-1 mb-auto text-lg text-yellow">
                        &raquo;
                      </span>
                      <span> {feature.name}</span>
                    </div>
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
