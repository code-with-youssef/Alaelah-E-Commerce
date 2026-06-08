"use client";

import { ProtectedRoute } from "@/src/HOCs/ProtectedRoutes";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
