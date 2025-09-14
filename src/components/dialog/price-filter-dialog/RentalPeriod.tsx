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
          className={`cursor-pointer rounded-[0.4rem] ${
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