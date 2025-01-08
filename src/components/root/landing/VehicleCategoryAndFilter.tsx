"use client";

import VehicleCategories from "./vehicle-categories/VehicleCategories";
import { useNavbar } from "@/context/NavbarContext";
import VehicleTypesDialog from "./VehicleTypesDialog";
import PriceFilterDialog from "./PriceFilterDialog";

export default function VehicleCategoryAndFilter() {
  const { isHidden } = useNavbar();

  return (
    <div
      className={`sticky z-30 my-3 flex items-center justify-between bg-bgGray ${isHidden && "shadow"}`}
      style={{
        top: isHidden ? "-0.1rem" : "4.4rem",
        transition: "top 0.3s ease-in-out",
      }}
    >
      <div
        className={`mx-auto flex w-[95%] max-w-[95%] items-center justify-start gap-x-6 p-0 pt-4 md:pl-8 lg:gap-x-16`}
      >
        {/* vehicle categories carousel */}
        <VehicleCategories />

        {/* right side vehicle types and price filter */}
        <div className="flex-center gap-x-3 max-sm:hidden lg:gap-x-6">
          <VehicleTypesDialog />

          <PriceFilterDialog />
        </div>
      </div>
    </div>
  );
}
