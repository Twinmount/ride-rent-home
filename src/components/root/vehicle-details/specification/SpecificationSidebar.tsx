import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SpecificationItem } from './SpecificationItem';

// Types for specifications
interface SpecificationItem {
  name: string;
  value: string;
  selected: boolean;
  hoverInfo?: string;
}

type SpecificationSidebarProps = {
  specifications: Record<string, SpecificationItem>;
  vehicleCategory?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SpecificationSidebar({
  specifications,
  vehicleCategory,
  isOpen,
  onOpenChange,
}: SpecificationSidebarProps) {
  // Convert specifications object to an array for easier mapping
  const specEntries = Object.entries(specifications);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="!z-[61] overflow-auto bg-white">
        <SheetHeader>
          <SheetTitle className="custom-heading mb-6 text-2xl">
            Specifications
          </SheetTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {specEntries.map(([key, spec]) => {
                return (
                  <SpecificationItem
                    key={key}
                    name={key}
                    spec={spec}
                    vehicleCategory={vehicleCategory}
                  />
                );
              })}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
