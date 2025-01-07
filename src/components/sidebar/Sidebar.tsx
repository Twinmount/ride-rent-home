import Link from "next/link";
import styles from "./Sidebar.module.scss";

import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { SidebarAccordion } from "../general/sidebar-accordion/SidebarAccordion";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles["logo-container"]}>
        <Link href="/" className={styles["header-logo"]}>
          <figure>
            <Image
              src="/assets/logo/riderent-logo.webp"
              alt="ride.rent logo"
              width={130}
              height={25}
            />
            <figcaption>
              Vehicles for <span>Every Journey</span>
            </figcaption>
          </figure>
        </Link>

        <button
          aria-label="Sidebar Toggle"
          className={styles["hamburger-close-btn"]}
          onClick={toggleSidebar}
        >
          <IoClose className={styles["hamburger-icon"]} />
        </button>
      </div>

      {/* sidebar items */}
      <SidebarAccordion toggleSidebar={toggleSidebar} />
    </aside>
  );
};

export default Sidebar;
