"use client";

import { useEffect, useRef } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "primary",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

  // Use translated defaults if labels not provided
  const finalConfirmLabel = confirmLabel ?? t("confirmDialog.confirm");
  const finalCancelLabel = cancelLabel ?? t("confirmDialog.cancel");
  const loadingText = t("confirmDialog.pleaseWait");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const confirmBg =
    variant === "danger" ? "var(--color-error)" : "var(--color-primary)";

  return (
    // Backdrop
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onCancel();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    >
      {/* Sheet */}
      <div
        className="w-full sm:max-w-sm rounded-3xl p-6 flex flex-col gap-5"
        style={{
          backgroundColor: "var(--color-bg)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
      >
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          {variant === "danger" && (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(239,68,68,0.10)" }}
            >
              <ExclamationTriangleIcon
                className="w-7 h-7"
                style={{ color: "var(--color-error)" }}
                strokeWidth={1.8}
              />
            </div>
          )}

          <h2
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {title}
          </h2>

          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--color-text-muted)",
            }}
          >
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: confirmBg,
              fontFamily: "var(--font-display)",
            }}
          >
            {isLoading ? loadingText : finalConfirmLabel}
          </button>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-70 active:scale-[0.98] disabled:opacity-50"
            style={{
              backgroundColor: "var(--color-bg-subtle)",
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              border: "1.5px solid var(--color-border)",
            }}
          >
            {finalCancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}