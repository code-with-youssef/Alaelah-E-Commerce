"use client";

import { forwardRef } from "react";

interface SettingsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export const SettingsInput = forwardRef<HTMLInputElement, SettingsInputProps>(
  ({ label, hint, error, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            border: `1.5px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
            backgroundColor: "var(--color-bg)",
            transition: "border-color 150ms ease",
          }}
        >
          {/* Floating label */}
          {label && (
            <label
              className="block text-xs font-semibold pt-3 px-4 pb-0"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-primary)",
              }}
            >
              {label}
            </label>
          )}

          <div className="flex items-center">
            <input
              ref={ref}
              className={`flex-1 bg-transparent outline-none text-sm font-medium ${label ? "pt-1 pb-3 px-4" : "py-4 px-4"} ${className}`}
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-text)",
              }}
              {...props}
            />
            {rightIcon && (
              <div className="pr-2 flex items-center" style={{ color: "var(--color-text-muted)" }}>
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {hint && !error && (
          <p
            className="text-xs mt-1.5 px-1"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {hint}
          </p>
        )}
        {error && (
          <p
            className="text-xs mt-1.5 px-1"
            style={{ color: "var(--color-error)", fontFamily: "var(--font-sans)" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

SettingsInput.displayName = "SettingsInput";