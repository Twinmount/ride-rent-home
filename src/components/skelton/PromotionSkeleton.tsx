export default function PromotionSkeleton() {
  return (
    <section className="no-global-padding relative mb-5 h-auto overflow-hidden py-10">
      <div
        className="absolute inset-0 scale-110"
        style={{ backgroundColor: "#1a1a1a" }}
      />

      <div className="relative z-10">
        <div className="my-8 flex w-full flex-col gap-y-3 text-center">
          <div className="mx-auto h-8 w-64 animate-pulse rounded bg-white/20" />
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-white/10" />
        </div>

        <div className="flex-center mx-auto w-full flex-wrap gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[7.5rem] w-[10.34rem] animate-pulse rounded-[0.5rem] bg-white/10 md:h-[14rem] md:w-[16rem] lg:h-[16rem] lg:w-[18.5rem]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
