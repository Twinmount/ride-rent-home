'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

interface PriceRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: 'top' | 'bottom';
  label?: (value: number | undefined) => React.ReactNode;
}

const PriceRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  PriceRangeSliderProps
>(({ className, label, labelPosition = 'top', disabled, ...props }, ref) => {
  const initialValue = Array.isArray(props.value)
    ? props.value
    : [props.min, props.max];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
        <SliderPrimitive.Range
          className={`absolute h-full ${disabled ? 'bg-gray-200' : 'bg-yellow'}`}
        />
      </SliderPrimitive.Track>
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb
            className={`relative block h-6 w-6 rounded-full border-2 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-gray-400 disabled:opacity-50 ${disabled ? 'cursor-default border-gray-200' : 'cursor-grab border-yellow'}`}
          >
            {label && (
              <span
                className={cn(
                  'absolute flex w-full justify-center',
                  labelPosition === 'top' && '-top-7',
                  labelPosition === 'bottom' && 'top-4'
                )}
              >
                {label(value)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});
PriceRangeSlider.displayName = 'PriceRangeSlider';

export { PriceRangeSlider };
