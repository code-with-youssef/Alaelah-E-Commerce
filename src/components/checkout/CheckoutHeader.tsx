"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface CheckoutHeaderProps {
  onBack?: () => void;
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  const router = useRouter();
  const t = useTranslations('checkout');

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 md:hidden"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <button
        onClick={handleBack}
        className="w-9 h-9 flex items-center justify-center rounded-full -ml-1"
        style={{ color: "var(--color-primary)" }}
        aria-label={t('goBack')}
      >
        <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <h1
        className="text-base font-semibold absolute left-1/2 -translate-x-1/2"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
      >
        {t('checkout')}
      </h1>

      {/* Spacer to balance the back button */}
      <div className="w-9" />
    </header>
  );
}