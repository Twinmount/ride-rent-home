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
  vehicleTitle: string;
};

export default function CurrentPageBreadcrumb({
  category,
  state,
  vehicleTitle,
}: CurrentPageBreadcrumbProps) {
  const formattedCategory = convertToLabel(singularizeType(category));

  const formattedState = convertToLabel(state);

  return (
    <MotionDiv className="my-3 rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-sm">
      <Breadcrumb className="w-fit rounded-2xl px-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${state}/${category}`}
              className="font-semibold transition-colors hover:text-yellow hover:underline"
            >
              {formattedCategory} for rent{" "}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${state}/${category}`}
              className="font-semibold transition-colors hover:text-yellow hover:underline"
            >
              {formattedState}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
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
