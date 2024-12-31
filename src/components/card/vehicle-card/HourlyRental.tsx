export default function HourlyRental({ enabled }: { enabled?: boolean }) {
  if (!enabled) {
    return null;
  }

  return (
    <div className="absolute right-2 top-2 inline-flex py-[0.3rem] border border-slate-700 items-center justify-center rounded-[0.5rem] shadow bg-slate-900 bg-[length:200%_100%] px-2 font-medium text-yellow-300 transition-colors focus:outline-none text-xs text-yellow">
      Hourly Rental
    </div>
  );
}
