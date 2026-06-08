"use client";

import { Address } from "@/src/types/address/address";
import { MapPinIcon, StarIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface ApiAddressRowProps {
  address: Address;
  onDelete: (id: number) => void;
  onMakeDefault: (id: number) => void;
  onEdit: (address: Address) => void;
  isDeleting: boolean;
  isMakingDefault: boolean;
}

export default function AddressRow({
  address,
  onDelete,
  onMakeDefault,
  onEdit,
  isDeleting,
  isMakingDefault,
}: ApiAddressRowProps) {
  const t = useTranslations("settings");
  const isDefault = address.set_default === 1;

  const fullAddress = [
    address.street,
    address.building_number && `${t("building")} ${address.building_number}`,
    address.floor && `${t("floor")} ${address.floor}`,
    address.city_name,
    address.state_name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="flex items-start gap-3 py-4"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      {/* Pin icon bubble */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: isDefault
            ? "var(--color-primary)"
            : "var(--color-bg-subtle)",
          color: isDefault ? "white" : "var(--color-text-muted)",
        }}
      >
        <MapPinIcon className="w-5 h-5" strokeWidth={1.8} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p
            className="text-sm font-bold leading-snug"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
          >
            {address.address || address.city_name || t("addressDefault")}
          </p>

          {isDefault && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
                fontFamily: "var(--font-sans)",
              }}
            >
              <StarSolid className="w-3 h-3" />
              {t("defaultBadge")}
            </span>
          )}
        </div>

        <p
          className="text-sm leading-snug mb-2"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
        >
          {fullAddress}
        </p>

        {address.phone && (
          <p
            className="text-xs mb-2"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            📞 {address.phone}
          </p>
        )}

        {!isDefault && (
          <button
            onClick={() => onMakeDefault(address.id)}
            disabled={isMakingDefault}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold transition-opacity disabled:opacity-50"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
          >
            <StarIcon className="w-3.5 h-3.5" strokeWidth={2} />
            {isMakingDefault ? t("settingDefault") : t("setAsDefault")}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        {/* Edit */}
        <button
          onClick={() => onEdit(address)}
          aria-label={t("editAddress")}
          className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full active:scale-90 transition-all hover:bg-blue-50"
          style={{ color: "var(--color-text-muted)" }}
        >
          <PencilIcon className="w-4 h-4" strokeWidth={1.8} />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(address.id)}
          disabled={isDeleting}
          aria-label={t("deleteAddressAria")}
          className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full active:scale-90 transition-all hover:bg-red-50 disabled:opacity-40"
          style={{ color: "var(--color-text-muted)" }}
        >
          {isDeleting ? (
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#e53e3e" }}
            />
          ) : (
            <TrashIcon className="w-4 h-4" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
}