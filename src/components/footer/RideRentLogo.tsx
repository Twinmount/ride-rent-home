"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import MotionDiv from "../general/framer-motion/MotionDiv";

export default function RideRentLogo() {
  const { state, category } = useParams<{ state: string; category: string }>();

  return (
    <MotionDiv className="notranslate mx-auto mb-8 w-fit">
      <Link href={`/${state}/${category}`} className="header-logo">
        <figure>
          <Image
            src={"/assets/logo/footer-icon.png"}
            width={200}
            height={120}
            className="header-img"
            alt="Ride Rent Logo"
          />
          <figcaption>
            Vehicles for <span>Every Journey</span>
          </figcaption>
        </figure>
      </Link>
    </MotionDiv>
  );
}
