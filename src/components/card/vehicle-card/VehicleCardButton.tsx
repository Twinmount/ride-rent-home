type VehicleCardButtonProps = {
  children: React.ReactNode;
  layoutType: "carousel" | "grid";
};

export default function VehicleCardButton({
  children,
  layoutType,
}: VehicleCardButtonProps) {
  const className =
    layoutType === "carousel"
      ? "h-[1.8rem] w-[5rem] lg:h-[2rem] lg:w-[5.5rem] text-[0.6rem] lg:text-xs px-8"
      : "sm:w-[4.8rem] w-[5.6rem] h-[1.75rem] text-xs px-8";

  return (
    <div
      className={`flex-center cursor-pointer whitespace-nowrap rounded bg-slate-900 py-1 text-white transition-colors hover:bg-slate-800 ${className}`}
    >
      {children}
    </div>
  );
}
