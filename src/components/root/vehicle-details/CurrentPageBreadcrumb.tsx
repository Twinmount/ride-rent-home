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

type CurrentPageBreadcrumbProps = {
  category: string;
  state: string;
  brand: { label: string; value: string };
  vehicleTitle: string;
  country: string;
};

export default function CurrentPageBreadcrumb({
  category,
  state,
  brand,
  vehicleTitle,
  country,
}: CurrentPageBreadcrumbProps) {
  const formattedCategory = convertToLabel(singularizeValue(category));

  const formattedState = convertToLabel(state);

  return (
    <MotionDiv className="mt-6 rounded-xl bg-white">
      <Breadcrumb className="w-fit rounded-2xl">
        <BreadcrumbList>
          {/* vehicle state */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-semibold transition-colors hover:text-yellow hover:underline"
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
              className="font-semibold transition-colors hover:text-yellow hover:underline"
              asChild
            >
              <Link href={`/${country}/${state}/${category}`}>
                {formattedCategory} for rent{" "}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* vehicle brand */}
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-semibold transition-colors hover:text-yellow hover:underline"
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
            <BreadcrumbPage className="cursor-default font-semibold text-yellow">
              {vehicleTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </MotionDiv>
  );
}
