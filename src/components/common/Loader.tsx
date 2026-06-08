// components/common/Loader.tsx
"use client";

import { useTranslations } from "next-intl";

export default function Loader({ text }: { text?: string }) {
  const t = useTranslations("common");
  
  const displayText = text || t("loading");

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 text-lg font-medium">{displayText}</p>
    </div>
  );
}