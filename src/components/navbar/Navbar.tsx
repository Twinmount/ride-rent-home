"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
// import StatesDropdown from "./StatesDropdown";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useShouldRender } from "@/hooks/useShouldRender";
import { SearchDialog } from "../dialog/search-dialog/SearchDialog";
import { extractCategory } from "@/helpers";
import { noStatesDropdownRoutes } from ".";
import LanguageSelector from "./LanguageSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { LocationDialog } from "../dialog/location-dialog/LocationDialog";
// dynamic import for sidebar
const MobileSidebar = dynamic(() => import("../sidebar/MobileSidebar"), {
  loading: () => <span className="text-[0.5rem]">Loading...</span>,
});

export const Navbar = () => {
  const params = useParams<{
    state: string;
    category: string;
    country: string;
  }>();

  const state = params.state || "dubai";
  const country = params.country || "uae";
  let category = params.category || "cars";

  // should state dropdowns render or not for the specified routes
  const shouldRenderDropdowns = useShouldRender(noStatesDropdownRoutes);

  // if category ends with "-for-rent", remove "-for-rent"
  category = extractCategory(category);

  const isMobile = useIsMobile(640);

  return (
    <NavbarWrapper>
      <nav className={`flex-between w-full`}>
        <div className="flex w-fit items-center justify-center">
          <div className="w-fit p-0">
            <a
              href={`/${country}/${state}/${category}`}
              className="notranslate max-w-fit p-0 text-right text-xs font-normal text-gray-500"
            >
              <Image
                src="/assets/logo/Logo_Black.svg"
                alt="ride.rent logo"
                width={130}
                height={25}
                className="w-[8.5rem] md:w-40"
                quality={100}
              />
            </a>
          </div>
        </div>

        <div className="flex w-fit items-center">
          <ul className="flex w-full items-center justify-between gap-1 md:gap-4">
            {/* Search Dialog */}
            <li className="max-sm:hidden">
              <SearchDialog state={state} />
            </li>
            <li>
              <LanguageSelector />
            </li>

            {/* Location */}
            {!shouldRenderDropdowns && (
              <li className="mr-2">
                {/* <StatesDropdown /> */}
                <LocationDialog />
              </li>
            )}

            {/* List Button */}
            <li className="hidden lg:block">
              <Link
                href={`https://agent.ride.rent/register`}
                target="_blank"
                rel="noopener noreferrer"
                className="yellow-gradient default-btn !font-[500]"
              >
                List your vehicle for FREE
              </Link>
            </li>

            {/* <li className="max-sm:hidden">
              <ProfileDropdown />
            </li> */}

            <li className="sm:hidden">{isMobile && <MobileSidebar />}</li>
          </ul>
        </div>
      </nav>
    </NavbarWrapper>
  );
};

/**
 * NavbarWrapper component with motion effects based on the isHidden state.
 *
 */
const NavbarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.header
      className={`global__padding fixed left-0 right-0 top-0 z-50 flex h-[4rem] flex-col items-center justify-center gap-y-5 border-b bg-lightGray transition-all duration-200 ease-in-out`}
    >
      {children}
    </motion.header>
  );
};
