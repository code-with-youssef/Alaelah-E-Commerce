"use client";

import { useTranslations } from 'next-intl';
import { PaymentMethod } from "@/src/types/order/checkout";
import { BanknotesIcon } from "@heroicons/react/24/outline";

interface PaymentSectionProps {
  selected: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentSection({ selected, onChange }: PaymentSectionProps) {
  const t = useTranslations('checkout');
  
  return (
    <section className="py-5">
      <h2
        className="text-lg font-bold mb-4"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text)",
        }}
      >
        {t('payment')}
      </h2>

      <div className="flex flex-col gap-2">
        {/* Cash only */}
        <button
          onClick={() => onChange("cash")}
          className="w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-150"
          style={{
            border:
              selected === "cash"
                ? "2px solid var(--color-primary)"
                : "1.5px solid var(--color-border)",
            backgroundColor:
              selected === "cash"
                ? "var(--color-primary-light)"
                : "var(--color-bg)",
          }}
          aria-pressed={selected === "cash"}
        >
          <div className="flex items-center gap-3">
            <BanknotesIcon
              className="w-5 h-5 shrink-0"
              style={{
                color:
                  selected === "cash"
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
              }}
            />
            <span
              className="text-sm"
              style={{
                fontFamily: "var(--font-sans)",
                color:
                  selected === "cash"
                    ? "var(--color-primary)"
                    : "var(--color-text)",
                fontWeight: selected === "cash" ? 600 : 400,
              }}
            >
              {t('cashOnDelivery')}
            </span>
          </div>
          <RadioDot selected={selected === "cash"} />
        </button>
      </div>
    </section>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
      style={{
        borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
      }}
    >
      {selected && (
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: "var(--color-primary)" }}
        />
      )}
    </div>
  );
}