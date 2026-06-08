"use client";

import React, { useState, useRef, useEffect } from "react";
import { PinIcon } from "../../common/icons/PinIcon";
import { Address } from "@/src/types/address/address";

interface LocationDropdownProps {
  addresses: Address[];
  onSelect: (address: Address) => void;
}

export function LocationDropdown({ addresses, onSelect }: LocationDropdownProps) {
  const defaultAddress =
    addresses.find((a) => a.set_default === 1) ?? addresses[0];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (address: Address) => {
    setOpen(false);
    onSelect(address);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5"
        type="button"
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        <span style={{ color: "var(--color-primary)" }}>
          <PinIcon />
        </span>
        <span
          className="text-base font-bold leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-primary)",
            maxWidth: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {defaultAddress.address}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          style={{
            color: "var(--color-primary)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            insetInlineStart: 0,        // ← was: left: 0
            minWidth: 260,
            backgroundColor: "var(--color-bg, #fff)",
            border: "1px solid var(--color-border)",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => handleSelect(addr)}
              type="button"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                width: "100%",
                padding: "12px 16px",
                background:
                  addr.set_default === 1
                    ? "var(--color-primary-light, #FFF0F0)"
                    : "none",
                border: "none",
                cursor: "pointer",
                textAlign: "start",           // ← was: left
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  color:
                    addr.set_default === 1
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                  marginTop: 2,
                  flexShrink: 0,
                }}
              >
                <PinIcon />
              </span>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: "var(--color-text)",
                    fontFamily: "var(--font-sans)",
                    margin: 0,
                  }}
                >
                  {addr.address}
                </p>
                {addr.city_name && (
                  <p
                    className="text-xs"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-sans)",
                      margin: "2px 0 0",
                    }}
                  >
                    {[addr.city_name, addr.district_name, addr.region_name]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
              {addr.set_default === 1 && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  style={{
                    color: "var(--color-primary)",
                    marginInlineStart: "auto",  // ← was: marginLeft: "auto"
                    flexShrink: 0,
                    alignSelf: "center",
                  }}
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}