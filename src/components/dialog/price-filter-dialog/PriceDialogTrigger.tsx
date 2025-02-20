import { SlidersHorizontal } from "lucide-react";

export default function PriceDialogTrigger({
  isMobileNav,
  isLoading,
  isDisabled = false,
}: {
  isMobileNav: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}) {
  return isMobileNav ? (
    <span>
      <SlidersHorizontal
        width={isMobileNav ? 20 : 15}
        className={`${isDisabled && "cursor-default text-gray-500"}`}
      />
    </span>
  ) : (
    <span
      className={`flex-center h-12 gap-2 rounded-[0.5em] border border-gray-300 px-3 py-1 text-sm font-semibold ${(isLoading || isDisabled) && "cursor-default text-gray-500"}`}
    >
      <SlidersHorizontal width={15} />
      Price
    </span>
  );
}
