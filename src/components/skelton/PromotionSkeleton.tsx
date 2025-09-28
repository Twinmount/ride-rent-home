export default function PromotionSkeleton() {
  return (
    <div className="w-full max-w-sm animate-pulse rounded-lg bg-gray-700 p-4 md:w-80">
      <div className="mb-4 h-32 rounded bg-gray-600" />
      <div className="space-y-3">
        <div className="h-4 rounded bg-gray-600" />
        <div className="h-4 w-3/4 rounded bg-gray-600" />
        <div className="flex justify-between">
          <div className="h-6 w-20 rounded bg-gray-600" />
          <div className="h-6 w-16 rounded bg-gray-600" />
        </div>
      </div>
    </div>
  );
}
