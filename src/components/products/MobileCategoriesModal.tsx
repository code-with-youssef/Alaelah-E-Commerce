import { Category } from "@/src/types/home/category";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// ── Categories bottom-sheet modal ────────────────────────────
export default function MobileCategoriesModal({
  categories,
  activeId,
  onClose,
}: {
  categories: Category[];
  activeId: number;
  onClose: () => void;
}) {
  const t = useTranslations("product");
  const router = useRouter();

  const handleSelect = (cat: Category) => {
    router.push(`/category/${cat.id}/${cat.slug.replace(/\./g, "")}`);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl animate-fade-in overflow-hidden"
        style={{ backgroundColor: "var(--color-bg)", maxHeight: "80dvh" }}
        role="dialog"
        aria-label={t("categoriesDialog")}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pb-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            {t("allCategories")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-bg-muted)", color: "var(--color-text-muted)" }}
            aria-label={t("close")}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(80dvh - 90px)" }}>
          {categories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                }}
                aria-label={t("selectCategory", { name: cat.name })}
              >
                <span
                  className="text-sm font-semibold"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: isActive ? "var(--color-primary)" : "var(--color-text)",
                  }}
                >
                  {cat.name}
                </span>
                <ChevronRightIcon
                  className="w-4 h-4 shrink-0"
                  style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-placeholder)" }}
                />
              </button>
            );
          })}
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}