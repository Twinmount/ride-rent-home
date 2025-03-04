import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { convertToLabel, singularizeType } from "@/helpers";

type CurrentPageBreadcrumbProps = {
  category: string;
  state: string;
  brand: { label: string; value: string };
  vehicleTitle: string;
};

export default function CurrentPageBreadcrumb({
  category,
  state,
  brand,
  vehicleTitle,
}: CurrentPageBreadcrumbProps) {
  const formattedCategory = convertToLabel(singularizeType(category));

  const formattedState = convertToLabel(state);

  return (
    <MotionDiv className="mt-6 rounded-xl bg-white">
      <Breadcrumb className="w-fit rounded-2xl">
        <BreadcrumbList>
          {/* vehicle state */}
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${state}/${category}`}
              className="font-semibold transition-colors hover:text-yellow hover:underline"
            >
              {formattedState}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* vehicle category */}
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${state}/${category}`}
              className="font-semibold transition-colors hover:text-yellow hover:underline"
            >
              {formattedCategory} for rent{" "}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {/* vehicle brand */}
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${state}/listing?category=${category}&brand=${brand.value}`}
              target="_blank"
              className="font-semibold transition-colors hover:text-yellow hover:underline"
            >
              {brand.label}
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
