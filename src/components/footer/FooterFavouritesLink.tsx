"use client";

import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";

interface FooterFavouritesLinkProps {
  label: string;
  color: string;
}

export function FooterFavouritesLink({ label, color }: FooterFavouritesLinkProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <li>
      <Link
        href="/favourites"
        className="text-sm transition-colors duration-150 hover:underline"
        style={{ color, fontFamily: "var(--font-sans)" }}
      >
        {label}
      </Link>
    </li>
  );
}