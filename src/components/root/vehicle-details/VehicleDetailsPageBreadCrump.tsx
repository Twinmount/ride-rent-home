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
import Link from "next/link";

type VehicleDetailsPageBreadCrumpProps = {
  category: string;
  state: string;
  brand: { label: string; value: string };
  vehicleTitle: string;
  country: string;
  ref?: string;
};

export default function VehicleDetailsPageBreadCrump({
  category,
  state,
  brand,
  vehicleTitle,
  country,
}: VehicleDetailsPageBreadCrumpProps) {
  const formattedCategory = convertToLabel(singularizeValue(category));

  const formattedState = convertToLabel(state);

  return (
    <MotionDiv className="m-1 mb-3 ml-2 rounded-xl text-sm">
      <Breadcrumb className="w-fit rounded-2xl">
        <BreadcrumbList>
          {/* vehicle state */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-medium transition-colors hover:text-yellow hover:underline"
              asChild
            >
              <Link href={`/${country}/${state}/${category}`}>
                {formattedState}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* vehicle category */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-medium transition-colors hover:text-yellow hover:underline"
              asChild
            >
              <Link href={`/${country}/${state}/listing/${category}`}>
                {formattedCategory} for rent{" "}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* vehicle brand */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-medium transition-colors hover:text-yellow hover:underline"
              asChild
            >
              <Link
                href={`/${country}/${state}/listing/${category}/brand/${brand.value}`}
              >
                {brand.label}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* vehicle title */}
          <BreadcrumbItem>
            <BreadcrumbPage className="cursor-default font-medium text-accent">
              {vehicleTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </MotionDiv>
  );
}
