import { use } from "react";
import { notFound } from "next/navigation";
import { BrandProductsClient } from "@/src/components/products/client/BrandProductsClient";

// app/brands/[id]/[slug]/page.tsx  (or wherever your brand page lives)

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export default function BrandPage({ params }: PageProps) {
  const { id, slug} = use(params);
  const brandId = Number(id);

  if (isNaN(brandId)) notFound();

  return <BrandProductsClient brandId={brandId} brandSlug={slug} />;
}
