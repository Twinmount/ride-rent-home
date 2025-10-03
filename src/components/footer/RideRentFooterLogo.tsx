"use client";
import SafeImage from "@/components/common/SafeImage";

import Link from "next/link";
import { useParams } from "next/navigation";
import MotionDiv from "../general/framer-motion/MotionDiv";

export default function RideRentFooterLogo() {
  const params = useParams();
  const country = typeof params.country === "string" ? params.country : "in";
  const state = typeof params.state === "string" ? params.state : "karnataka";
  const category =
    typeof params.category === "string" ? params.category : "cars";

  return (
    <div className="notranslate">
      <Link href={`/${country}/${state}/${category}`} className="header-logo">
        <SafeImage
          src="/assets/logo/Logo_white.svg"
          width={200}
          height={120}
          className="w-[8rem] sm:w-[10rem] md:w-40"
          alt="Ride Rent Logo"
          loading="lazy"
        />
      </Link>
    </div>
  );
}
