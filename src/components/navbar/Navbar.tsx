"use client";

import Link from "next/link";
import Image from "next/image";
import StatesDropdown from "./StatesDropdown";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useShouldExclude } from "@/hooks/useShouldExclude";
import MobileSidebar from "../sidebar/MobileSidebar";
import { SearchDialog } from "../dialog/search-dialog/SearchDialog";
import { extractCategory } from "@/helpers";

export const Navbar = () => {
  const params = useParams<{ state: string; category: string }>();

  const state = params.state || "dubai";
  let category = params.category || "cars";

  // should state/category/quickLinks dropdowns render
  const shouldRenderDropdowns = useShouldExclude({ isCategory: false });

  // if category ends with "-for-rent", remove "-for-rent"
  category = extractCategory(category);

  return (
    <NavbarWrapper>
      <nav className={`flex-between w-full`}>
        <div className="flex w-fit items-center justify-center">
          <div className="w-fit p-0">
            <Link
              href={`/${state}/${category}`}
              className="max-w-fit p-0 text-right text-xs font-normal text-gray-500"
            >
              <figure className="m-0">
                <Image
                  src="/assets/logo/riderent-logo.webp"
                  alt="ride.rent logo"
                  width={130}
                  height={25}
                  className="w-[8.5rem] md:w-40"
                  quality={100}
                />
                <figcaption className="text-[0.7rem]">
                  Vehicles for{" "}
                  <span className="font-bold italic text-black">
                    Every Journey
                  </span>
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>

        <div className="flex w-fit items-center">
          <ul className="flex w-full items-center justify-between gap-4">
            {/* Search Dialog */}
            <li className="max-sm:hidden">
              <SearchDialog />
            </li>

            {/* Location */}
            {!shouldRenderDropdowns && (
              <li className="mr-2">
                <StatesDropdown />
              </li>
            )}

            {/* List Button */}
            <li className="hidden lg:block">
              <Link
                href={`https://agent.ride.rent/register`}
                target="_blank"
                rel="noopener noreferrer"
                className="yellow-gradient default-btn"
              >
                List your vehicle for FREE
              </Link>
            </li>

            {/* <li className="max-sm:hidden">
              <ProfileDropdown />
            </li> */}

            <li className="sm:hidden">
              <MobileSidebar />
            </li>
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
