"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/src/types/products/product";
import { getWeightLabel } from "@/src/utils/GetWeightLabel";

// ── Icons ─────────────────────────────────────────────────────

function IconCategory() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 8h10M7 12h6" strokeLinecap="round" />
    </svg>
  );
}
function IconBrand() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12c0-2 1.5-4 4-4s4 2 4 4" strokeLinecap="round" />
      <path d="M12 8v1M12 16v-4" strokeLinecap="round" />
    </svg>
  );
}
function IconVariant() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        d="M6 3c0 0-2 2-2 6s2 6 2 6h12s2-2 2-6-2-6-2-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 15v6M18 15v6" strokeLinecap="round" />
    </svg>
  );
}
function IconUnit() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 3v3M18 3v3" strokeLinecap="round" />
    </svg>
  );
}
function IconBarcode() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
    </svg>
  );
}

// ── Detail row ────────────────────────────────────────────────

interface DetailRowProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

function DetailRow({ icon, title, content }: DetailRowProps) {
  return (
    <div
      className="py-5"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ color: "var(--color-text)" }}>{icon}</span>
        <h3
          className="text-base font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {content}
      </p>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────

interface DetailsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailsModal({ product, isOpen, onClose }: DetailsModalProps) {
  const t = useTranslations("singleProduct");

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Build rows from real Product fields
  const categoryName = product.category;
  const brandName = product.brand;
  const variantLabel = getWeightLabel(product.variant);
  const unitLabel = product.unit;

  const hasDetails = categoryName || brandName || variantLabel || unitLabel;

  if (!hasDetails) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.45)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("productDetailsDialog")}
        className="fixed z-70 flex flex-col overflow-hidden transition-all duration-300 ease-out
                   bottom-0 left-0 right-0 max-h-[90dvh] rounded-t-3xl
                   md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                   md:w-full md:max-w-lg md:max-h-[80vh] md:rounded-3xl"
        style={{
          backgroundColor: "var(--color-bg)",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.18)",
          transform: isOpen ? undefined : "translateY(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Drag pill (mobile only) */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full md:hidden"
            style={{
              width: "36px",
              height: "4px",
              backgroundColor: "var(--color-border)",
            }}
          />

          <button
            onClick={onClose}
            aria-label={t("goBack")}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{ color: "var(--color-primary)" }}
          >
            <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <span
            className="text-base font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {t("productDetails")}
          </span>

          <button
            onClick={onClose}
            aria-label={t("close")}
            className="w-9 h-9 items-center justify-center rounded-full transition-all active:scale-90 md:flex hidden"
            style={{ color: "var(--color-text-muted)" }}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Spacer to center title on mobile */}
          <div className="w-9 md:hidden" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {categoryName && (
            <DetailRow
              icon={<IconCategory />}
              title={t("category")}
              content={categoryName}
            />
          )}
          {brandName && (
            <DetailRow
              icon={<IconBrand />}
              title={t("brand")}
              content={brandName}
            />
          )}
          {variantLabel && (
            <DetailRow
              icon={<IconVariant />}
              title={t("variant")}
              content={variantLabel}
            />
          )}
          {unitLabel && (
            <DetailRow
              icon={<IconUnit />}
              title={t("unit")}
              content={unitLabel}
            />
          )}
        </div>
      </div>
    </>
  );
}