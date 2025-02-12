"use client";

import { fetchVehicleSeriesData } from "@/app/(root)/[state]/rent/[brand]/[series]/action";
import LoadingWheel from "@/components/common/LoadingWheel";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

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
  useEffect(() => {
    if (inView && hasMore) {
      fetchVehicleSeriesData({ page, state, vehicleSeries: series }).then(
        (response) => {
          if (!response.hasMore || page >= response.totalNumberOfPages) {
            setHasMore(false);
          } else {
            setData((prevData) => [...prevData, response.vehicles]);
            page++;
          }
        },
      );
    }
  }, [inView, hasMore]);

  return (
    <>
      <section>{data}</section>
      <section>
        {hasMore ? (
          <div ref={ref} className="flex-center h-24">
            <LoadingWheel />
          </div>
        ) : (
          <div className="flex-center h-24">You’ve reached the end!</div>
        )}
      </section>
    </>
  );
}
