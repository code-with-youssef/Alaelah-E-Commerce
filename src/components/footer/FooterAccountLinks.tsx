"use client";

import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";

interface FooterAccountLinksLabels {
  myOrders: string;
  cart: string;
  savedAddresses: string;
  accountSettings: string;
  account: string;
}

interface FooterAccountLinksProps {
  labels: FooterAccountLinksLabels;
  textMutedColor: string;
  headingColor: string;
}

export function FooterAccountLinks({
  labels,
  textMutedColor,
  headingColor,
}: FooterAccountLinksProps) {
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { label: labels.myOrders, href: "/orders" },
    { label: labels.cart, href: "/cart" },
    { label: labels.savedAddresses, href: "/settings/saved-addresses" },
    { label: labels.accountSettings, href: "/settings" },
  ];

  return (
    <div>
      <h3
        className="text-[11px] font-bold uppercase tracking-widest mb-4"
        style={{ color: headingColor, fontFamily: "var(--font-sans)" }}
      >
        {labels.account}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm transition-colors duration-150 hover:underline"
              style={{ color: textMutedColor, fontFamily: "var(--font-sans)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}