// src/components/home/location/LocationPickerModal.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "@/src/contexts/LocationContext";
import { MapPickerValue } from "../../common/MapPicker";
import { MapStep } from "../../common/MapStep";

function getLocale() {
  if (typeof window === "undefined") return "en";
  const seg = window.location.pathname.split("/")[1];
  return seg === "eg" ? "eg" : "en";
}

const STRINGS = {
  en: {
    title: "Choose your location",
    subtitle: "We'll use this to show you the products available near you.",
    selectedLocation: "Selected location",
    dragPinPrompt: "Drag the pin or tap the map",
    nextButton: "Next",
  },
  eg: {
    title: "اختر موقعك",
    subtitle: "سنستخدم هذا لعرض المنتجات المتاحة بالقرب منك.",
    selectedLocation: "الموقع المحدد",
    dragPinPrompt: "اسحب الدبوس أو انقر على الخريطة",
    nextButton: "التالي",
  },
};

export function LocationPickerModal() {
  const { needsLocationPick, confirmLocation } = useLocation();
  const [pickedValue, setPickedValue] = useState<MapPickerValue | null>(null);

  useEffect(() => {
    if (needsLocationPick) setPickedValue(null);
  }, [needsLocationPick]);

  const handleNext = useCallback(async () => {
    if (!pickedValue) return;
    // Pass both coords AND the already-resolved address string —
    // confirmLocation will set cityName directly without re-geocoding
    await confirmLocation(pickedValue.coords, pickedValue.address);
  }, [pickedValue, confirmLocation]);

  if (!needsLocationPick) return null;

  const s = STRINGS[getLocale()];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-bg, #fff)",
      }}
    >
      <div
        className="px-4 shrink-0"
        style={{
          paddingTop: "calc(1rem + env(safe-area-inset-top))",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <h1 className="text-xl font-bold" style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}>
          {s.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>
          {s.subtitle}
        </p>
      </div>

      <div
        key={needsLocationPick ? "map-open" : "map-closed"}
        style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <MapStep
          pickedValue={pickedValue}
          onMapChange={setPickedValue}
          onNext={handleNext}
          labels={{
            selectedLocation: s.selectedLocation,
            dragPinPrompt: s.dragPinPrompt,
            nextButton: s.nextButton,
          }}
        />
      </div>
    </div>
  );
}