import { SettingsLayout } from "@/src/components/settings/SettingsLayout";
import { SettingsMenuRow } from "@/src/components/settings/SettingsMenuRow";
import { useTranslations } from "next-intl";

export default function AccountSettingsPage() {
  const t = useTranslations("settings");

  return (
    <SettingsLayout title={t("accountSettings")}>
      <nav className="mt-2">
        <SettingsMenuRow
          label={t("personalInformation")}
          href="/settings/personal-information"
        />
        <SettingsMenuRow
          label={t("savedAddresses")}
          href="/settings/saved-addresses"
        />
        <SettingsMenuRow
          label={t("deleteAccount")}
          href="/settings/delete-account"
          danger
        />
      </nav>
    </SettingsLayout>
  );
}