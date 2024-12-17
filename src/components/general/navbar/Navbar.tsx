"use client";

import styles from "./Navbar.module.scss";

import { GiHamburgerMenu } from "react-icons/gi";
import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Link from "next/link";
import Image from "next/image";
import StatesDropdown from "../navbar-dropdown/StatesDropdown";
import QuickLinksDropdown from "../navbar-dropdown/QuickLinksDropdown";
import CategoryDropdown from "../navbar-dropdown/CategoryDropdown";
import { useParams } from "next/navigation";
import { useShouldExclude } from "@/hooks/useShouldExclude";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = useParams<{ state: string; category: string }>();

  const state = params.state || "dubai";
  const category = params.category || "cars";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(false);
    };

    if (typeof window !== "undefined")
      window.addEventListener("resize", handleResize);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // should state/category/quicklinks dropdowns render
  const shouldRenderDropdowns = useShouldExclude();

  return (
    <header className={`${styles.header} padding main-wrapper`}>
      <nav className={styles["nav-container"]}>
        <div className={styles["nav-left"]}>
          <div className={styles["logo-container"]}>
            <Link
              href={`/${state}/${category}`}
              className={styles["header-logo"]}
            >
              <figure>
                <Image
                  src="/assets/logo/riderent-logo.webp"
                  alt="ride.rent logo"
                  width={130}
                  height={25}
                  className={styles["logo-img"]}
                  quality={100}
                />
                <figcaption>
                  Vehicles for <span>Every Journey</span>
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>
        <div className={styles["nav-items-container"]}>
          <ul>
            {/* location */}

            {!shouldRenderDropdowns && (
              <li className={styles.locations}>
                <StatesDropdown />
              </li>
            )}

            {!shouldRenderDropdowns && (
              <li className={styles.vehicles}>
                <CategoryDropdown />
              </li>
            )}

            {!shouldRenderDropdowns && (
              <li className={styles.links}>
                <QuickLinksDropdown />
              </li>
            )}

            <li className={styles["list-btn"]}>
              <Link
                href={`https://agent.ride.rent/register`}
                target="_blank"
                rel="noopener noreferrer"
                className={`yellow-gradient default-btn`}
              >
                List your vehicle for FREE
              </Link>
            </li>
          </ul>

          {/* hamburger */}
          <button
            aria-label="Hamburger"
            className={styles["hamburger-btn"]}
            onClick={toggleSidebar}
          >
            <GiHamburgerMenu className={`${styles["hamburger-icon"]}`} />
          </button>
        </div>

        {/* sidebar */}
        {isSidebarOpen && (
          <div
            className={`${styles["black-overlay"]} ${
              isSidebarOpen ? styles["black-overlay-visible"] : ""
            }`}
            onClick={toggleSidebar}
          />
        )}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </nav>
    </header>
  );
};

export default Navbar;
