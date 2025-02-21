"use client";

import { fetchVehicleHomeGridData } from "@/app/(root)/[state]/[category]/action";
import LoadingWheel from "@/components/common/LoadingWheel";
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
      <section>{data}</section>
      <section>
        {!loaded ? (
          <div ref={ref} className="flex-center h-12">
            <LoadingWheel />
          </div>
        ) : null}
      </section>
    </>
  );
}
