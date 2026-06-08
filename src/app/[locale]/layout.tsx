// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../../components/navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "../providers";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { loadAppConfig } from "@/src/config/loadAppConfig";
import { resolveApiBaseUrlServer } from "@/src/config/resolveApiBaseUrlServer";

const config = await loadAppConfig();
const apiBaseUrl = await resolveApiBaseUrlServer();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.appName,
  description: "Fast grocery delivery to your door",
  icons: config.icon,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans text-base text-[var(--color-text)] min-h-dvh flex flex-col`}
      >
        {/* locale + messages flow into NextIntlClientProvider inside Providers */}
        <Providers locale={locale} messages={messages} apiBaseUrl={apiBaseUrl}>
          <main
            className="flex-1 px-4 md:px-6 lg:px-8 pb-16 md:pb-24"
            dir={locale === "eg" ? "rtl" : "ltr"}
          >
            <Navbar />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
