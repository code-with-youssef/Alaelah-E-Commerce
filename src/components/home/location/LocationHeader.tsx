"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useLocation } from "@/src/contexts/LocationContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useAddresses } from "@/src/hooks/address/useAdresses";
import { useTranslations } from "next-intl";
import { Address } from "@/src/types/address/address";
import { LocationDropdown } from "./LocationDropdown";
import { SpinnerIcon } from "../../common/icons/SpinnerIcon";
import { PinIcon } from "../../common/icons/PinIcon";

interface LocationHeaderProps {
  deliveryMin?: number;
  deliveryMax?: number;
  onChatPress?: () => void;
}

function PlainLocationPill({
  detecting,
  displayName,
}: {
  detecting: boolean;
  displayName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("home");

  useEffect(() => {
    if (!expanded) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div className="flex items-center gap-1.5 min-w-0">
        {detecting ? (
          <SpinnerIcon />
        ) : (
          <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>
            <PinIcon />
          </span>
        )}

        <span
          className="text-base font-bold leading-tight truncate"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-primary)",
            maxWidth: 180,
          }}
        >
          {displayName}
        </span>

        {!detecting && (
          <button
            type="button"
            onClick={() => setExpanded((o) => !o)}
            aria-label="Show full address"
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              padding: "2px 4px",
              cursor: "pointer",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {expanded && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            insetInlineStart: 0,        // ← was: left: 0
            zIndex: 100,
            backgroundColor: "var(--color-bg, #fff)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            padding: "10px 14px",
            maxWidth: 280,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          }}
        >
          <p
            className="text-xs font-semibold mb-1"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {t("location.yourLocation")}
          </p>
          <p
            className="text-sm font-medium"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-sans)",
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {displayName}
          </p>
        </div>
      )}
    </div>
  );
}

export function LocationHeader({
  deliveryMin = 35,
  deliveryMax = 45,
  onChatPress,
}: LocationHeaderProps) {
  const { location, confirmLocation } = useLocation();
  const { user } = useAuth();
  const { addresses, makeDefault } = useAddresses();
  const t = useTranslations("home");

  const handleAddressSelect = useCallback(
    async (address: Address) => {
      await makeDefault(address.id);
      await confirmLocation(
        { lat: address.lat, lng: address.lang },
        address.address,
      );
    },
    [makeDefault, confirmLocation],
  );

  const hasAddresses = !!user && addresses.length > 0;
  const plainDisplayName = location.detecting
    ? t("location.locating")
    : (location.cityName ?? t("location.setLocation"));

  return (
    <div className="flex items-start justify-between pt-4 pb-2">
      <div className="flex flex-col gap-1 min-w-0 flex-1 me-2"> {/* ← was: mr-2 */}
        {hasAddresses ? (
          <LocationDropdown
            addresses={addresses}
            onSelect={handleAddressSelect}
          />
        ) : (
          <PlainLocationPill
            detecting={location.detecting}
            displayName={plainDisplayName}
          />
        )}

        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {t("location.deliveryIn")}
          </span>
          <span
            className="text-sm font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-delivery-bg, #FFF3E0)",
              color: "var(--color-delivery-text, #E65100)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {deliveryMin}–{deliveryMax} {t("location.min")}
          </span>
        </div>
      </div>

  
    </div>
  );
}