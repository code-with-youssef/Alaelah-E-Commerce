"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/src/components/common/ConfirmDialog";
import { SettingsLayout } from "../../SettingsLayout";
import { SettingsBottomButton } from "../../SettingsBottomButton";
import { useAddresses } from "@/src/hooks/address/useAdresses";
import { MapIcon } from "@heroicons/react/24/outline";
import { AddressFormModal } from "../AddressFormModal";
import type { Address } from "@/src/types/address/address";
import type { MapPickerValue } from "@/src/components/common/MapPicker";
import { useTranslations } from "next-intl";
import AddressRow from "../AddressRow";
import { AddressFormValues } from "../AdressForm";

// ─── Helpers ──────────────────────────────────────────────────

function addressToFormValues(a: Address): Partial<AddressFormValues> {
  return {
    address: a.address ?? "",
    street: a.street ?? "",
    building_number: a.building_number ?? "",
    floor: a.floor ?? "",
    room: a.room ?? "",
    landmark: a.landmark ?? "",
    phone: a.phone ?? "",
    state_id: a.state_id ?? "",
    city_id: a.city_id ?? "",
    district_id: a.district_id ?? "",
  };
}

function addressToMapValue(a: Address): MapPickerValue | undefined {
  if (!a.lat || !a.lang) return undefined;
  return {
    coords: { lat: a.lat, lng: a.lang },
    address: a.address ?? "",
  };
}

// ─── Main component ───────────────────────────────────────────

export function SavedAddressesClient() {
  const t = useTranslations("settings");
  const {
    addresses,
    isLoading,
    deleteAddress,
    makeDefault,
    deletingId,
    makingDefaultId,
  } = useAddresses();

  // ── Modal state ───────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleDeleteConfirm = async () => {
    if (pendingDeleteId === null) return;
    try {
      await deleteAddress(pendingDeleteId);
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      <SettingsLayout title="" fullHeight>
        <div
          className="flex flex-col h-full"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          {/* Page title */}
          <header
            className="flex items-center px-4 py-3 shrink-0"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {t("savedAddresses")}
            </h1>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4">
              {/* Loading */}
              {isLoading && (
                <div className="flex justify-center py-16">
                  <div
                    className="w-5 h-5 rounded-full border-[3px] border-t-transparent animate-spin"
                    style={{ borderColor: "var(--color-primary)" }}
                  />
                </div>
              )}

              {/* Empty state */}
              {!isLoading && addresses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div style={{ color: "var(--color-border)" }}>
                    <MapIcon className="w-12 h-12" />
                  </div>
                  <p
                    className="text-base font-semibold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-text)",
                    }}
                  >
                    {t("noSavedAddresses")}
                  </p>
                  <p
                    className="text-sm text-center"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {t("addAddressHint")}
                  </p>
                </div>
              )}

              {/* Address list */}
              {!isLoading &&
                addresses.map((address) => (
                  <AddressRow
                    key={address.id}
                    address={address}
                    onDelete={(id) => setPendingDeleteId(id)}
                    onMakeDefault={makeDefault}
                    onEdit={(addr) => setEditingAddress(addr)}
                    isDeleting={deletingId === address.id}
                    isMakingDefault={makingDefaultId === address.id}
                  />
                ))}
            </div>
          </div>

          {/* Bottom add button */}
          <div
            className="px-4 shrink-0"
            style={{
              borderTop: "1px solid var(--color-border)",
              paddingTop: "1rem",
              paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            }}
          >
            <SettingsBottomButton
              label={t("addNewAddress")}
              onClick={() => setAddOpen(true)}
              variant="primary"
            />
          </div>
        </div>
      </SettingsLayout>

      {/* ── Add modal ── */}
      <AddressFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={() => setAddOpen(false)}
      />

      {/* ── Edit modal ── */}
      <AddressFormModal
        open={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        onSaved={() => setEditingAddress(null)}
        addressId={editingAddress?.id}
        initialValues={
          editingAddress ? addressToFormValues(editingAddress) : undefined
        }
        initialMapValue={
          editingAddress ? addressToMapValue(editingAddress) : undefined
        }
      />

      {/* ── Delete confirm ── */}
      <ConfirmDialog
        open={pendingDeleteId !== null}
        variant="danger"
        title={t("deleteAddressTitle")}
        description={t("deleteAddressDescription")}
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("deleteCancel")}
        isLoading={deletingId === pendingDeleteId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}