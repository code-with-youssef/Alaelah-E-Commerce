"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface ComboboxOption {
  id: number;
  name: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: number | "";
  onChange: (id: number | "") => void;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  label: string;
  required?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  loading = false,
  error,
  label,
  required,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

  // When value changes externally, sync the display text
  useEffect(() => {
    if (value === "") {
      setQuery("");
    } else {
      const found = options.find((o) => o.id === value);
      if (found) setQuery(found.name);
    }
  }, [value, options]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        // Reset query to selected value name on blur
        const found = options.find((o) => o.id === value);
        setQuery(found?.name ?? "");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, value, options]);

  const filtered =
    query.trim() === ""
      ? options
      : options.filter((o) =>
          o.name.toLowerCase().includes(query.toLowerCase()),
        );

  const handleInputClick = () => {
    if (disabled || loading) return;
    setOpen(true);
    setQuery(""); // clear to show full list on open
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.id);
    setQuery(option.name);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setOpen(false);
  };

  const displayValue = open
    ? query
    : value !== ""
      ? (options.find((o) => o.id === value)?.name ?? query)
      : query;

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      <label
        className="text-xs font-semibold"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-error, #e53e3e)" }}> *</span>
        )}
      </label>

      <div style={{ position: "relative" }}>
        {/* Input */}
        <div
          onClick={handleInputClick}
          style={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${error ? "var(--color-error, #e53e3e)" : "var(--color-border)"}`,
            borderRadius: 12,
            backgroundColor: disabled
              ? "var(--color-bg-subtle)"
              : "var(--color-bg)",
            padding: "10px 14px",
            cursor: disabled || loading ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <input
            ref={inputRef}
            value={displayValue}
            name={`combobox-${label}-${Math.random()}`} //
            onChange={handleInputChange}
            autoComplete="new-password"
            placeholder={loading ? t("combobox.loading") : placeholder}
            disabled={disabled || loading}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: 14,
              color: "var(--color-text)",
              fontFamily: "var(--font-sans)",
              cursor: disabled || loading ? "not-allowed" : "text",
              minWidth: 0,
            }}
          />

          {/* Clear button */}
          {value !== "" && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                marginLeft: 4,
                color: "var(--color-text-muted)",
                lineHeight: 1,
                flexShrink: 0,
              }}
              aria-label={t("combobox.clearAriaLabel")}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* Chevron */}
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{
              marginLeft: 4,
              color: "var(--color-text-muted)",
              flexShrink: 0,
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Dropdown list */}
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 100,
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {filtered.length === 0 ? (
              <div
                style={{
                  padding: "12px 14px",
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {t("combobox.noResults")}
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: 14,
                    fontFamily: "var(--font-sans)",
                    color:
                      option.id === value
                        ? "var(--color-primary)"
                        : "var(--color-text)",
                    backgroundColor:
                      option.id === value
                        ? "var(--color-bg-subtle)"
                        : "transparent",
                    fontWeight: option.id === value ? 600 : 400,
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (option.id !== value)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (option.id !== value)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                  }}
                  dir="auto"
                >
                  {option.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--color-error, #e53e3e)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
