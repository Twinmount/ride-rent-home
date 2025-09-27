"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RideRentFooterLogo() {
  const params = useParams();
  const country = typeof params.country === "string" ? params.country : "in";
  const state = typeof params.state === "string" ? params.state : "karnataka";
  const category =
    typeof params.category === "string" ? params.category : "car-rental";

  return (
    <div className="notranslate">
      <Link href={`/${country}/${state}/${category}`} className="header-logo">
        <Image
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
