"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export default function RideRentLogo() {
  const { state, category } = useParams<{ state: string; category: string }>();

  return (
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
          Quick way to get a <span>Ride On Rent</span>
        </figcaption>
      </figure>
    </Link>
  );
}
