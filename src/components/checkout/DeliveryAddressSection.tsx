"use client";

import { useTranslations } from 'next-intl';
import { Address } from "@/src/types/address/address";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface DeliveryAddressSectionProps {
  addresses: Address[];
  isLoading: boolean;
  selectedAddressId: number | null;
  onAddressChange: (id: number) => void;
  deliveryNote: string;
  onNoteChange: (note: string) => void;
}

export function DeliveryAddressSection({
  addresses,
  isLoading,
  selectedAddressId,
  onAddressChange,
  deliveryNote,
  onNoteChange,
}: DeliveryAddressSectionProps) {
  const t = useTranslations('checkout');

  return (
    <section className="py-5">
      <h2
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
      >
        {t('deliveryAddress')}
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : addresses.length === 0 ? (
          <p
            className="text-sm py-3 text-center"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {t('noAddressesFound')}
          </p>
        ) : (
          addresses.map((addr) => (
            <AddressRow
              key={addr.id}
              address={addr}
              isSelected={selectedAddressId === addr.id}
              onSelect={() => onAddressChange(addr.id)}
            />
          ))
        )}
      </div>

      {/* Delivery note */}
      <div
        className="flex items-center px-4 rounded-2xl border transition-all duration-150"
        style={{
          height: "52px",
          backgroundColor: "var(--color-bg)",
          borderColor: deliveryNote ? "var(--color-primary)" : "var(--color-border)",
          boxShadow: deliveryNote ? "0 0 0 3px rgba(181,23,158,0.08)" : "none",
        }}
      >
        <input
          type="text"
          placeholder={t('addDeliveryNote')}
          value={deliveryNote}
          onChange={(e) => onNoteChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
          aria-label={t('deliveryNote')}
          maxLength={200}
        />
      </div>
    </section>
  );
}

// ── Address row ───────────────────────────────────────────────

function AddressRow({
  address,
  isSelected,
  onSelect,
}: {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations('checkout');
  
  const title = address.address || address.city_name || t('address');

  const subtitle = [
    address.street,
    address.building_number && t('building', { number: address.building_number }),
    address.floor && t('floor', { number: address.floor }),
    address.city_name,
    address.state_name,
  ]
    .filter(Boolean)
    .join(", ");

  // Show the delivery cost that will be applied for this address
  const deliveryCost =
    address.district_cost ??
    address.city_cost ??
    address.state_cost ??
    address.country_cost ??
    0;

  return (
    <button
      onClick={onSelect}
      className="w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-150"
      style={{
        border: isSelected ? "2px solid var(--color-primary)" : "1.5px solid var(--color-border)",
        backgroundColor: isSelected ? "var(--color-primary-light)" : "var(--color-bg)",
      }}
      aria-pressed={isSelected}
    >
      <MapPinIcon
        className="w-4 h-4 mt-0.5 shrink-0"
        style={{ color: isSelected ? "var(--color-primary)" : "var(--color-text-muted)" }}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-snug truncate"
          style={{
            fontFamily: "var(--font-sans)",
            color: isSelected ? "var(--color-primary)" : "var(--color-text)",
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className="text-xs leading-snug mt-0.5 line-clamp-2"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-muted)" }}
          >
            {subtitle}
          </p>
        )}
        {address.phone && (
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-muted)" }}
          >
            {address.phone}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {/* Delivery cost badge */}
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-bg-muted)",
            color: isSelected ? "#ffffff" : "var(--color-text-muted)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {t('egp')} {deliveryCost}
        </span>

        {/* Radio dot */}
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)" }}
        >
          {isSelected && (
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
          )}
        </div>
      </div>
    </button>
  );
}

// ── Skeleton ──────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      className="h-16 rounded-2xl animate-pulse"
      style={{ backgroundColor: "var(--color-bg-muted)" }}
    />
  );
}