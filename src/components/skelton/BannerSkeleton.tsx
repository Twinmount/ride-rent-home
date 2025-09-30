export default function BannerSkeleton() {
  return (
    <div
      className="modern-banner-slider absolute inset-0 w-full min-w-full animate-pulse bg-gray-200"
      aria-label="Loading banner content"
    >
      <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

      {/* Skeleton dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-3 w-3 rounded-full bg-gray-400/60" />
        ))}
      </div>
    </div>
  );
}
