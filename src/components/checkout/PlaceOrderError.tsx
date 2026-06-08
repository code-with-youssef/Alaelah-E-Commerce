import { useTranslations } from "next-intl";

export function PlaceOrderError({ message }: { message: string }) {
  const t = useTranslations("checkout");

  // API returns: "No orders were created. <Arabic/English detail>: <product name>"
  const colonIdx = message.lastIndexOf(":");
  const hasProduct = colonIdx !== -1 && colonIdx < message.length - 1;
  const productName = hasProduct ? message.slice(colonIdx + 1).trim() : null;

  const isStockError =
    message.includes("الكمية المطلوبة غير متوفرة") ||
    message.includes("quantity") ||
    message.includes("stock") ||
    message.includes("Stocked");

  return (
    <div className="w-full">
      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3.5"
        style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
        }}
      >
        <svg
          className="w-5 h-5 shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#b91c1c"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-bold leading-snug"
            style={{ color: "#b91c1c", fontFamily: "var(--font-display)" }}
          >
            {isStockError
              ? t("orderError.stockTitle")
              : t("orderError.genericTitle")}
          </p>
          <p
            className="text-sm mt-0.5 leading-snug"
            style={{ color: "#991b1b", fontFamily: "var(--font-sans)" }}
          >
            {isStockError && productName
              ? t("orderError.stockDetail", { product: productName })
              : t("orderError.genericDetail")}
          </p>
        </div>
      </div>
    </div>
  );
}