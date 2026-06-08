"use client";

import { useSubCategories } from "@/src/hooks/home/useCategories";
import { useCategories } from "@/src/hooks/home/useCategories";
import Loader from "../../common/Loader";
import Error from "../../common/Error";
import { Category } from "@/src/types/home/category";
import { CategoryProductsClient } from "../../products/client/CategoryProductsClient";

interface Props {
  categoryId: number;
  categorySlug: string;
}

export function SubCategoryClient({ categoryId, categorySlug }: Props) {
  // ── Fetch the parent category list to find the current category ──
  const {
    data: allCategories,
    isLoading: catsLoading,
    error: catsError,
  } = useCategories();

  const mainCategories: Category[] =
    allCategories?.filter(
      (cat) => cat.parent_id === 1,
    ) ?? [];

  // ── Fetch sub-categories of this category ──
  const {
    data: subCategories,
    isLoading: subsLoading,
    error: subsError,
  } = useSubCategories(categoryId);

  if (catsLoading || subsLoading) return <Loader />;
  if (catsError || subsError || !subCategories || !allCategories)
    return <Error message="Error loading category data" />;

  // Find the current category object from the full list
  const category: Category | undefined = allCategories.find(
    (c) => c.id === categoryId,
  );

  if (!category) return <Error message="Category not found" />;

  return (
    <CategoryProductsClient
      category={category}
      allCategories={mainCategories}
      subCategories={subCategories}
    />
  );
}
