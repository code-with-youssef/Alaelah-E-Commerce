// src/components/products/client/BrandProductsClient.tsx
"use client";

import { useTranslations } from "next-intl";
import { Pagination } from "../../common/Pagination";
import Loader from "../../common/Loader";
import Error from "../../common/Error";
import type { Product } from "@/src/types/products/product";

import { useBrandProducts } from "@/src/hooks/products/useProducts";
import { useBrand } from "@/src/hooks/home/useBrands";
import { getCurrentLocale } from "@/src/i18n/getCurrentLocale";
import { BrandsHeader } from "../../home/brands/BrandsHeader";
import { FlatProductsGrid } from "../FlatProductsGrid";

interface BrandProductsClientProps {
  brandId: number;
  brandSlug: string;
}

export function BrandProductsClient({
  brandId,
  brandSlug,
}: BrandProductsClientProps) {
  const t = useTranslations("home");
  const locale = getCurrentLocale();

  const {
    data: brand,
    isLoading: brandLoading,
    isError: brandError,
  } = useBrand(brandSlug);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: productsLoading,
    isError: productsError,
  } = useBrandProducts(brandId);

  const allProducts: Product[] = data
    ? data.pages.flatMap((page) => page.products)
    : [];

  const lastPageMeta = data?.pages.at(-1)?.meta;
  const totalProducts = lastPageMeta?.total ?? 0;

  if (brandLoading || productsLoading) return <Loader />;
  if (brandError || productsError)
    return <Error message={t("brands.errorLoading")} />;

  const brandName =
    locale === "eg" && brand?.ar_name
      ? brand.ar_name
      : (brand?.en_name ?? brand?.name ?? "");

  return (
    <div
      className="min-h-dvh pb-24 md:pb-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Reusable hero header ─────────────────────────────── */}
      <BrandsHeader
        title={brandName}
        eyebrow={t("brands.officialStore")}
        logoUrl={brand?.logo}
        logoAlt={brandName}
        stats={[
          {
            label: t("brands.products"),
            value: totalProducts,
            color: "#c9a84c",
          },
          // Add more stats here if you have them, e.g. categories count
        ]}
      />

      {/* ── Products ─────────────────────────────────────────── */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        {/* section label row */}
        <div className="flex items-center justify-between py-4">
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("brands.allProducts")}
          </p>
        </div>

        {allProducts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            <p className="text-sm">{t("brands.noProducts")}</p>
          </div>
        ) : (
          <>
            <FlatProductsGrid
              products={allProducts}
              emptyMessage={t("brands.noProducts")}
            />

            {lastPageMeta && (
              <Pagination
                meta={lastPageMeta}
                onLoadMore={fetchNextPage}
                isLoading={isFetchingNextPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
