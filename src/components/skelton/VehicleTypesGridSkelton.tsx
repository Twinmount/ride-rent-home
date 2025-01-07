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
          <div key={index} className={`flex h-32 w-32 flex-col space-y-3`}>
            <Skeleton className={`h-28 w-full rounded-xl bg-gray-200`} />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-200" />
            </div>
          </div>
        ))}
    </div>
  );
}
