import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";

type Option = {
  label: string;
  value: string;
};

type FilterAccordionContentProps = {
  options: Option[];
  selected: string[] | string;
  onChange: (value: string) => void;
  isMultipleChoice?: boolean;
};

const FilterAccordionContent: FC<FilterAccordionContentProps> = ({
  options,
  selected,
  onChange,
  isMultipleChoice = true,
}) => {
  const handleCheckboxChange = (value: string) => {
    if (isMultipleChoice) {
      // Toggle the value in the selected array for multiple choice
      onChange(value);
    } else {
      // Replace the selected value for single choice
      if (selected !== value) {
        onChange(value);
      }
    }
  };

  if (options.length === 0) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <div
          key={option.value}
          className="flex items-center justify-start gap-x-1 mt-2"
        >
          <Checkbox
            id={option.value}
            checked={
              isMultipleChoice
                ? (selected as string[]).includes(option.value)
                : selected === option.value
            }
            onCheckedChange={() => handleCheckboxChange(option.value)}
            className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none !rounded-sm data-[state=checked]:!text-white"
          />
          <label htmlFor={option.value} className="">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default FilterAccordionContent;
