// src/contexts/NotificationContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LoginNotification } from "../components/common/LoginNotification";

interface NotificationContextType {
  showLoginNotification: (message?: string) => void;
  hideLoginNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [loginNotification, setLoginNotification] = useState<{
    visible: boolean;
    message?: string;
  }>({ visible: false, message: undefined });

  const showLoginNotification = (message?: string) => {
    setLoginNotification({ visible: true, message });
  };

  const hideLoginNotification = () => {
    setLoginNotification({ visible: false, message: undefined });
  };

  return (
    <NotificationContext.Provider
      value={{ showLoginNotification, hideLoginNotification }}
    >
      {children}
      {loginNotification.visible && (
        <LoginNotification
          message={loginNotification.message}
          onClose={hideLoginNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}