import { SlidersHorizontal } from "lucide-react";

export default function PriceFilterLoadingSkelton({
  isMobileNav,
}: {
  isMobileNav: boolean;
}) {
  if (isMobileNav) {
    return <SlidersHorizontal width={20} />;
  }
  return (
    <div
      className={`flex-center border} h-12 cursor-default gap-2 rounded-[0.5em] border-gray-300 px-3 py-1 text-sm font-semibold text-gray-500`}
    >
      <SlidersHorizontal width={15} />
      Price
    </div>
  );
}
