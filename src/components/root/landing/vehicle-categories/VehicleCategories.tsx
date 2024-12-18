"use client";

import "./VehicleCategories.scss";
import { useMemo, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/next-api/next-api";
import { sortCategories } from "@/helpers";
import { CategoryType } from "@/types/contextTypes";
import Link from "next/link";

type VehicleCategoriesProps = {
  state: string;
  category: string;
};

const VehicleCategories = ({ state, category }: VehicleCategoriesProps) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  const plugin = useRef(Autoplay({ delay: 1600, stopOnInteraction: true }));

  // Fetch categories using useQuery
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Check if data is defined and then sort categories
  const sortedCategories = useMemo(() => {
    return data?.result?.list ? sortCategories(data.result.list) : [];
  }, [data]);

  return (
    <div className="category-container" id="categories">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="gap-2">
          {sortedCategories.map((cat: CategoryType) => (
            <Link
              href={`/${state}/${cat.value}`}
              key={cat.categoryId}
              className={`vehicle_category_card ${
                selectedCard === cat.categoryId ? "selected" : ""
              }`}
              onClick={() => setSelectedCard(cat.categoryId)}
            >
              <div
                className={`category_icon_container ${
                  category === cat.value ? "yellow-gradient" : ""
                }`}
              >
                <img
                  src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
                  width={21}
                  height={10}
                  alt={`${cat.name} Icon`}
                  className={`vehicle_category_logo ${
                    cat.value === "sports_car" ? "scale-125" : ""
                  } `}
                />
              </div>
              <p>{cat.name}</p>
            </Link>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default VehicleCategories;
