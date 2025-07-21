function BannerSkeleton() {
  return (
    <div className="container relative mx-0 h-36 min-w-full rounded lg:h-[19rem]">
      <div className="absolute inset-0 h-full w-full animate-pulse rounded bg-gray-300" />
    </div>
  );
}

export default BannerSkeleton;
