"use client";

import { PaginationMeta } from "@/src/types/shared/pagination";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface PaginationProps {
  meta: PaginationMeta;
  onLoadMore: () => void;
  isLoading?: boolean;
}

export function Pagination({ meta, onLoadMore, isLoading = false }: PaginationProps) {
  const { current_page, last_page, to, total, per_page } = meta;
  const hasMore = current_page < last_page;
  const t = useTranslations("common");

  // Each page fills an equal segment — so page 1 of 4 = 25%, page 2 = 50%, etc.
  const progress = last_page > 0 ? Math.round((current_page / last_page) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Progress bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        <p
          className="text-xs font-medium"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
        >
          {t("pagination.showing", { shown: to ?? 0, total: total })}
        </p>

        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-muted)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-primary)",
              transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        <p
          className="text-[11px]"
          style={{ color: "var(--color-text-placeholder)", fontFamily: "var(--font-sans)" }}
        >
          {t("pagination.pageInfo", { current: current_page, total: last_page })}
        </p>
      </div>

      {/* Load more button */}
      {hasMore ? (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm
                     transition-all duration-150 active:scale-95 disabled:opacity-60"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
            fontFamily: "var(--font-sans)",
            boxShadow: "0 4px 14px rgba(46, 115, 161, 0.35)",
          }}
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
              {t("pagination.loading")}
            </>
          ) : (
            <>
              {t("pagination.loadMore")}
              <span
                className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                +{Math.min(per_page, total - (to ?? 0))}
              </span>
            </>
          )}
        </button>
      ) : (
        <p
          className="text-sm font-medium px-6 py-2 rounded-full"
          style={{
            backgroundColor: "var(--color-bg-subtle)",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-sans)",
            border: "1px solid var(--color-border)",
          }}
        >
          {t("pagination.allSeen", { total: total })}
        </p>
      )}
    </div>
  );
}