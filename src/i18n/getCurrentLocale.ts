import { routing } from "./routing";

type Locale = (typeof routing.locales)[number];

export function getCurrentLocale(): Locale {
  if (typeof window === "undefined") {
    return routing.defaultLocale;
  }

  const locale = window.location.pathname.split("/")[1];

  return (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}