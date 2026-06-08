"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface SelectLocationClientProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onConfirm: (lat: number, lng: number, address: string) => Promise<void>;
}

export function SelectLocationClient({
  initialLat = 30.0444,
  initialLng = 31.2357,
  initialAddress = "Current location",
  onConfirm,
}: SelectLocationClientProps) {
  const t = useTranslations("settings");
  const router = useRouter();
  const [address, setAddress] = useState(initialAddress);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    await onConfirm(initialLat, initialLng, address);
    setConfirming(false);
    router.back();
  };

  return (
    <div className="flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header
        className="flex items-center justify-center px-4 py-3 relative"
        style={{
          backgroundColor: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full active:scale-90"
          style={{ color: "var(--color-primary)" }}
          aria-label={t("goBack")}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {t("selectDeliveryLocation")}
        </h1>
      </header>

      {/* Address pill */}
      <div className="px-4 py-3">
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>
            {t("currentLocationLabel")}
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>
            {address}
          </p>
        </div>
      </div>

      {/* Map area — in production replace with Google Maps / Mapbox */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: "300px" }}>
        {/* Placeholder map tiles */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#e8eaed",
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.6) 39px, rgba(255,255,255,0.6) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.6) 39px, rgba(255,255,255,0.6) 40px)
            `,
          }}
        >
          {/* Fake street labels for visual fidelity */}
          {[t("street5"), t("ahmedAbdRoba"), t("alGazaer"), t("elOrouba"), t("salamaShehato")].map((name, i) => (
            <span
              key={i}
              className="absolute text-[10px] select-none"
              style={{
                color: "#666",
                top: `${15 + i * 16}%`,
                left: `${10 + (i % 3) * 25}%`,
                transform: i % 2 === 0 ? "rotate(0deg)" : "rotate(90deg)",
                fontFamily: "sans-serif",
              }}
            >
              {name}
            </span>
          ))}
        </div>

        {/* Center pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            width="36"
            height="44"
            viewBox="0 0 36 44"
            fill="none"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))" }}
          >
            <path
              d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z"
              fill="var(--color-primary)"
            />
            <circle cx="18" cy="18" r="7" fill="white" />
          </svg>
        </div>

        {/* Recenter button */}
        <button
          className="absolute bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          style={{ backgroundColor: "var(--color-bg)" }}
          aria-label={t("recenterMap")}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-primary)" }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
          </svg>
        </button>

        {/* Google attribution */}
        <div
          className="absolute bottom-2 left-2 text-[10px] font-medium"
          style={{ color: "#555", fontFamily: "sans-serif" }}
        >
          Google
        </div>
      </div>

      {/* Confirm button */}
      <div
        className="p-4"
        style={{
          backgroundColor: "var(--color-bg)",
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
        }}
      >
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="w-full rounded-2xl py-4 text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-70"
          style={{
            backgroundColor: "var(--color-primary)",
            fontFamily: "var(--font-display)",
          }}
        >
          {confirming ? t("confirming") : t("confirmLocation")}
        </button>
      </div>
    </div>
  );
}