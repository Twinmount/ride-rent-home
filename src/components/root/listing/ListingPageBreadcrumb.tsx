import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { convertToLabel, singularizeValue } from "@/helpers";
import clsx from "clsx";
import Link from "next/link";

type ListingPageBreadcrumbProps = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
};

export default function ListingPageBreadcrumb({
  country,
  state,
  category,
  vehicleType,
  brand,
}: ListingPageBreadcrumbProps) {
  const formattedState = convertToLabel(state);
  const formattedCategory = convertToLabel(category);
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : null;
  const formattedBrand = brand ? convertToLabel(brand) : null;

  const baseHref = `/${country}/${state}`;
  const stateHref = `${baseHref}/vehicle-rentals`;
  const categoryHref = `${baseHref}/listing/${category}`;
  const vehicleTypeHref = `${baseHref}/listing/${category}/${vehicleType}`;
  const brandHref = `${baseHref}/listing/${category}/brand/${brand}`;
  const brandWithVehicleTypeHref = `${baseHref}/listing/${category}/${vehicleType}/brand/${brand}`;

  return (
    <MotionDiv className="m-1 mb-3 ml-2 rounded-xl text-sm">
      <Breadcrumb className="w-fit rounded-2xl">
        <BreadcrumbList>
          {/* State */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-medium transition-colors hover:text-yellow hover:underline"
              asChild
            >
              <Link href={stateHref}>{formattedState}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* Category */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className={clsx(
                "font-medium transition-colors hover:text-yellow hover:underline",
                { "text-accent": !formattedBrand && !formattedVehicleType }
              )}
              asChild
            >
              <Link href={categoryHref}>{formattedCategory}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Vehicle Type */}
          {formattedVehicleType && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={clsx(
                    "font-medium transition-colors hover:text-yellow hover:underline",
                    { "text-accent": !formattedBrand }
                  )}
                  asChild
                >
                  <Link href={vehicleTypeHref}>{formattedVehicleType}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}

          {/* Brand */}
          {formattedBrand && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbPage className="cursor-default font-medium text-accent">
                {formattedBrand}
              </BreadcrumbPage>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </MotionDiv>
  );
}
