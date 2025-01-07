"use client";

import VehicleTypesGridSkelton from "@/components/skelton/VehicleTypesGridSkelton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertToLabel } from "@/helpers";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { fetchVehicleTypesByValue } from "@/lib/next-api/next-api";
import { VehicleTypeType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function VehicleTypesDialog() {
  const { state, category } = useStateAndCategory();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category],
    queryFn: () => fetchVehicleTypesByValue(category),
    enabled: !!category,
  });

  const vehicleTypes: VehicleTypeType[] = data?.result?.list || [];

  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <Dialog>
      <DialogTrigger>{convertToLabel(category)} Types</DialogTrigger>
      <DialogContent className="max-h-[90vh] !w-[80vw] overflow-hidden rounded-2xl bg-white py-8">
        <DialogHeader>
          <DialogTitle>Choose the {convertToLabel(category)} types</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <VehicleTypesGridSkelton count={5} />
        ) : (
          <ScrollArea className="h-fit max-h-[80vh] w-[95%] overflow-hidden rounded-2xl pb-8">
            <div className="flex-center flex-wrap gap-4">
              {vehicleTypes.map((type) => (
                <Link
                  href={`/${state}/listing?category=${category}&vehicleTypes=${type.value}`}
                  key={type.typeId}
                  className="flex h-[6rem] w-[8rem] cursor-pointer flex-col items-center justify-start rounded-[1rem] p-[0.2rem] shadow-[2px_2px_6px_rgba(0,0,0,0.8)] transition-all duration-200 ease-out hover:scale-105"
                  target="_blank"
                >
                  <div className="mt-[0.7rem] flex h-[60%] w-[80%] max-w-[80%] flex-col items-center justify-center text-center">
                    <img
                      width={100}
                      height={100}
                      src={`${baseAssetsUrl}/icons/vehicle-types/${category}/${type.value}.webp`}
                      alt={`${type.name} Icon`}
                      className="h-[90%] max-h-[90%] w-[90%] max-w-[90%] object-contain object-center"
                    />
                  </div>
                  <p className="m-0 line-clamp-1 max-w-[95%] whitespace-nowrap p-0 text-center text-[0.8rem]">
                    {type.name}
                  </p>
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
