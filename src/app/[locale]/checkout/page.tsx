import { CheckoutClient } from "@/src/components/checkout/client/CheckoutClient";

interface PageProps {
  searchParams: Promise<{ subtotal?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { subtotal: subtotalParam } = await searchParams;
  const subtotal = parseFloat(subtotalParam ?? "0") || 0;

  return (
    <CheckoutClient
      initialSummary={{
        subtotal,
        serviceFee: 0,
        pointsEarned: Math.floor(subtotal * 2),
      }}
    />
  );
}