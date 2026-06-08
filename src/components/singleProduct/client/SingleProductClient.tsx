"use client";

import { useState, useEffect } from "react";
import { SingleProductDesktop } from "../SingleProductDesktop";
import { SingleProductMobile } from "../SingleProductMobile";
import { useProductDetails, usePaginatedRelatedProducts } from "@/src/hooks/products/useProducts";
import Loader from "../../common/Loader";
import Error from "../../common/Error";

interface SingleProductClientProps {
  productId: string | number;
}

export function SingleProductClient({ productId }: SingleProductClientProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const { data: product, isLoading, error } = useProductDetails(productId);
  
  // Use paginated hook
  const {
    data: relatedPages,
    isLoading: isRelatedLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedRelatedProducts(Number(productId));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isLoading) return <Loader />;
  if (error || !product) return <Error message="حدث خطأ أو المنتج غير موجود" />;
  if (isMobile === null) return null;

  // Flatten all loaded products from all pages
  const allRelatedProducts = relatedPages?.pages.flatMap(page => page.products) || [];
  const lastPageMeta = relatedPages?.pages[relatedPages.pages.length - 1]?.meta;


  const sharedProps = {
    product,
    relatedProducts: allRelatedProducts,
    isRelatedLoading,
    hasMore: hasNextPage,
    onLoadMore: () => fetchNextPage(),
    isLoadingMore: isFetchingNextPage,
    meta: lastPageMeta,
  };

  return isMobile ? (
    <SingleProductMobile {...sharedProps} />
  ) : (
    <SingleProductDesktop {...sharedProps} />
  );
}