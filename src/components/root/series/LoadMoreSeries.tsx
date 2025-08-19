// "use client";

// import { fetchVehicleSeriesData } from "@/app/(root)/[country]/[state]/rent/[brand]/[series]/action";
// import LoadingWheel from "@/components/common/LoadingWheel";
// import VehicleGridWrapper from "@/components/common/VehicleGridWrapper";
// import { useState, useEffect, type JSX } from "react";
// import { useInView } from "react-intersection-observer";

// // page starts from 2 and onwards
// let page = 2;

// type LoadMoreSeriesProps = {
//   state: string;
//   series: string;
//   country: string;
// };

// export default function LoadMoreSeries({ state, series, country }: LoadMoreSeriesProps) {
//   const { ref, inView } = useInView();
//   const [data, setData] = useState<JSX.Element[]>([]);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch data when in view
//   useEffect(() => {
//     if (inView && hasMore) {
//       fetchVehicleSeriesData({ page, state, vehicleSeries: series, country }).then(
//         (response) => {
//           if (!response.hasMore) {
//             setHasMore(false);
//           } else {
//             setData((prevData) => [...prevData, ...response.vehicles]); // Spread properly
//             page++; // Increment page safely
//           }
//         },
//       );
//     }
//   }, [inView, hasMore, page]);

//   return (
//     <>
//       <VehicleGridWrapper classNames="mb-4">
//         {data}
//       </VehicleGridWrapper>

//       <div>
//         {hasMore ? (
//           <div ref={ref} className="flex-center h-12">
//             <LoadingWheel />
//           </div>
//         ) : (
//           <div className="flex-center h-12">You’ve reached the end!</div>
//         )}
//       </div>
//     </>
//   );
// }
