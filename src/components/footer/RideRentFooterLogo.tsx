"use client";
import SafeImage from "@/components/common/SafeImage";

import Link from "next/link";
import { useParams } from "next/navigation";
import MotionDiv from "../general/framer-motion/MotionDiv";

export default function RideRentFooterLogo() {
  const { state, category, country } = useParams<{
    state: string;
    category: string;
    country: string;
  }>();

  return (
    <MotionDiv className="notranslate">
      <Link href={`/${country}/${state}/${category}`} className="header-logo">
        <SafeImage
          src="/assets/logo/Logo_white.svg"
          width={200}
          height={120}
          className="w-[8rem] sm:w-[10rem] md:w-40"
          alt="Ride Rent Logo"
        />
      </Link>
    </MotionDiv>
  );
}
