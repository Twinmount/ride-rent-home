"use client";

import { useState, useEffect, useCallback } from "react";

export default function MinAndMaxPrice({
  min,
  max,
  onValueChange,
  priceRangeMin,
  priceRangeMax,
}: {
  min: number;
  max: number;
  onValueChange: (values: [number, number]) => void;
  priceRangeMin: number;
  priceRangeMax: number;
}) {
  const [minInput, setMinInput] = useState(min.toString());
  const [maxInput, setMaxInput] = useState(max.toString());
  const [minError, setMinError] = useState(false);
  const [maxError, setMaxError] = useState(false);

  // Update input values when slider changes
  useEffect(() => {
    setMinInput(min.toString());
    setMaxInput(max.toString());
  }, [min, max]);

  const validateAndUpdate = useCallback(
    (newMin: number, newMax: number) => {
      let validMin = newMin;
      let validMax = newMax;
      let hasMinError = false;
      let hasMaxError = false;

      // Validate minimum
      if (newMin < priceRangeMin) {
        validMin = priceRangeMin;
        hasMinError = true;
      } else if (newMin >= newMax) {
        validMin = newMax - 10; // Ensure min is always less than max
        hasMinError = true;
      }

      // Validate maximum
      if (newMax > priceRangeMax) {
        validMax = priceRangeMax;
        hasMaxError = true;
      } else if (newMax <= newMin) {
        validMax = newMin + 10; // Ensure max is always greater than min
        hasMaxError = true;
      }

      setMinError(hasMinError);
      setMaxError(hasMaxError);

      // Only update if values changed
      if (validMin !== min || validMax !== max) {
        onValueChange([validMin, validMax]);
      }

      return { validMin, validMax };
    },
    [min, max, priceRangeMin, priceRangeMax, onValueChange]
  );

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]/g, ""); // Only allow digits
      setMinInput(value);
    },
    []
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]/g, ""); // Only allow digits
      setMaxInput(value);
    },
    []
  );

  const handleMinBlur = useCallback(() => {
    const numValue = parseInt(minInput) || priceRangeMin;
    const { validMin } = validateAndUpdate(numValue, max);
    setMinInput(validMin.toString());
  }, [minInput, max, priceRangeMin, validateAndUpdate]);

  const handleMaxBlur = useCallback(() => {
    const numValue = parseInt(maxInput) || priceRangeMax;
    const { validMax } = validateAndUpdate(min, numValue);
    setMaxInput(validMax.toString());
  }, [maxInput, min, priceRangeMax, validateAndUpdate]);

  const handleMinKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    },
    []
  );

  const handleMaxKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    },
    []
  );

  return (
    <div className="flex justify-between px-10 py-4">
      <div className="flex-center w-fit flex-col gap-y-1 text-gray-600">
        <span className="text-sm font-normal">Minimum</span>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">
            AED
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={minInput}
            onChange={handleMinChange}
            onBlur={handleMinBlur}
            onKeyDown={handleMinKeyDown}
            className={`w-28 rounded-2xl border py-2 pl-12 pr-3 text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow/50 ${
              minError
                ? "border-red-300 bg-red-50"
                : "border-slate-300 bg-white hover:border-slate-400"
            }`}
            placeholder="0"
            aria-label="Minimum price"
          />
        </div>
      </div>

      <div className="flex-center w-fit flex-col gap-y-1 text-gray-600">
        <span className="text-sm font-normal">Maximum</span>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">
            AED
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={maxInput}
            onChange={handleMaxChange}
            onBlur={handleMaxBlur}
            onKeyDown={handleMaxKeyDown}
            className={`w-28 rounded-2xl border py-2 pl-12 pr-3 text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow/50 ${
              maxError
                ? "border-red-300 bg-red-50"
                : "border-slate-300 bg-white hover:border-slate-400"
            }`}
            placeholder="0"
            aria-label="Maximum price"
          />
        </div>
      </div>
    </div>
  );
}
