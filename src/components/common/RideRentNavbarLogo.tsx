import Image from "next/image";

interface RideRentNavbarLogoProps {
  country: string;
  state: string;
  category: string;
}

export default function RideRentNavbarLogo({
  country,
  state,
  category,
}: RideRentNavbarLogoProps) {
  return (
    <a
      href={`/${country}/${state}/${category}`}
      className="notranslate max-w-fit p-0 text-right text-xs font-normal text-gray-500"
    >
      <Image
        src="/assets/logo/Logo_Black.svg"
        alt="ride.rent logo"
        width={130}
        height={25}
        className="w-[7rem] sm:w-[8.5rem] md:w-40"
        quality={100}
      />
    </a>
  );
}
