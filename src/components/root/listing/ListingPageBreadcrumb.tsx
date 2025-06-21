import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { convertToLabel, singularizeType } from "@/helpers";
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
    <div className="my-6 w-fit rounded-xl bg-white px-4 py-3 shadow-sm">
      <Breadcrumb className="w-fit rounded-2xl">
        <BreadcrumbList>
          {/* State */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-semibold transition-colors hover:text-yellow hover:underline"
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
                "font-semibold transition-colors hover:text-yellow hover:underline",
                { "text-yellow": !formattedBrand && !formattedVehicleType },
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
                    "font-semibold transition-colors hover:text-yellow hover:underline",
                    { "text-yellow": !formattedBrand },
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
              <BreadcrumbPage className="cursor-default font-semibold text-yellow">
                {formattedBrand}
              </BreadcrumbPage>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
