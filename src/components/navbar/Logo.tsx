import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width, height }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 select-none"
      aria-label="Go to homepage"
    >
      {/* Icon mark */}
      <img
        src="/assets/images/logo.svg"
        alt="All In Z logo"
        width={width || 130}
        height={height || 32}
        aria-hidden="true"
      />
    </Link>
  );
}
