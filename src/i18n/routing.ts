import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "eg"],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
