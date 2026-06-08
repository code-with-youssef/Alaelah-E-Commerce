// src/components/common/PageHeroHeader.tsx
"use client";

import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";

export interface PageHeroHeaderProps {
  /** Large title shown in the hero */
  title: string;
  /** Small label above the title e.g. "Official Brand Store" | "Search Results" */
  eyebrow?: string;
  /** Logo / image URL (optional) */
  logoUrl?: string | null;
  /** Alt text for the logo */
  logoAlt?: string;
  /** Stats row – pass any array of { label, value, color? } */
  stats?: { label: string; value: string | number; color?: string }[];
}

/**
 * Reusable dark-hero header.
 * Used by: BrandProductsClient, SearchPage, FavouritesPage, etc.
 */
export function BrandsHeader({
  title,
  eyebrow,
  logoUrl,
  logoAlt,
  stats = [],
}: PageHeroHeaderProps) {
  const resolvedLogo = useResolvedUrl(logoUrl ?? null);

  return (
    <div style={styles.hero}>
      {/* decorative rings */}
      <div style={styles.ring1} />
      <div style={styles.ring2} />

      <div style={styles.inner}>
        {/* ── Logo ── */}
        {(resolvedLogo || title) && (
          <div style={styles.logoFrame}>
            {/* spinning gold border */}
            <div style={styles.logoSpin} className="hero-logo-spin" />
            <div style={styles.logoInner}>
              {resolvedLogo ? (
                <img
                  src={resolvedLogo}
                  alt={logoAlt ?? title}
                  style={styles.logoImg}
                  loading="eager"
                />
              ) : (
                <div style={styles.logoFallback}>
                  {title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Text + stats ── */}
        <div style={styles.info}>
          {eyebrow && <p style={styles.eyebrow}>{eyebrow}</p>}

          <h1 style={styles.title}>{title}</h1>

          {stats.length > 0 && (
            <div style={styles.statsRow}>
              {stats.map((s, i) => (
                <div key={i} style={styles.statPill}>
                  <span
                    style={{
                      ...styles.statDot,
                      background: s.color ?? "#c9a84c",
                    }}
                  />
                  <span style={styles.statLabel}>{s.label}</span>
                  <span style={styles.statValue}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* wave bottom */}
      <svg
        viewBox="0 0 1200 50"
        preserveAspectRatio="none"
        style={styles.wave}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,35 C300,0 900,55 1200,18 L1200,50 L0,50 Z"
          fill="var(--color-bg, #f7f5f2)"
        />
      </svg>

      {/* spinning animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes hero-spin { to { transform: rotate(360deg); } }
        .hero-logo-spin { animation: hero-spin 8s linear infinite; }
      `}</style>
    </div>
  );
}

// ── inline styles (avoids Tailwind purge issues for dynamic values) ──────────

const GOLD = "#c9a84c";

const styles: Record<string, React.CSSProperties> = {
  hero: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)",
    paddingBottom: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  ring1: {
    position: "absolute",
    right: -120,
    top: -120,
    width: 380,
    height: 380,
    borderRadius: "50%",
    border: `1px solid rgba(201,168,76,0.15)`,
    pointerEvents: "none",
  },
  ring2: {
    position: "absolute",
    right: -60,
    top: -60,
    width: 260,
    height: 260,
    borderRadius: "50%",
    border: `1px solid rgba(201,168,76,0.10)`,
    pointerEvents: "none",
  },
  inner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 860,
    margin: "0 auto",
    padding: "2.5rem 1.5rem 2rem",
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
  logoFrame: {
    flexShrink: 0,
    position: "relative",
    width: 108,
    height: 108,
  },
  logoSpin: {
    position: "absolute",
    inset: -6,
    borderRadius: 28,
    background:
      "conic-gradient(from 0deg,#c9a84c,#e8d5a3,#c9a84c,#8a6a1e,#c9a84c)",
    opacity: 0.75,
  } as React.CSSProperties,
  logoInner: {
    position: "absolute",
    inset: 3,
    borderRadius: 22,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImg: {
    width: "80%",
    height: "80%",
    objectFit: "contain",
  },
  logoFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg,#e8d5a3,${GOLD})`,
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#1a1a2e",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(201,168,76,0.85)",
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(26px,5vw,40px)",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.1,
    marginBottom: "1rem",
    letterSpacing: "-0.02em",
  },
  statsRow: {
    display: "flex",
    gap: "0.85rem",
    flexWrap: "wrap",
  },
  statPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.35rem 0.9rem",
    borderRadius: 100,
    background: "rgba(255,255,255,0.07)",
    border: "0.5px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: 400,
  },
  statValue: {
    fontSize: 12,
    color: "#fff",
    fontWeight: 500,
  },
  wave: {
    display: "block",
    width: "100%",
    height: 40,
    marginTop: -1,
  },
};