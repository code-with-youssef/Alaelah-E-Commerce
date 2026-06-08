"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Slider } from "./Slider";

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
}

const PRICE_CONFIG = {
  min: 0,
  max: 10000,
  step: 100,
};

export function PriceFilter({ minPrice, maxPrice, onPriceChange }: PriceFilterProps) {
  const t = useTranslations("product");
  const [isExpanded, setIsExpanded] = useState(true);
  const [localMin, setLocalMin] = useState(minPrice || "");
  const [localMax, setLocalMax] = useState(maxPrice || "");

  // ✅ Fix 1: sync local input state whenever parent clears or changes price filters
  useEffect(() => {
    setLocalMin(minPrice || "");
    setLocalMax(maxPrice || "");
  }, [minPrice, maxPrice]);

  const sliderMin = minPrice ? Number(minPrice) : PRICE_CONFIG.min;
  const sliderMax = maxPrice ? Number(maxPrice) : PRICE_CONFIG.max;

  const handleSliderChange = (values: number[]) => {
    const [newMin, newMax] = values;
    setLocalMin(newMin.toString());
    setLocalMax(newMax.toString());
    onPriceChange(newMin.toString(), newMax.toString());
  };

  const handleInputChange = (type: "min" | "max", value: string) => {
    if (type === "min") {
      setLocalMin(value);
      onPriceChange(value, localMax);
    } else {
      setLocalMax(value);
      onPriceChange(localMin, value);
    }
  };

  const priceError =
    localMin !== "" &&
    localMax !== "" &&
    Number(localMin) > Number(localMax);

  return (
    <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-4 transition-colors hover:bg-subtle"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {t("filterPrice")}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
        ) : (
          <ChevronDownIcon className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mb-6">
            <Slider
              min={PRICE_CONFIG.min}
              max={PRICE_CONFIG.max}
              step={PRICE_CONFIG.step}
              value={[sliderMin, sliderMax]}
              onValueChange={handleSliderChange}
              className="mb-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label
                className="text-xs mb-1 block"
                style={{ color: "var(--color-text-placeholder)" }}
              >
                {t("filterMinPrice")}
              </label>
              <div className="relative">
           
                <input
                  type="number"
                  min={PRICE_CONFIG.min}
                  step={PRICE_CONFIG.step}
                  placeholder="0"
                  value={localMin}
                  onChange={(e) => handleInputChange("min", e.target.value)}
                  className="input"
                  style={{
                    paddingLeft: "1.75rem",
                    fontSize: "0.875rem",
                    borderColor: priceError ? "var(--color-error)" : undefined,
                  }}
                />
              </div>
            </div>

            <span
              className="mt-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              —
            </span>

            <div className="flex-1">
              <label
                className="text-xs mb-1 block"
                style={{ color: "var(--color-text-placeholder)" }}
              >
                {t("filterMaxPrice")}
              </label>
              <div className="relative">

                <input
                  type="number"
                  min={PRICE_CONFIG.min}
                  step={PRICE_CONFIG.step}
                  placeholder="∞"
                  value={localMax}
                  onChange={(e) => handleInputChange("max", e.target.value)}
                  className="input"
                  style={{
                    paddingLeft: "1.75rem",
                    fontSize: "0.875rem",
                    borderColor: priceError ? "var(--color-error)" : undefined,
                  }}
                />
              </div>
            </div>
          </div>

          {priceError && (
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--color-error)" }}>
              <span>⚠️</span>
              {t("filterPriceError")}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: "Under 50", min: 0, max: 50 },
              { label: "50 - 100", min: 50, max: 100 },
              { label: "100 - 500", min: 100, max: 500 },
              { label: "500+", min: 500, max: PRICE_CONFIG.max },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  setLocalMin(range.min.toString());
                  setLocalMax(range.max.toString());
                  onPriceChange(range.min.toString(), range.max.toString());
                }}
                className="text-xs px-3 py-1 rounded-full border transition-colors"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-primary)";
                  e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}