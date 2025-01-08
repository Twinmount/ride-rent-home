"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVehicleTypesByValue } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
import { VehicleTypeType } from "@/types";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VehicleTypeSkelton } from "@/components/skelton/VehicleTypesGridSkelton";
import { convertToLabel, singularizeType } from "@/helpers";

export default function VehicleTypesDialog() {
  const { state, category } = useStateAndCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category],
    queryFn: () => fetchVehicleTypesByValue(category),
    enabled: !!category,
  });

  const vehicleTypes: VehicleTypeType[] = data?.result?.list || [];

  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  if (isLoading) return <VehicleTypeSkelton />;

  if (vehicleTypes.length === 0) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger disabled={isLoading}>
        <VehicleTypeTrigger
          category={category}
          vehicleTypes={vehicleTypes}
          baseAssetsUrl={baseAssetsUrl!}
          isDialogOpen={isDialogOpen}
        />
      </DialogTrigger>
      <DialogContent className="!max-h-fit !w-[80vw] overflow-hidden rounded-2xl bg-white !px-2 py-2">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Choose the {singularizeType(convertToLabel(category))} type
          </DialogTitle>
        </DialogHeader>
        <div className="flex-center mx-auto flex-wrap gap-3 pb-6">
          {vehicleTypes.map((type) => (
            <Link
              href={`/${state}/listing?category=${category}&vehicleTypes=${type.value}`}
              key={type.typeId}
              className="mx-auto flex h-[6rem] w-[8rem] cursor-pointer flex-col items-center justify-start rounded-[1rem] border p-[0.2rem] shadow transition-all duration-200 ease-out hover:scale-105"
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
              <span className="m-0 line-clamp-1 w-[7.5rem] max-w-[7.5rem] p-0 text-center text-[0.8rem]">
                {type.name}
              </span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VehicleTypeTrigger({
  category,
  vehicleTypes,
  baseAssetsUrl,
  isDialogOpen,
}: {
  category: string;
  vehicleTypes: VehicleTypeType[];
  baseAssetsUrl: string;
  isDialogOpen: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isDialogOpen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicleTypes.length);
    }, 4000); // Change type every 4 seconds

    return () => clearInterval(interval);
  }, [vehicleTypes, isDialogOpen]);

  if (vehicleTypes.length === 0) return null;

  return (
    <div className="relative flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]">
      <AnimatePresence>
        {vehicleTypes.map((type, index) =>
          index === currentIndex ? (
            <motion.div
              key={type.typeId}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <div className="flex h-[60%] w-full items-center justify-center rounded-[0.4rem] bg-gray-100">
                <img
                  src={`${baseAssetsUrl}/icons/vehicle-types/${category}/${type.value}.webp`}
                  alt={`${type.name} Icon`}
                  className="h-[90%] max-h-[90%] w-[90%] max-w-[90%] object-contain object-center"
                  width={40}
                  height={40}
                />
              </div>
              <span className="mt-1 line-clamp-1 w-full text-center text-[0.56rem] text-gray-600 lg:text-[0.65rem]">
                {type.name}
              </span>
            </motion.div>
          ) : null,
        )}
      </AnimatePresence>
    </div>
  );
}
