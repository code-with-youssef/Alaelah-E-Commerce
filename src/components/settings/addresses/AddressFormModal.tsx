"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import AddressForm, { AddressFormProps } from "./AdressForm";


interface AddressFormModalProps extends AddressFormProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export function AddressFormModal({
  open,
  onClose,
  title,
  ...formProps
}: AddressFormModalProps) {
  const t = useTranslations("settings");
  const isEdit = !!formProps.addressId;
  const heading = title ?? (isEdit ? t("editAddress") : t("addNewAddress"));

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    // ── Backdrop ──────────────────────────────────────────────
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center md:justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/*
        Mobile  → slides up from bottom (bottom sheet)
        Desktop → centered card with max-width
      */}
      <div
        className="
          w-full max-h-[92dvh] flex flex-col overflow-hidden
          rounded-t-3xl
          md:rounded-3xl md:w-full md:max-w-xl md:max-h-[90vh]
        "
        style={{
          backgroundColor: "var(--color-bg)",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Drag handle — visible on mobile only */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-2.5 w-10 h-1 rounded-full md:hidden"
            style={{ backgroundColor: "var(--color-border)" }}
          />

          <h2
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            {heading}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-all"
            style={{
              backgroundColor: "var(--color-bg-subtle)",
              color: "var(--color-text-muted)",
            }}
            aria-label={t("close")}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable form body ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <AddressForm
            {...formProps}
            onSaved={() => {
              formProps.onSaved();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}