export default function MinAndMaxPrice({
  min,
  max,
}: {
  min: number;
  max: number;
}) {
  return (
    <div className="flex justify-between px-10 py-4">
      <div className="flex-center w-fit flex-col gap-y-1 text-gray-600">
        <span className="text-sm font-normal">Minimum </span>
        <span className="flex-center flex-center w-28 rounded-2xl border border-slate-300 py-2 font-medium">
          AED {min}
        </span>
      </div>
      <div className="flex-center w-fit flex-col gap-y-1 text-gray-600">
        <span className="text-sm font-normal">Maximum </span>
        <span className="flex-center flex-center w-28 rounded-2xl border border-slate-300 py-2 font-medium">
          AED {max}
        </span>
      </div>
    </div>
  );
}
