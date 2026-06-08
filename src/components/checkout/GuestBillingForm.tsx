"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { BillingInfo } from "@/src/types/order/checkout";
import { useCities, useDistricts, useStates } from "@/src/hooks/address/useLocations";
import { Combobox } from "../common/ComboBox";
import { Field } from "../common/Field";
import { MapStep } from "../common/MapStep";
import type { MapPickerValue } from "../common/MapPicker";

// ─── Props ────────────────────────────────────────────────────

interface GuestBillingFormProps {
  value: Partial<BillingInfo>;
  onChange: (patch: Partial<BillingInfo>) => void;
}

// ─── Shared input style ───────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 14,
  outline: "none",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-bg)",
  color: "var(--color-text)",
  fontFamily: "var(--font-sans)",
};

function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputBase}
    />
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
    >
      {children}
    </h3>
  );
}

// ─── Map overlay ──────────────────────────────────────────────

function MapOverlay({
  initialValue,
  onConfirm,
  onClose,
  t,
}: {
  initialValue: MapPickerValue | null;
  onConfirm: (val: MapPickerValue) => void;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [picked, setPicked] = useState<MapPickerValue | null>(initialValue);

  return (
    <div className="fixed inset-0 z-[300] flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90"
          style={{ color: "var(--color-primary)" }}
          aria-label={t("close")}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {t("selectLocation")}
        </h2>
        <div className="w-9" />
      </header>

      <div className="flex-1 min-h-0">
        <MapStep
          initialCoords={initialValue?.coords}
          pickedValue={picked}
          onMapChange={setPicked}
          onNext={() => {
            if (picked) {
              onConfirm(picked);
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
}

// ─── Address field with map trigger ──────────────────────────

function AddressMapField({
  label,
  required,
  value,
  placeholder,
  onMapConfirm,
  t,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  onMapConfirm: (val: MapPickerValue) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [mapOpen, setMapOpen] = useState(false);
  const [confirmedValue, setConfirmedValue] = useState<MapPickerValue | null>(null);

  return (
    <>
      <Field label={label} required={required}>
        <div style={{ position: "relative" }}>
          <input
            readOnly
            placeholder={placeholder}
            value={value}
            onClick={() => setMapOpen(true)}
            style={{
              ...inputBase,
              paddingRight: 44,
              cursor: "pointer",
              color: value ? "var(--color-text)" : "var(--color-text-muted)",
            }}
          />
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            aria-label={t("openMap")}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </button>
        </div>
      </Field>

      {mapOpen && (
        <MapOverlay
          t={t}
          initialValue={confirmedValue}
          onConfirm={(val) => {
            setConfirmedValue(val);
            onMapConfirm(val);
          }}
          onClose={() => setMapOpen(false)}
        />
      )}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────

export function GuestBillingForm({ value, onChange }: GuestBillingFormProps) {
  const t = useTranslations("checkout.billing");

  const { data: statesRes, isLoading: statesLoading } = useStates(1);
  const { data: citiesRes, isLoading: citiesLoading } = useCities(value.state_Id ?? null);
  const { data: districtsRes, isLoading: districtsLoading } = useDistricts(value.city_Id ?? null);

  const states = statesRes?.data ?? [];
  const cities = citiesRes?.data ?? [];
  const districts = districtsRes?.data ?? [];

  const set = <K extends keyof BillingInfo>(key: K, val: BillingInfo[K]) =>
    onChange({ [key]: val } as Partial<BillingInfo>);

  return (
    <div className="flex flex-col gap-6 py-4">

      {/* ── Personal info ── */}
      <div>
        <SectionHeading>{t("personalInfo")}</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("name")} required>
            <TextInput
              placeholder={t("namePlaceholder")}
              value={value.name ?? ""}
              onChange={(v) => set("name", v)}
              autoComplete="name"
            />
          </Field>
          <Field label={t("phone")} required>
            <TextInput
              placeholder={t("phonePlaceholder")}
              value={value.phone ?? ""}
              onChange={(v) => set("phone", v)}
              type="tel"
              autoComplete="tel"
            />
          </Field>
          <Field label={t("phone2")}>
            <TextInput
              placeholder={t("phone2Placeholder")}
              value={value.phone2 ?? ""}
              onChange={(v) => set("phone2", v)}
              type="tel"
              autoComplete="tel"
            />
          </Field>
          <Field label={t("email")}>
            <TextInput
              placeholder={t("emailPlaceholder")}
              value={value.email ?? ""}
              onChange={(v) => set("email", v)}
              type="email"
              autoComplete="email"
            />
          </Field>
          <Field label={t("password")} required>
            <TextInput
              placeholder={t("passwordPlaceholder")}
              value={value.account_Password ?? ""}
              onChange={(v) => set("account_Password", v)}
              type="password"
              autoComplete="new-password"
            />
            <p className="text-xs" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>
              {t("passwordHint")}
            </p>
          </Field>
        </div>
      </div>

      {/* ── Location ── */}
      <div>
        <SectionHeading>{t("location")}</SectionHeading>

        {/* Address field — opens map overlay on tap */}
        <div className="mb-4">
          <AddressMapField
            label={t("address")}
            required
            value={value.address ?? ""}
            placeholder={t("addressPlaceholder")}
            t={t}
            onMapConfirm={(val) =>
              onChange({
                address: val.address,
                latitude: String(val.coords.lat),
                longitude: String(val.coords.lng),
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Combobox
            label={t("state")}
            required
            options={states}
            value={value.state_Id ?? ""}
            onChange={(v) =>
              onChange({ state_Id: v || undefined, city_Id: undefined, district_Id: undefined })
            }
            placeholder={t("selectState")}
            loading={statesLoading}
          />
          <Combobox
            label={t("city")}
            required
            options={cities}
            value={value.city_Id ?? ""}
            onChange={(v) => onChange({ city_Id: v || undefined, district_Id: undefined })}
            placeholder={!value.state_Id ? t("selectStateFirst") : t("selectCity")}
            disabled={!value.state_Id}
            loading={citiesLoading}
          />
          <Combobox
            label={t("district")}
            required
            options={districts}
            value={value.district_Id ?? ""}
            onChange={(v) => onChange({ district_Id: v || undefined })}
            placeholder={!value.city_Id ? t("selectCityFirst") : t("selectDistrict")}
            disabled={!value.city_Id}
            loading={districtsLoading}
          />
        </div>
      </div>

      {/* ── Street detail ── */}
      <div>
        <SectionHeading>{t("streetDetail")}</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("street")} required>
            <TextInput
              placeholder={t("streetPlaceholder")}
              value={value.street ?? ""}
              onChange={(v) => set("street", v)}
            />
          </Field>
          <Field label={t("building")}>
            <TextInput
              placeholder={t("buildingPlaceholder")}
              value={value.building_Number ?? ""}
              onChange={(v) => set("building_Number", v)}
            />
          </Field>
          <Field label={t("floor")}>
            <TextInput
              placeholder={t("floorPlaceholder")}
              value={value.floor ?? ""}
              onChange={(v) => set("floor", v)}
            />
          </Field>
          <Field label={t("room")}>
            <TextInput
              placeholder={t("roomPlaceholder")}
              value={value.room ?? ""}
              onChange={(v) => set("room", v)}
            />
          </Field>
        </div>
      </div>

    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────

export function isGuestBillingValid(billing: Partial<BillingInfo>): boolean {
  return (
    !!billing.name &&
    !!billing.phone &&
    !!billing.account_Password &&
    !!billing.address &&
    !!billing.latitude &&
    !!billing.longitude &&
    !!billing.state_Id &&
    !!billing.city_Id &&
    !!billing.district_Id &&
    !!billing.street
  );
}