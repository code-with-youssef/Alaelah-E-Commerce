/**
 * resolveBannerUrl.ts
 *
 * Resolves a raw banner URL string into a Next.js app route.
 * Returns `null` when no pattern matches — the caller should
 * fall back to `useResolvedUrl` in that case.
 *
 * Supported input patterns
 * ────────────────────────
 * 1. product/{id}        → /products/{id}-slug
 * 2. products/{sub}/{parent} → /category/{parent}-slug?sub={sub}
 * 3. products/{mainId}   → /category/{mainId}-slug
 * 4. brands/{brandId}    → /brand/{brandId}-slug
 *
 * Anything else → null  (caller uses useResolvedUrl as fallback)
 */

const SLUG_PLACEHOLDER = "slug";

export function resolveBannerUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();

  // ── 1. product/{id} ──────────────────────────────────────────
  const productMatch = trimmed.match(/^product\/(\d+)$/i);
  if (productMatch) {
    return `/products/${productMatch[1]}-${SLUG_PLACEHOLDER}`;
  }

  // ── 2 & 3. products/{...} ────────────────────────────────────
  const productsMatch = trimmed.match(/^products\/(\d+)(?:\/(\d+))?$/i);
  if (productsMatch) {
    const first = productsMatch[1];
    const second = productsMatch[2];

    if (second) {
      // Case 2 — products/{subCategoryId}/{parentCategoryId}
      return `/category/${second}/${SLUG_PLACEHOLDER}?sub=${first}`;
    }
    // Case 3 — products/{mainCategoryId}
    return `/category/${first}/${SLUG_PLACEHOLDER}`;
  }

  // ── 4. brands/{brandId} ──────────────────────────────────────
  const brandMatch = trimmed.match(/^brands\/(\d+)$/i);
  if (brandMatch) {
    return `/brand/${brandMatch[1]}/${SLUG_PLACEHOLDER}`;
  }

  // ── No pattern matched → caller falls back to useResolvedUrl ─
  return null;
}