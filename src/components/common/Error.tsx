// components/common/Error.tsx
"use client";

import { useTranslations } from "next-intl";

export default function Error({ message }: { message?: string }) {
  const t = useTranslations("common");

  const errorTitle = t("error.title");
  const defaultMessage = t("error.defaultMessage");

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <p className="text-red-500 text-lg font-semibold mb-2">😢 {errorTitle}</p>
      <p className="text-gray-700">{message || defaultMessage}</p>
    </div>
  );
}
