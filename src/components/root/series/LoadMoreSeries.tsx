"use client";

import { fetchVehicleSeriesData } from "@/app/(root)/[state]/rent/[brand]/[series]/action";
import LoadingWheel from "@/components/common/LoadingWheel";
import VehicleListingsGridWrapper from "@/components/common/VehicleListingsGridWrapper";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

// page starts from 2 and onwards
let page = 2;

type LoadMoreSeriesProps = {
  state: string;
  series: string;
};

export default function LoadMoreSeries({ state, series }: LoadMoreSeriesProps) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<JSX.Element[]>([]);
  const [hasMore, setHasMore] = useState(true);

  //  fetch data based on the scroll

  // Fetch data when in view
  useEffect(() => {
    if (inView && hasMore) {
      fetchVehicleSeriesData({ page, state, vehicleSeries: series }).then(
        (response) => {
          if (!response.hasMore) {
            setHasMore(false);
          } else {
            setData((prevData) => [...prevData, ...response.vehicles]); // Spread properly
            page++; // Increment page safely
          }
        },
      );
    }
  }, [inView, hasMore, page]);

  return (
    <>
      <VehicleListingsGridWrapper classNames="mb-4">
        {data}
      </VehicleListingsGridWrapper>

      <div>
        {hasMore ? (
          <div ref={ref} className="flex-center h-12">
            <LoadingWheel />
          </div>
        ) : (
          <div className="flex-center h-12">You’ve reached the end!</div>
        )}
      </div>
    </>
  );
}
