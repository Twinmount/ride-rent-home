import { formatAndSortPeriods } from "@/helpers";

type PeriodType = "hour" | "day" | "week" | "month";

type RentalPeriodProps = {
  selectedPeriod: PeriodType | null; // Allow null
  setSelectedPeriod: (period: PeriodType) => void;
  availablePeriods: PeriodType[];
};

export default function RentalPeriod({
  selectedPeriod,
  setSelectedPeriod,
  availablePeriods,
}: RentalPeriodProps) {
  if (availablePeriods.length === 0) return null;

  const formattedPeriods = formatAndSortPeriods(availablePeriods);

  return (
    <div className="flex justify-center gap-2 px-4 py-2">
      {formattedPeriods.map(({ key, label }) => (
        <div
          key={key}
          onClick={() => setSelectedPeriod(key)}
          className={`cursor-pointer rounded-[0.4rem] px-3 py-1 text-sm ${
            selectedPeriod === key
              ? "bg-yellow text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
