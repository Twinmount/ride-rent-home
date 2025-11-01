import BrandImage from '@/components/common/BrandImage';
import { COUNTRY_CONFIGS } from "@/helpers/country-config";
import Link from "next/link";

type Props = {
  brandListingPageHref: string;
  category: string;
  brandValue: string;
  vehicleTitleH1: string;
  vehicleSubTitle: string;
  heading: string;
  model: string;
  state: string;
  country: string;
};

const VehicleHeading = ({
  brandListingPageHref,
  category,
  brandValue,
  vehicleTitleH1,
  vehicleSubTitle,
  model,
  heading,
  state,
  country,
}: Props) => {
  return (
    <div className="mb-4 flex items-center gap-2 lg:gap-4">
      <Link
        href={brandListingPageHref}
        className="h-fit w-fit"
        aria-label={`View all ${brandValue} ${category} in ${state}`}
      >
        <div className="relative h-12 w-12 min-w-12 cursor-pointer overflow-hidden rounded-full border bg-white p-1 hover:border-accent-light md:h-16 md:w-16 md:min-w-16 lg:h-[4.5rem] lg:w-[4.5rem] lg:min-w-[4.5rem]">
          <BrandImage
            category={category}
            brandValue={brandValue}
            country={country}
            className="object-contain"
            priority={true}
            sizes="(max-width: 768px) 48px, (max-width: 1024px) 64px, 72px"
          />
        </div>
      </Link>

      <div className="h-fit space-y-1">
        <h1 className="font-poppins text-lg font-medium leading-[1] text-text-primary md:text-2xl lg:text-3xl">
          {vehicleTitleH1}
        </h1>
        <p className="text-xs text-text-tertiary md:text-sm">
          {vehicleSubTitle}
        </p>
      </div>
    </div>
  );
};

export default VehicleHeading;