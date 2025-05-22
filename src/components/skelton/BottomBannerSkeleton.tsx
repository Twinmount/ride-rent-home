import { Skeleton } from "../ui/skeleton";

export default function BottomBannerSkeleton() {
  return (
    <div className="wrapper my-4">
      <Skeleton className="mx-auto h-80 w-full rounded-xl bg-gray-300" />;
    </div>
  );
}
