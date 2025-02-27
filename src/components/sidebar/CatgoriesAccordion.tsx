import { useFetchVehicleCategories } from "@/hooks/useFetchVehicleCategories";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { GiSteeringWheel } from "react-icons/gi";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export const CategoriesAccordion = () => {
  const { state, category } = useStateAndCategory();

  const { categories, isCategoriesLoading } = useFetchVehicleCategories();

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger className="w-full no-underline hover:no-underline">
        <div className="flex items-center">
          <GiSteeringWheel className="mr-2 text-lg text-orange" />
          Vehicle Category
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-y-1 rounded-xl bg-slate-100 p-1 pl-2">
        {isCategoriesLoading ? (
          <div>Loading...</div>
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <Link
              key={cat.categoryId}
              href={`/${state}/${cat.value}`}
              className={`accordion-item flex cursor-pointer items-center gap-2 text-base hover:text-yellow hover:underline ${
                category === cat.value ? "text-yellow" : ""
              }`}
            >
              <MdKeyboardDoubleArrowRight />
              {cat.name}
            </Link>
          ))
        ) : (
          <div className="accordion-item text-base text-red-500">
            No Categories found
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
