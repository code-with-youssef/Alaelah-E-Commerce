"use client";

import { useTranslations } from 'next-intl';

interface WalletSectionProps {
  balance: number;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  currency?: string;
}

export function WalletSection({
  balance,
  enabled,
  onToggle,
  currency = "EGP",
}: WalletSectionProps) {
  const t = useTranslations('checkout');
  
  return (
    <section className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Wallet icon */}
          <svg
            className="w-5 h-5"
            style={{ color: "var(--color-text-muted)" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6Z" />
            <path d="M20 12H4" /><circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
          >
            {t('wallet')} - {currency} {balance.toFixed(0)}
          </span>
        </div>

        {/* Toggle switch */}
        <button
          onClick={() => onToggle(!enabled)}
          role="switch"
          aria-checked={enabled}
          aria-label={t('useWalletBalance')}
          className="relative w-12 h-6 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: enabled ? "var(--color-primary)" : "var(--color-bg-muted)",
          }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
            style={{ transform: enabled ? "translateX(24px)" : "translateX(0)" }}
          />
        </button>
      </div>
    </section>
  );
}