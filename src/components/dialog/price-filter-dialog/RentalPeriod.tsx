const rentalPeriods = [
  { label: "Hourly", value: "hour" },
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];

type PeriodType = "hour" | "day" | "week" | "month";

type RentalPeriodProps = {
  selectedPeriod: PeriodType;
  setSelectedPeriod: (period: PeriodType) => void;
};

export default function RentalPeriod({
  selectedPeriod,
  setSelectedPeriod,
}: RentalPeriodProps) {
  return (
    <div className="flex justify-center gap-2 px-4 py-2">
      {rentalPeriods.map((period) => (
        <div
          key={period.value}
          onClick={() => setSelectedPeriod(period.value as PeriodType)}
          className={`cursor-pointer rounded-[0.4rem] px-3 py-1 text-sm ${
            selectedPeriod === period.value
              ? "bg-yellow text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {period.label}
        </div>
      ))}
    </div>
  );
}
