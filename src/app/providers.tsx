// src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";
import { LocationProvider } from "../contexts/LocationContext";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { useAddresses } from "../hooks/address/useAdresses";
import { LocationPickerModal } from "../components/home/location/LocationPickerModal";
import { setApiBaseUrl } from "../config/apiResolver";

function LocationGate({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { addresses, isLoading: addressesLoading } = useAddresses();

  const userHasNoAddresses =
    !authLoading && !!user && !addressesLoading && addresses.length === 0;

  return (
    <LocationProvider
      userHasNoAddresses={userHasNoAddresses}
      addresses={addresses}
      addressesLoading={addressesLoading}
    >
      <LocationPickerModal />
      {children}
    </LocationProvider>
  );
}

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  apiBaseUrl: string;
}

export function Providers({ children, locale, messages, apiBaseUrl }: ProvidersProps) {
  const queryClient = new QueryClient();
  setApiBaseUrl(apiBaseUrl);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* NextIntlClientProvider is INSIDE Providers so every context below it
            (NotificationProvider, LocationGate, LocationPickerModal, Navbar, etc.)
            can safely call useTranslations() */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <NotificationProvider>
              <LocationGate>
                {children}
              </LocationGate>
            </NotificationProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}