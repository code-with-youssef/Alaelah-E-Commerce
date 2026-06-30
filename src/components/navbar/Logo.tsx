"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width, height }: LogoProps) {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <Link
      href="/"
      className="flex items-center gap-2 select-none"
      aria-label="Go to homepage"
    >
      <img
        src={locale === "eg" ? "/assets/images/ar_logo.svg" : "/assets/images/en_logo.svg"}
        alt="All In Z logo"
        width={width || 130}
        height={height || 32}
        aria-hidden="true"
      />
    </Link>
  );
}