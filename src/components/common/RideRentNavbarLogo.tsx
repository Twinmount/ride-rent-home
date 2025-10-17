import SafeImage from "@/components/common/SafeImage";
import { isValidCountryCode } from "@/helpers/country-config";

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
  const isValidCountry = isValidCountryCode(country);

  const validCountry = isValidCountry ? country : "ae";

  return (
    <a
      href={`/${validCountry}`}
      className="notranslate block p-0 text-right text-xs font-normal text-gray-500"
    >
      <div className="w-20 sm:w-24 md:w-28 lg:w-32 xl:w-40">
        <SafeImage
          src="/assets/logo/Logo_Black.svg"
          alt="ride.rent logo"
          width={176}
          height={32}
          className="h-auto w-full"
          quality={100}
        />
      </div>
    </a>
  );
}
