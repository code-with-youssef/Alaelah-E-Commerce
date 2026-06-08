import { CartClient } from "@/src/components/cart/client/CartClient";
export default async function CartPage() {
  return <CartClient />;
}

export const metadata = {
  title: "Cart",
  description: "Review your cart and proceed to checkout",
};
