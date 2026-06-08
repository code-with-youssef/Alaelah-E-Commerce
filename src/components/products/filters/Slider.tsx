// components/ui/Slider.tsx
"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  className?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className = "",
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={`relative flex items-center select-none touch-none w-full h-5 ${className}`}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onValueChange}
    >
      <SliderPrimitive.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-1">
        <SliderPrimitive.Range className="absolute bg-primary rounded-full h-full" />
      </SliderPrimitive.Track>
      {value.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block w-4 h-4 bg-white dark:bg-gray-800 shadow-md rounded-full
                   border-2 border-primary hover:scale-110 transition-transform
                   focus:outline-none focus:ring-2 focus:ring-primary/50
                   cursor-pointer"
        />
      ))}
    </SliderPrimitive.Root>
  );
}