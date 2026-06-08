"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useCities, useDistricts, useStates } from "@/src/hooks/address/useLocations";
import { Combobox } from "../../common/ComboBox";
import { Field } from "../../common/Field";
import { MapStep } from "../../common/MapStep";
import type { MapPickerValue } from "../../common/MapPicker";
import { createAddressApi, updateAddress } from "@/src/lib/address/address";
import type { CreateAddressPayload } from "@/src/types/address/address";

// ─── Types ────────────────────────────────────────────────────

export interface AddressFormValues {
  address: string;
  street: string;
  building_number: string;
  floor: string;
  room: string;
  landmark: string;
  phone: string;
  state_id: number | "";
  city_id: number | "";
  district_id: number | "";
}

type FormErrors = Partial<Record<keyof AddressFormValues, string>>;

const emptyForm = (): AddressFormValues => ({
  address: "",
  street: "",
  building_number: "",
  floor: "",
  room: "",
  landmark: "",
  phone: "",
  state_id: "",
  city_id: "",
  district_id: "",
});

export interface AddressFormProps {
  onSaved: () => void;
  /** Pass to enable edit mode — omit for create mode */
  addressId?: number;
  /** Pre-fill fields when editing */
  initialValues?: Partial<AddressFormValues>;
  /** Pre-fill map pin when editing */
  initialMapValue?: MapPickerValue;
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
  confirmLabel,
  title,
}: {
  initialValue: MapPickerValue | null;
  onConfirm: (val: MapPickerValue) => void;
  onClose: () => void;
  confirmLabel: string;
  title: string;
}) {
  const [picked, setPicked] = useState<MapPickerValue | null>(initialValue);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90"
          style={{ color: "var(--color-primary)" }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {title}
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
          labels={{ nextButton: confirmLabel }}
        />
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────

export default function AddressForm({
  onSaved,
  addressId,
  initialValues,
  initialMapValue,
}: AddressFormProps) {
  const t = useTranslations("settings");
  const queryClient = useQueryClient();
  const isEdit = !!addressId;

  const [form, setForm] = useState<AddressFormValues>({
    ...emptyForm(),
    ...initialValues,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapValue, setMapValue] = useState<MapPickerValue | null>(initialMapValue ?? null);

  // Cascading dropdowns
  const { data: statesRes, isLoading: statesLoading } = useStates(1);
  const { data: citiesRes, isLoading: citiesLoading } = useCities(
    form.state_id !== "" ? form.state_id : null,
  );
  const { data: districtsRes, isLoading: districtsLoading } = useDistricts(
    form.city_id !== "" ? form.city_id : null,
  );

  const states = statesRes?.data ?? [];
  const cities = citiesRes?.data ?? [];
  const districts = districtsRes?.data ?? [];

  const set = useCallback((key: keyof AddressFormValues, val: string | number | "") => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const txt =
    (key: keyof AddressFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      set(key, e.target.value);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!mapValue) e.address = t("pinRequired");
    else if (!form.address.trim()) e.address = t("required");
    if (!form.street.trim()) e.street = t("required");
    if (!form.phone.trim()) e.phone = t("required");
    if (form.state_id === "") e.state_id = t("required");
    if (form.city_id === "") e.city_id = t("required");
    if (form.district_id === "") e.district_id = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !mapValue) return;

    setSaving(true);
    setSaveError(null);

    const payload: CreateAddressPayload = {
      address: form.address,
      street: form.street,
      phone: form.phone,
      state_id: form.state_id as number,
      city_id: form.city_id as number,
      district_id: form.district_id as number,
      latitude: mapValue.coords.lat,
      longitude: mapValue.coords.lng,
      ...(form.building_number && { building_number: form.building_number }),
      ...(form.floor && { floor: form.floor }),
      ...(form.room && { room: form.room }),
      ...(form.landmark && { landmark: form.landmark }),
    };

    try {
      if (isEdit) {
        await updateAddress(payload, addressId!);
      } else {
        await createAddressApi(payload);
      }

      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
        refetchType: "all",
      });

      onSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 py-4">

        {/* ── Location ── */}
        <div>
          <div className="mb-4">
            <Field label={t("address")} required error={errors.address}>
              <div style={{ position: "relative" }}>
                <input
                  readOnly
                  placeholder={t("addressPlaceholder")}
                  value={form.address}
                  onClick={() => setMapOpen(true)}
                  style={{
                    ...inputBase,
                    paddingRight: 44,
                    cursor: "pointer",
                    borderColor: errors.address
                      ? "var(--color-error, #e53e3e)"
                      : "var(--color-border)",
                    color: form.address
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Combobox
              label={t("state")}
              required
              options={states}
              value={form.state_id}
              onChange={(id) => {
                set("state_id", id);
                set("city_id", "");
                set("district_id", "");
              }}
              placeholder={t("searchState")}
              loading={statesLoading}
              error={errors.state_id}
            />
            <Combobox
              label={t("city")}
              required
              options={cities}
              value={form.city_id}
              onChange={(id) => {
                set("city_id", id);
                set("district_id", "");
              }}
              placeholder={
                form.state_id === "" ? t("selectStateFirst") : t("searchCity")
              }
              disabled={form.state_id === ""}
              loading={citiesLoading}
              error={errors.city_id}
            />
            <Combobox
              label={t("district")}
              required
              options={districts}
              value={form.district_id}
              onChange={(id) => set("district_id", id)}
              placeholder={
                form.city_id === ""
                  ? t("selectCityFirst")
                  : t("searchDistrict")
              }
              disabled={form.city_id === ""}
              loading={districtsLoading}
              error={errors.district_id}
            />
          </div>
        </div>

        {/* ── Street detail ── */}
        <div>
          <SectionHeading>{t("streetDetail")}</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t("street")} required error={errors.street}>
              <input
                style={{
                  ...inputBase,
                  borderColor: errors.street
                    ? "var(--color-error, #e53e3e)"
                    : "var(--color-border)",
                }}
                value={form.street}
                onChange={txt("street")}
                dir="auto"
              />
            </Field>
            <Field label={t("building")}>
              <input style={inputBase} value={form.building_number} onChange={txt("building_number")} />
            </Field>
            <Field label={t("floor")}>
              <input style={inputBase} value={form.floor} onChange={txt("floor")} />
            </Field>
            <Field label={t("room")}>
              <input style={inputBase} value={form.room} onChange={txt("room")} />
            </Field>
            <Field label={t("landmark")}>
              <input style={inputBase} value={form.landmark} onChange={txt("landmark")} dir="auto" />
            </Field>
          </div>
        </div>

        {/* ── Contact ── */}
        <div>
          <SectionHeading>{t("contact")}</SectionHeading>
          <Field label={t("phone")} required error={errors.phone}>
            <input
              style={{
                ...inputBase,
                borderColor: errors.phone
                  ? "var(--color-error, #e53e3e)"
                  : "var(--color-border)",
              }}
              value={form.phone}
              onChange={txt("phone")}
              type="tel"
              inputMode="tel"
            />
          </Field>
        </div>

        {/* ── API error ── */}
        {saveError && (
          <p
            className="text-sm text-center"
            style={{ color: "var(--color-error, #e53e3e)", fontFamily: "var(--font-sans)" }}
          >
            {saveError}
          </p>
        )}

        {/* ── Save button ── */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-2xl py-4 text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)", fontFamily: "var(--font-display)" }}
        >
          {saving
            ? t("saving")
            : isEdit
            ? t("updateAddress")
            : t("saveAddress")}
        </button>
      </div>

      {mapOpen && (
        <MapOverlay
          title={t("selectLocation")}
          confirmLabel={t("confirm")}
          initialValue={mapValue}
          onConfirm={(val) => {
            setMapValue(val);
            set("address", val.address);
          }}
          onClose={() => setMapOpen(false)}
        />
      )}
    </>
  );
}
