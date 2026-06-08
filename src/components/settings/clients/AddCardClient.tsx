"use client";

import { AddCardFormData } from "@/src/config/settings";
import { useState } from "react";
import { SettingsLayout } from "../SettingsLayout";
import { SettingsInput } from "../SettingsInput";
import { SettingsBottomButton } from "../SettingsBottomButton";
import { useTranslations } from "next-intl";

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

// Card icon
function CardIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <rect x="0.5" y="0.5" width="21" height="15" rx="2.5" stroke="currentColor" />
      <rect x="0" y="4" width="22" height="3" fill="currentColor" opacity="0.2" />
      <rect x="2" y="10" width="6" height="2" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

interface AddCardClientProps {
  onAdd: (data: AddCardFormData) => Promise<void>;
}

export function AddCardClient({ onAdd }: AddCardClientProps) {
  const t = useTranslations("settings");
  const [form, setForm] = useState<AddCardFormData>({
    card_number: "",
    expiry_date: "",
    cvv: "",
    cardholder_name: "",
    email: "",
    label: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddCardFormData, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    const digits = form.card_number.replace(/\s/g, "");
    if (digits.length < 16) e.card_number = t("cardNumberError");
    if (!/^\d{2}\/\d{2}$/.test(form.expiry_date)) e.expiry_date = t("expiryError");
    if (form.cvv.length < 3) e.cvv = t("cvvError");
    if (!form.cardholder_name.trim()) e.cardholder_name = t("required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("emailError");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setSaving(true);
    await onAdd(form);
    setSaving(false);
  };

  const isReady =
    form.card_number.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(form.expiry_date) &&
    form.cvv.length >= 3 &&
    form.cardholder_name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  return (
    <SettingsLayout title="" closeIcon fullHeight>
      <h1
        className="text-2xl font-bold mt-2 mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
      >
        {t("enterCardInfo")}
      </h1>

      <div className="flex flex-col gap-3 flex-1">
        {/* Card number — full width with active label */}
        <SettingsInput
          label={t("cardNumberLabel")}
          placeholder={t("cardNumberPlaceholder")}
          value={form.card_number}
          onChange={e => setForm(p => ({ ...p, card_number: formatCardNumber(e.target.value) }))}
          inputMode="numeric"
          autoComplete="cc-number"
          error={errors.card_number}
          rightIcon={<CardIcon />}
        />

        {/* Expiry + CVV row */}
        <div className="grid grid-cols-2 gap-3">
          <SettingsInput
            placeholder={t("expiryPlaceholder")}
            value={form.expiry_date}
            onChange={e => setForm(p => ({ ...p, expiry_date: formatExpiry(e.target.value) }))}
            inputMode="numeric"
            autoComplete="cc-exp"
            error={errors.expiry_date}
          />
          <SettingsInput
            placeholder={t("cvvPlaceholder")}
            value={form.cvv}
            onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            error={errors.cvv}
          />
        </div>

        <SettingsInput
          placeholder={t("cardholderNamePlaceholder")}
          value={form.cardholder_name}
          onChange={e => setForm(p => ({ ...p, cardholder_name: e.target.value }))}
          autoComplete="cc-name"
          error={errors.cardholder_name}
        />

        <SettingsInput
          placeholder={t("emailPlaceholder")}
          type="email"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          inputMode="email"
          autoComplete="email"
          error={errors.email}
        />

        <div>
          <SettingsInput
            placeholder={t("cardLabelPlaceholder")}
            value={form.label ?? ""}
            onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
          />
          <p
            className="text-xs mt-1.5 px-1"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {t("cardLabelHint")}
          </p>
        </div>
      </div>

      <SettingsBottomButton
        label={saving ? t("adding") : t("add")}
        onClick={handleAdd}
        disabled={saving}
        variant={isReady ? "primary" : "primary"}
      />
    </SettingsLayout>
  );
}