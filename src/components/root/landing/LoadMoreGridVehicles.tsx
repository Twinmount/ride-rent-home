"use client";

import { fetchVehicleHomeGridData } from "@/app/(root)/[state]/[category]/action";
import LoadingWheel from "@/components/common/LoadingWheel";
import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type LoadMoreGridProps = {
  state: string;
  category: string;
  vehicleType?: string;
};

export default function LoadMoreGridVehicles({
  state,
  category,
  vehicleType,
}: LoadMoreGridProps) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<JSX.Element[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch data when in view
  useEffect(() => {
    if (inView && !loaded) {
      fetchVehicleHomeGridData({ page: 2, state, category, vehicleType }).then(
        (response) => {
          setData(response.vehicles);
          setLoaded(true);
        },
      );
    }
  }, [inView, loaded]);

  return (
    <>
      <VehicleGridWrapper classNames="mb-4">{data}</VehicleGridWrapper>

      <div className="w-full">
        {!loaded ? (
          <div ref={ref} className="flex-center h-12 w-full">
            <LoadingWheel />
          </div>
        ) : null}
      </div>
    </>
  );
}
