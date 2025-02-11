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
  allowUncheck?: boolean;
};

const FilterAccordionContent: FC<FilterAccordionContentProps> = ({
  options,
  selected,
  onChange,
  isMultipleChoice = true,
  allowUncheck = true,
}) => {
  const handleCheckboxChange = (value: string) => {
    if (isMultipleChoice) {
      // Toggle the value in the selected array for multiple choice
      onChange(value);
    } else {
      // for single selection, if already selected, uncheck only if allowUncheck is true
      if (selected === value && allowUncheck) {
        onChange(""); // Uncheck
      } else if (selected !== value) {
        onChange(value); // Select new value
      }
    }
  };

  if (options.length === 0) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col pl-4">
      {options.map((option) => (
        <div
          key={option.value}
          className="mt-2 flex items-center justify-start gap-x-1"
        >
          <Checkbox
            id={option.value}
            checked={
              isMultipleChoice
                ? (selected as string[]).includes(option.value)
                : selected === option.value
            }
            onCheckedChange={() => handleCheckboxChange(option.value)}
            className="!rounded-sm bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow data-[state=checked]:!text-white"
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
