import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { convertToLabel } from "@/helpers";
import clsx from "clsx";
import Link from "next/link";

type ListingPageBreadcrumbProps = {
  country: string;
  state: string;
  category: string;
  vehicleType?: string;
  brand?: string;
  city?: string;
};

export default function ListingPageBreadcrumb({
  country,
  state,
  category,
  vehicleType,
  brand,
  city,
}: ListingPageBreadcrumbProps) {
  const formattedState = convertToLabel(state);
  const formattedCategory = convertToLabel(category);
  const formattedVehicleType = vehicleType ? convertToLabel(vehicleType) : null;
  const formattedBrand = brand ? convertToLabel(brand) : null;
  const formattedCity = city ? convertToLabel(city) : null;

  const baseHref = `/${country}/${state}`;
  const stateHref = `${baseHref}/vehicle-rentals`;
  const categoryHref = `${baseHref}/listing/${category}`;
  const vehicleTypeHref = `${baseHref}/listing/${category}/${vehicleType}`;

  // Determine if current page is the final breadcrumb (should not be clickable)
  const isCategoryLast =
    !formattedVehicleType && !formattedBrand && !formattedCity;
  const isVehicleTypeLast =
    formattedVehicleType && !formattedBrand && !formattedCity;
  const isBrandLast = formattedBrand && !formattedCity;
  const isCityLast = !!formattedCity;

  return (
    <MotionDiv className="mb-3 rounded-xl text-sm">
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
                "font-medium text-text-tertiary transition-colors hover:text-yellow hover:underline",
                {
                  "text-yellow": isCategoryLast,
                }
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
                    "font-medium text-text-tertiary transition-colors hover:text-yellow hover:underline",
                    { "text-yellow": isVehicleTypeLast }
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
              <BreadcrumbPage
                className={clsx(
                  "cursor-default font-medium text-accent text-text-tertiary",
                  { "text-yellow": isBrandLast }
                )}
              >
                {formattedBrand}
              </BreadcrumbPage>
            </>
          )}

          {/* City */}
          {formattedCity && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbPage
                className={clsx(
                  "cursor-default font-medium text-accent text-yellow",
                  { "text-yellow": isCityLast }
                )}
              >
                {formattedCity}
              </BreadcrumbPage>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </MotionDiv>
  );
}
