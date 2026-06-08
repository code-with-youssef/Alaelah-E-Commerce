"use client";

import { useTranslations } from "next-intl";
interface CartPointsBannerProps {
  points: number;
}

export function CartPointsBanner({ points }: CartPointsBannerProps) {
  const t = useTranslations("cart");

  return (
    <div
      className="flex items-center gap-3 rounded-3xl px-4 py-3"
      style={{ backgroundColor: "var(--color-primary-light)" }}
    >
      {/* Coin icon */}
      <div
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full font-bold text-sm"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "#fff",
          fontFamily: "var(--font-display)",
        }}
      >
        S
      </div>

      <p
        className="text-sm leading-snug"
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--color-primary)",
        }}
      >
        {t("pointsBanner.earnUpTo")}{" "}
        <span
          className="font-bold text-base"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {points.toLocaleString()}
        </span>{" "}
        {t("pointsBanner.pointsWithItems")}
      </p>
    </div>
  );
}
