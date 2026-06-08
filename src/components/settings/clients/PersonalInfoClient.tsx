"use client";

import { useState } from "react";
import { SettingsLayout } from "../SettingsLayout";
import { SettingsInput } from "../SettingsInput";
import { SettingsBottomButton } from "../SettingsBottomButton";
import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProfile } from "@/src/hooks/user/useProfile";
import { useTranslations } from "next-intl";

const COUNTRY_CODES = [
  { code: "+20",  flag: "🇪🇬", country: "EG" },
  { code: "+1",   flag: "🇺🇸", country: "US" },
  { code: "+44",  flag: "🇬🇧", country: "GB" },
  { code: "+971", flag: "🇦🇪", country: "AE" },
  { code: "+966", flag: "🇸🇦", country: "SA" },
];

function splitName(fullName: string): { first: string; last: string } {
  const parts = (fullName ?? "").trim().split(" ");
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
}

function splitPhone(phone: string): { code: string; number: string } {
  for (const c of COUNTRY_CODES) {
    if (phone?.startsWith(c.code)) {
      return { code: c.code, number: phone.slice(c.code.length).trim() };
    }
  }
  return { code: "+20", number: phone ?? "" };
}

interface FormState {
  first_name: string;
  last_name: string;
  phone_country_code: string;
  phone_number: string;
}

export function PersonalInfoClient() {
  const t = useTranslations("settings");
  const { user } = useAuth();
  const { saveProfile, removeAccount, isSaving, isDeleting } = useProfile();

  const { first, last } = splitName(user?.name ?? "");
  const { code, number } = splitPhone(user?.phone ?? "");

  const [form, setForm] = useState<FormState>({
    first_name: first,
    last_name: last,
    phone_country_code: code,
    phone_number: number,
  });

  const [showCodes, setShowCodes] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isDirty =
    form.first_name !== first ||
    form.last_name !== last ||
    form.phone_country_code !== code ||
    form.phone_number !== number;

  const handleSave = async () => {
    if (!isDirty || isSaving) return;
    const fullName = `${form.first_name.trim()} ${form.last_name.trim()}`.trim();
    const fullPhone = `${form.phone_country_code}${form.phone_number.trim()}`;
    await saveProfile(fullName, fullPhone);
  };

  const handleDeleteConfirm = async () => {
    try {
      await removeAccount();
    } catch {
      setDeleteDialogOpen(false);
    }
  };

  const selectedCode =
    COUNTRY_CODES.find((c) => c.code === form.phone_country_code) ??
    COUNTRY_CODES[0];

  return (
    <>
      <SettingsLayout title="" fullHeight>
        <h1
          className="text-2xl font-bold mt-2 mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {t("personalInfoTitle")}
        </h1>

        <div className="flex flex-col gap-3 flex-1">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <SettingsInput
              label={t("firstNameLabel")}
              value={form.first_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, first_name: e.target.value }))
              }
              autoComplete="given-name"
            />
            <SettingsInput
              label={t("lastNameLabel")}
              value={form.last_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, last_name: e.target.value }))
              }
              autoComplete="family-name"
            />
          </div>

          {/* Phone row */}
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowCodes((v) => !v)}
                className="h-full flex items-center gap-1.5 rounded-2xl px-3 border-[1.5px] font-medium text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-text)",
                  minWidth: "90px",
                }}
              >
                <span>{selectedCode.flag}</span>
                <span>{selectedCode.code}</span>
                <span style={{ color: "var(--color-text-muted)" }}>▾</span>
              </button>

              {showCodes && (
                <div
                  className="absolute left-0 top-full mt-1 z-20 rounded-2xl overflow-hidden shadow-lg"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    minWidth: "140px",
                  }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setForm((p) => ({ ...p, phone_country_code: c.code }));
                        setShowCodes(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-[var(--color-bg-subtle)] transition-colors"
                      style={{
                        fontFamily: "var(--font-sans)",
                        color: "var(--color-text)",
                      }}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1">
              <SettingsInput
                label={t("mobileNumberLabel")}
                type="tel"
                value={form.phone_number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone_number: e.target.value }))
                }
                autoComplete="tel"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <SettingsBottomButton
          label={isSaving ? t("saving") : t("save")}
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          variant={isDirty ? "primary" : "disabled"}
        />

        {/* Delete account */}
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="w-full mt-3 py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-80 active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-error)",
            border: "1.5px solid var(--color-error)",
            backgroundColor: "transparent",
          }}
        >
          {t("deleteAccount")}
        </button>
      </SettingsLayout>

      <ConfirmDialog
        open={deleteDialogOpen}
        variant="danger"
        title={t("deleteAccountTitle")}
        description={t("deleteAccountDescription")}
        confirmLabel={t("deleteAccountConfirm")}
        cancelLabel={t("deleteAccountCancel")}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}