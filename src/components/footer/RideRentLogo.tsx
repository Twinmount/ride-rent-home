"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import MotionDiv from "../general/framer-motion/MotionDiv";

export default function RideRentLogo() {
  const { state, category, country } = useParams<{ state: string; category: string, country: string }>();

  return (
    <MotionDiv className="notranslate mx-auto mb-8 w-fit">
      <Link href={`/${country}/${state}/${category}`} className="header-logo">
        <Image
          src={"/assets/logo/Logo_white.svg"}
          width={200}
          height={120}
          className="header-img"
          alt="Ride Rent Logo"
        />
      </Link>
    </MotionDiv>
  );
}
