import { formatAndSortPeriods } from '@/helpers';

type PeriodType = 'hour' | 'day' | 'week' | 'month';

type RentalPeriodProps = {
  selectedPeriod: PeriodType | null; // Allow null
  setSelectedPeriod: (period: PeriodType) => void;
  availablePeriods: PeriodType[];
  isListingPage?: boolean;
};

export default function RentalPeriod({
  selectedPeriod,
  setSelectedPeriod,
  availablePeriods,
  isListingPage = false,
}: RentalPeriodProps) {
  if (availablePeriods.length === 0) return null;

  const formattedPeriods = formatAndSortPeriods(availablePeriods);

  // Set default to 'day' if no period is selected and 'day' is available
  const currentSelectedPeriod =
    selectedPeriod ||
    (availablePeriods.includes("day") ? "day" : availablePeriods[0]);

  const boxClassNames = isListingPage
    ? ` px-2 py-1 text-sm`
    : ` px-3 py-1 text-sm`;

  return (
    <div className="flex w-full max-w-full justify-center gap-2 px-4 py-2">
      {formattedPeriods.map(({ key, label }) => (
        <div
          key={key}
          onClick={() => setSelectedPeriod(key)}
          role="button"
          tabIndex={0}
          aria-label={`Select ${label} rental period`}
          aria-pressed={selectedPeriod === key}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedPeriod(key);
            }
          }}
          className={`flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-[0.4rem] focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2 ${
            selectedPeriod === key
              ? "bg-yellow text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } ${boxClassNames}`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
