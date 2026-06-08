import { getCurrentLocale } from "../i18n/getCurrentLocale";

export function getWeightLabel(variant: string): string {
  if (!variant) return "";

  const locale = getCurrentLocale();
  const isArabic = locale === "eg";

  // Case-insensitive match for units
  const match = variant.match(
    /([\d.]+)\s*(kg|kilo|gm|g|gram|piece|pieces)/i
  );

  if (!match) {
    // Handle unit-only strings (e.g., "Piece", "KILO")
    const unitMatch = variant.match(/^(kg|kilo|gm|g|gram|piece|pieces)$/i);
    if (!unitMatch) return variant;

    const originalUnit = unitMatch[1];
    const unitKey = originalUnit.toLowerCase();
    
    const map: Record<string, { en: string; eg: string }> = {
      kg: { en: "kg", eg: "كيلو" },
      kilo: { en: "kg", eg: "كيلو" },
      gm: { en: "gm", eg: "جرام" },
      g: { en: "gm", eg: "جرام" },
      gram: { en: "gm", eg: "جرام" },
      piece: { en: "piece", eg: "قطعة" },
      pieces: { en: "piece", eg: "قطعة" },
    };

    const translatedUnit = map[unitKey]?.[isArabic ? "eg" : "en"] ?? originalUnit;
    return isArabic ? `\u200F${translatedUnit}` : translatedUnit;
  }

  const value = match[1]; // Preserves original number format
  const originalUnit = match[2];
  const unitKey = originalUnit.toLowerCase();

  const map: Record<string, { en: string; eg: string }> = {
    kg: { en: "kg", eg: "كيلو" },
    kilo: { en: "kg", eg: "كيلو" },
    gm: { en: "gm", eg: "جرام" },
    g: { en: "gm", eg: "جرام" },
    gram: { en: "gm", eg: "جرام" },
    piece: { en: "piece", eg: "قطعة" },
    pieces: { en: "piece", eg: "قطعة" },
  };

  const translatedUnit = map[unitKey]?.[isArabic ? "eg" : "en"] ?? originalUnit;
  const result = `${value} ${translatedUnit}`;

  return isArabic ? `\u200F${result}` : result;
}