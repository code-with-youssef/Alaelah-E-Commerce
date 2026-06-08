import { redirect } from "next/navigation";
import { SingleProductClient } from "@/src/components/singleProduct/client/SingleProductClient";
function parseIdFromSlug(slug: string): number {
  const id = parseInt(slug.split("-")[0], 10);
  if (isNaN(id)) redirect("/");
  return id;
}
interface ProductPageProps {
  params: Promise<{ slug: string }>;
}
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productId = parseIdFromSlug(slug);
  return <SingleProductClient productId={productId} />;
}
