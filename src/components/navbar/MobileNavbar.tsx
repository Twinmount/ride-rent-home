"use client";

import PriceFilterDialog from "@/components/dialog/price-filter-dialog/PriceFilterDialog";
import { SearchDialog } from "@/components/dialog/search-dialog/SearchDialog";
import MobileNavbarWrapper from "./MobileNavbarWrapper";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { useParams } from "next/navigation";

const MobileNavbar = () => {
  const { state } = useParams<{ state: string; category: string }>();

  const isSmallScreen = useIsSmallScreen(640);

  if (!isSmallScreen) return null;

  return (
    <MobileNavbarWrapper>
      <div className={`flex-between w-full`}>
        <ul className="flex w-full items-center justify-evenly gap-4">
          <li className="flex-center w-fit flex-col gap-y-1">
            <PriceFilterDialog isMobileNav={true} />
            <span className="text-xs text-gray-600">Price</span>
          </li>

          <li className="flex-center w-fit flex-col gap-y-1">
            <SearchDialog isMobileNav={true} state={state} />
            <span className="text-xs text-gray-600">search</span>
          </li>
        </ul>
      </div>
    </MobileNavbarWrapper>
  );
};

export default MobileNavbar;
