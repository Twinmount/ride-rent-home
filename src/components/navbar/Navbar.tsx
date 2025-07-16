"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useShouldRender } from "@/hooks/useShouldRender";
import { SearchDialog } from "../dialog/search-dialog/SearchDialog";
import { extractCategory } from "@/helpers";
import { noStatesDropdownRoutes } from ".";
import LanguageSelector from "./LanguageSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { LocationDialog } from "../dialog/location-dialog/LocationDialog";
import { useEffect, useState } from "react";
import { AlignRight } from "lucide-react";
import { Button } from "../ui/button";

// dynamic import for sidebar
const MobileSidebar = dynamic(() => import("../sidebar/MobileSidebar"), {
  loading: () => (
    <Button className="border-none outline-none" size="icon" disabled>
      <AlignRight className="h-6 w-6" />
      <span className="sr-only">Toggle navigation</span>
    </Button>
  ),
});

export const Navbar = () => {
  const params = useParams<{
    state: string;
    category: string;
    country: string;
  }>();

  const country = (params?.country as string) || "ae";

  const [state, setState] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    // Check if param values exist
    const paramState = params?.state as string | undefined;
    const paramCategory = params?.category as string | undefined;

    // If present in params, store in localStorage
    if (paramState) {
      localStorage.setItem("state", paramState);
    }
    if (paramCategory) {
      localStorage.setItem("category", paramCategory);
    }

    // Fallback order: params → localStorage → default
    const storedState = localStorage.getItem("state");
    const storedCategory = localStorage.getItem("category");

    const finalState =
      paramState || storedState || (country === "in" ? "bangalore" : "dubai");

    const finalCategory = paramCategory || storedCategory || "cars";

    setState(finalState);
    setCategory(extractCategory(finalCategory));
  }, [params, country]);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Save to localStorage
          sessionStorage.setItem(
            "userLocation",
            JSON.stringify({ latitude, longitude }),
          );
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    } else {
      console.warn("Geolocation is not supported");
    }
  }, []);

  const shouldRenderDropdowns = useShouldRender(noStatesDropdownRoutes);

  const isMobile = useIsMobile(640);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 flex h-[4rem] flex-col items-center justify-center gap-y-5 border-b bg-white transition-all duration-200 ease-in-out`}
    >
      <nav className={`flex-between global-padding container`}>
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
                <LocationDialog />
              </li>
            )}

            {/* List Button */}
            <li className="hidden lg:block">
              <Link
                href={`https://agent.ride.rent/${country}/register`}
                target="_blank"
                rel="noopener noreferrer"
                className="default-btn bg-theme-gradient !font-[500]"
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
    </header>
  );
};
