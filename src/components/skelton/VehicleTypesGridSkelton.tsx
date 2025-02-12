import { Skeleton } from "../ui/skeleton";

export default function VehicleTypesGridSkelton({
  count = 6,
}: {
  count: number;
}) {
  return (
    <div className="!grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <VehicleTypeSkelton key={index} />
        ))}
    </div>
  );
}

export function VehicleTypeSkelton() {
  return (
    <div
      className={`bottom-1 flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]`}
    >
      <Skeleton
        className={`flex h-[60%] w-full items-center justify-center rounded-[0.4rem] bg-gray-200`}
      />
      <Skeleton className={`mx-auto h-2 w-3/4 rounded-[0.3rem] bg-gray-200`} />
    </div>
  );
}
