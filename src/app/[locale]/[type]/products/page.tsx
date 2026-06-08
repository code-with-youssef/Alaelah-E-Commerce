import { HomeProductsClient } from "@/src/components/products/client/HomeProductsClient";
import { HomeProductsType } from "@/src/types/products/product";

interface PageProps {
  params: Promise<{
    type: HomeProductsType;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { type } = await params;
  return <HomeProductsClient type={type} title="Products" />;
}
