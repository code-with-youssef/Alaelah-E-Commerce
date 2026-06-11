"use client";

import Link from "next/link";
import { useSubCategories, useCategories } from "@/src/hooks/home/useCategories";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { Category } from "@/src/types/home/category";

const DEALS_CATEGORY_ID = 2;

// ─── Single sub card ──────────────────────────────────────────
function DealSubCard({ sub }: { sub: Category }) {
  const imageUrl = useResolvedUrl(sub.icon ?? null);
  const href = `/category/${DEALS_CATEGORY_ID}/${sub.slug.replace(/\./g, "")}?sub=${sub.id}`;

  return (
    <Link
      href={href}
      className="no-underline group flex flex-col rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--color-bg)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="w-full aspect-square overflow-hidden flex items-center justify-center p-3"
        style={{ backgroundColor: "var(--color-category-tile-bg, #eef4fb)" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={sub.name}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-2/3 h-2/3 rounded-xl" style={{ backgroundColor: "var(--color-bg-subtle)" }} />
        )}
      </div>
      <div className="px-2 py-2">
        <p
          className="text-xs font-semibold text-center leading-snug line-clamp-2"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-text)",
            height: "2.6em",
          }}
        >
          {sub.name}
        </p>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden animate-pulse"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      <div className="aspect-square w-full" />
      <div className="px-2 py-2">
        <div className="h-3 rounded-full w-3/4 mx-auto" style={{ backgroundColor: "var(--color-bg)" }} />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────
export function DealsClient() {
  const { data: allCategories } = useCategories();
  const { data: subCategories, isLoading, isError } = useSubCategories(DEALS_CATEGORY_ID);

  const dealsCategory = allCategories?.find((c) => c.id === DEALS_CATEGORY_ID);
  const headerImage = useResolvedUrl(dealsCategory?.icon ?? null);

  if (isError) return null;

  return (
    <div className="flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* ── Header banner ── */}
      <div
        className="flex items-center justify-between px-5 py-4 mx-3 mt-3 rounded-2xl"
        style={{ backgroundColor: "var(--color-category-banner-bg, #fdf8ee)" }}
      >
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {dealsCategory?.name ?? "Deals"}
        </span>
        {headerImage && (
          <img src={headerImage} alt={dealsCategory?.name} className="w-30 h-30 object-contain drop-shadow-md" />
        )}
      </div>

      {/* ── Sub cards grid ── */}
      <div
        className="grid gap-3 p-4"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : subCategories?.map((sub) => <DealSubCard key={sub.id} sub={sub} />)
        }
      </div>
    </div>
  );
}