import { use } from "react";
import { SubCategoryClient } from "@/src/components/products/client/SubCategoryClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { id, slug } = use(params);
  const categoryId = Number(id);


  if (isNaN(categoryId)) {
    notFound();
  }

  return <SubCategoryClient categoryId={categoryId} categorySlug={slug} />;
}
