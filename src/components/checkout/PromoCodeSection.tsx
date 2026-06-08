"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { TagIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface PromoCodeSectionProps {
  promoCode: string;
  discount: number;
  onApply: (code: string) => Promise<{ discount: number; error?: string }>;
  onRemove: () => void;
  currency?: string;
}

export function PromoCodeSection({
  promoCode,
  discount,
  onApply,
  onRemove,
  currency = "EGP",
}: PromoCodeSectionProps) {
  const t = useTranslations('checkout');
  const [input, setInput] = useState(promoCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(!!promoCode);

  const handleApply = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await onApply(input.trim());
      if (result.error) {
        setError(result.error);
        setApplied(false);
      } else {
        setApplied(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setInput("");
    setApplied(false);
    setError(null);
    onRemove();
  };

  return (
    <section className="py-5">
      <div className="flex items-center gap-2 mb-3">
        <TagIcon className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {t('promoCode')}
        </h2>
        {applied && discount > 0 && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-delivery-bg)",
              color: "var(--color-delivery-text)",
              fontFamily: "var(--font-sans)",
            }}
          >
            -{currency} {discount}
          </span>
        )}
      </div>

      <div
        className="flex items-center px-4 rounded-2xl border transition-all duration-150 gap-3"
        style={{
          height: "52px",
          backgroundColor: "var(--color-bg)",
          borderColor: applied
            ? "var(--color-delivery-text)"
            : error
            ? "var(--color-error)"
            : "var(--color-border)",
          boxShadow: applied
            ? "0 0 0 3px rgba(22,163,74,0.08)"
            : error
            ? "0 0 0 3px rgba(239,68,68,0.08)"
            : "none",
        }}
      >
        <input
          type="text"
          placeholder={t('typePromoCode')}
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); setApplied(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleApply(); }}
          disabled={applied}
          className="flex-1 bg-transparent outline-none text-sm font-medium uppercase tracking-wider"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-text)",
          }}
          aria-label={t('promoCode')}
        />

        {applied ? (
          <div className="flex items-center gap-2 shrink-0">
            <CheckIcon className="w-4 h-4" style={{ color: "var(--color-delivery-text)" }} />
            <button
              onClick={handleRemove}
              className="text-xs font-semibold"
              style={{ color: "var(--color-error)", fontFamily: "var(--font-sans)" }}
            >
              {t('remove')}
            </button>
          </div>
        ) : (
          <button
            onClick={handleApply}
            disabled={!input.trim() || isLoading}
            className="text-sm font-bold shrink-0 transition-opacity disabled:opacity-40"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
          >
            {isLoading ? "…" : t('apply')}
          </button>
        )}
      </div>

      {error && (
        <p
          className="text-xs mt-2"
          style={{ color: "var(--color-error)", fontFamily: "var(--font-sans)" }}
        >
          {error}
        </p>
      )}
    </section>
  );
}