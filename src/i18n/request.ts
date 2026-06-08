import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: loadMessages(locale),
  };
});

function loadMessages(locale: string) {
  return {
    home: require(`../messages/${locale}/home.json`),
    common: require(`../messages/${locale}/common.json`),
    cart: require(`../messages/${locale}/cart.json`),
    checkout: require(`../messages/${locale}/checkout.json`),
    product: require(`../messages/${locale}/product.json`),
    singleProduct: require(`../messages/${locale}/singleProduct.json`),
    orders: require(`../messages/${locale}/orders.json`),
    settings: require(`../messages/${locale}/settings.json`),
    auth: require(`../messages/${locale}/auth.json`),
  };
}
