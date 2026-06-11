"use client";

import Link from "next/link";
import {
  useCategories,
  useSubCategories,
} from "@/src/hooks/home/useCategories";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { useTranslations } from "next-intl";
import { Category } from "@/src/types/home/category";

/**
 * Responsive sub-count (excluding the View More tile):
 *   mobile  (default) : 3  → grid-cols-4
 *   sm  ≥640px        : 4  → grid-cols-5
 *   md  ≥768px        : 5  → grid-cols-6
 *   lg  ≥1024px       : 7  → grid-cols-8
 *
 * We render up to 7 subs and hide the ones that don't fit at each
 * breakpoint using explicit per-index visibility classes.
 */

// index → tailwind class that makes it visible only from the right breakpoint
const SUB_VISIBILITY: Record<number, string> = {
  0: "", // always visible
  1: "", // always visible
  2: "", // always visible
  3: "hidden sm:block", // visible sm+
  4: "hidden md:block", // visible md+
  5: "hidden lg:block", // visible lg+
  6: "hidden lg:block", // visible lg+
};

// ─── Single category banner card ─────────────────────────────
function CategoryBannerCard({ category }: { category: Category }) {
  const imageUrl = useResolvedUrl(category.icon ?? null);
  const href = `/category/${category.id}/${category.slug.replace(/\./g, "")}`;
  const t = useTranslations("home");

  return (
    <Link
      href={href}
      className="flex flex-row items-center  rounded-2xl overflow-hidden px-5 py-6 min-h-[150px] [background-color:var(--color-category-banner-bg)] hover:opacity-90 transition-opacity no-underline gap-3"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={category.name}
          className="w-[250px] h-[250px] object-contain drop-shadow-md"
        />
      )}
      <div className="flex flex-col items-center gap-0.5">
        <span
          className="text-[1.1rem] font-bold leading-tight text-center"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {category.name}
        </span>
        <span
          className="text-[0.8rem]"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-text-muted)",
          }}
        >
          {t("categories.explore")} {category.name}
        </span>
      </div>
    </Link>
  );
}

// ─── Subcategory tile ─────────────────────────────────────────
function SubCategoryTile({
  sub,
  parentId,
  parentSlug,
}: {
  sub: Category;
  parentId: number;
  parentSlug: string;
}) {
  const imageUrl = useResolvedUrl(sub.icon ?? null);
  const href = `/category/${parentId}/${parentSlug.replace(/\./g, "")}?sub=${sub.id}`;

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 no-underline group"
    >
      <div className="w-full aspect-square rounded-[14px] overflow-hidden [background-color:var(--color-category-tile-bg)] flex items-center justify-center p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={sub.name}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
          />
        ) : (
          <div className="w-3/5 h-3/5 rounded-lg [background-color:var(--color-bg-subtle)]" />
        )}
      </div>
      <span
        className="text-[0.7rem] font-medium text-center leading-snug line-clamp-2 w-full"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
      >
        {sub.name}
      </span>
    </Link>
  );
}

// ─── View More tile ───────────────────────────────────────────
function ViewMoreTile({ href }: { href: string }) {
  const t = useTranslations("home");

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 no-underline group"
    >
      <div
        className="w-full aspect-square rounded-[14px] flex items-center justify-center [background-color:var(--color-category-tile-bg)] group-hover:[background-color:var(--color-category-tile-bg-hover)] transition-colors duration-200"
        style={{ color: "var(--color-primary)" }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="2"
            width="10"
            height="10"
            rx="2.5"
            fill="currentColor"
            opacity="0.85"
          />
          <rect
            x="16"
            y="2"
            width="10"
            height="10"
            rx="2.5"
            fill="currentColor"
            opacity="0.85"
          />
          <rect
            x="2"
            y="16"
            width="10"
            height="10"
            rx="2.5"
            fill="currentColor"
            opacity="0.85"
          />
          <rect
            x="16"
            y="16"
            width="10"
            height="10"
            rx="2.5"
            fill="currentColor"
            opacity="0.85"
          />
        </svg>
      </div>
      <span
        className="text-[0.7rem] font-semibold text-center"
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--color-primary)",
        }}
      >
        {t("viewAll")}
      </span>
    </Link>
  );
}

// ─── One full category block (banner + subs row) ──────────────
function CategoryBlock({ category }: { category: Category }) {
  const { data: subCategories, isLoading } = useSubCategories(category.id);
  const href = `/category/${category.id}/${category.slug.replace(/\./g, "")}`;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 py-3.5 mb-6">
        <div className="rounded-2xl min-h-[150px] animate-pulse [background-color:var(--color-bg-subtle)]" />
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-[14px] animate-pulse [background-color:var(--color-bg-subtle)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!subCategories || subCategories.length === 0) return null;

  // Max 7 subs rendered — indices 3–6 are hidden below their breakpoint
  const allSubs = subCategories.slice(0, 7);

  return (
    <div className="flex flex-col gap-2.5 py-3.5 mb-6">
      <CategoryBannerCard category={category} />

      {/*
        grid-cols-4  → 3 subs + View More  (mobile)
        grid-cols-5  → 4 subs + View More  (sm)
        grid-cols-6  → 5 subs + View More  (md)
        grid-cols-8  → 7 subs + View More  (lg)
        Items hidden below their breakpoint via SUB_VISIBILITY map.
      */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {allSubs.map((sub, idx) => (
          <div
            key={sub.id}
            className={SUB_VISIBILITY[idx] ?? "hidden lg:block"}
          >
            <SubCategoryTile
              sub={sub}
              parentId={category.id}
              parentSlug={category.slug}
            />
          </div>
        ))}
        <ViewMoreTile href={href} />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────
export function AllCategorySections() {
  const { data: allCategories, isLoading } = useCategories();

  const mainCategories: Category[] =
    allCategories?.filter((c) => c.parent_id === 1) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2.5 py-3.5 mb-6">
            <div className="rounded-2xl min-h-[150px] animate-pulse [background-color:var(--color-bg-subtle)]" />
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {Array.from({ length: 4 }).map((__, j) => (
                <div
                  key={j}
                  className="aspect-square rounded-[14px] animate-pulse [background-color:var(--color-bg-subtle)]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mainCategories.length === 0) return null;

  return (
    <div className="flex flex-col">
      {mainCategories.map((cat) => (
        <CategoryBlock key={cat.id} category={cat} />
      ))}
    </div>
  );
}
