// In your existing VehicleListingGridWrapper component
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type VehicleListingGridWrapperProps = {
  children: ReactNode;
  className?: string;
};

const VehicleListingGridWrapper = ({
  children,
  className,
}: VehicleListingGridWrapperProps) => {
  return (
    <div
      className={cn(
        "grid gap-4",
        // INCREASED: from 20rem to 22rem for more space
        "grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))]",
        "auto-rows-fr",
        "sm:gap-5 md:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default VehicleListingGridWrapper;
