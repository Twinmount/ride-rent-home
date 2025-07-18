"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
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
        <Image
          src={'/assets/logo/Logo_white.svg'}
          width={160}
          height={96}
          className="header-img h-12 w-auto md:h-16"
          alt="Ride Rent Logo"
        />
      </Link>
    </MotionDiv>
  );
}