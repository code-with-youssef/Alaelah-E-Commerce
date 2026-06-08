"use client";

import React, { useCallback } from "react";
import { MapPicker, type MapPickerValue } from "./MapPicker";
import { Coordinates } from "@/src/types/address/location";

interface MapStepProps {
  initialCoords?: Coordinates;
  pickedValue: MapPickerValue | null;
  onMapChange: (val: MapPickerValue) => void;
  onNext: () => void;
  // ─── i18n strings (caller provides them) ─────────────────────────────────
  labels?: {
    selectedLocation?: string;
    dragPinPrompt?: string;
    nextButton?: string;
  };
}

const DEFAULT_LABELS = {
  selectedLocation: "Selected location",
  dragPinPrompt: "Drag the pin or tap the map",
  nextButton: "Next",
};

export function MapStep({
  initialCoords,
  pickedValue,
  onMapChange,
  onNext,
  labels,
}: MapStepProps) {
  const t = { ...DEFAULT_LABELS, ...labels };

  const handleChange = useCallback(
    (val: MapPickerValue) => onMapChange(val),
    [onMapChange]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%" }}>
      {/* Selected address pill */}
      <div className="px-4 py-3 shrink-0">
        <div
          className="rounded-2xl px-4 py-3"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <p
            className="text-xs font-semibold mb-0.5"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {t.selectedLocation}
          </p>
          <p
            className="text-sm font-medium"
            style={{
              color: pickedValue ? "var(--color-text)" : "var(--color-text-muted)",
              fontFamily: "var(--font-sans)",
              wordBreak: "break-word",
            }}
          >
            {pickedValue?.address ?? t.dragPinPrompt}
          </p>
        </div>
      </div>

      {/* Map — fills remaining space */}
      <MapPicker
        initialCoords={initialCoords}
        onChange={handleChange}
        style={{ flex: 1, minHeight: 0 }}
      />

      {/* Next button */}
      <div
        className="px-4 pt-3 pb-4 shrink-0"
        style={{
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <button
          onClick={onNext}
          disabled={!pickedValue}
          className="w-full rounded-2xl py-4 text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
          style={{
            backgroundColor: "var(--color-primary)",
            fontFamily: "var(--font-display)",
          }}
          type="button"
        >
          {t.nextButton}
        </button>
      </div>
    </div>
  );
}