import Link from "next/link";
import {
  AppStoreIcon,
  FacebookIcon,
  GooglePlayIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterXIcon,
} from "../common/icons/SocialIcons";
import { Logo } from "../navbar/Logo";
import { getTranslations } from "next-intl/server";
import { loadAppConfig } from "@/src/config/loadAppConfig";
import { getCurrentLocale } from "@/src/i18n/getCurrentLocale";
import { FooterAccountLinks } from "./FooterAccountLinks";
import { FooterFavouritesLink } from "./FooterFavouritesLink";

interface FooterLink {
  label: string;
  href: string;
}

export async function Footer() {
  const t = await getTranslations("home");
  const year = new Date().getFullYear();
  const config = await loadAppConfig();
  const locale = getCurrentLocale();

  const SHOP_LINKS: FooterLink[] = [
    { label: t("footer.allCategories"), href: "/categories" },
    { label: t("footer.brands"), href: "/brands" },
    { label: t("footer.dealsOffers"), href: "/category/2/magazine-offers" },
  ];

  const SOCIAL_LINKS = [
    {
      label: t("footer.instagram"),
      href: "https://instagram.com",
      icon: <InstagramIcon />,
    },
    {
      label: t("footer.twitter"),
      href: "https://x.com",
      icon: <TwitterXIcon />,
    },
    {
      label: t("footer.facebook"),
      href: "https://facebook.com",
      icon: <FacebookIcon />,
    },
    {
      label: t("footer.tiktok"),
      href: "https://tiktok.com",
      icon: <TikTokIcon />,
    },
  ];

  const LEGAL_LINKS = [
    { label: t("footer.privacyPolicy"), href: "/privacy" },
    { label: t("footer.termsOfService"), href: "/terms" },
    { label: t("footer.cookiePolicy"), href: "/cookies" },
  ];

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "var(--color-footer-bg)" }}
    >
      {/* Accent top line — always visible against the dark footer */}
      <div
        className="h-[3px] w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-muted) 50%, var(--color-primary) 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-10">
        {/* Brand + App download */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          {/* Brand block */}
          <div className="max-w-xs">
            <div className="flex justify-start">
              <Logo width={140} height={40} />
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "var(--color-footer-text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {locale === "en" ? config.en_description : config.ar_description}
            </p>

            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-150 hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: "var(--color-footer-icon-bg)",
                    color: "var(--color-footer-icon-color)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {/* App download buttons */}
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{
                color: "var(--color-footer-text-faint)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("footer.getTheApp")}
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="#"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--color-footer-bg-card)",
                  border: "1px solid var(--color-footer-border)",
                  minWidth: "170px",
                }}
              >
                <span style={{ color: "var(--color-footer-icon-color)" }}>
                  <AppStoreIcon />
                </span>
                <div>
                  <p
                    className="text-[10px] leading-none mb-0.5"
                    style={{
                      color: "var(--color-footer-text-faint)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {t("footer.downloadOn")}
                  </p>
                  <p
                    className="text-sm font-bold leading-none"
                    style={{
                      color: "var(--color-footer-text)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {t("footer.appStore")}
                  </p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--color-footer-bg-card)",
                  border: "1px solid var(--color-footer-border)",
                  minWidth: "170px",
                }}
              >
                <span style={{ color: "var(--color-footer-icon-color)" }}>
                  <GooglePlayIcon />
                </span>
                <div>
                  <p
                    className="text-[10px] leading-none mb-0.5"
                    style={{
                      color: "var(--color-footer-text-faint)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {t("footer.getItOn")}
                  </p>
                  <p
                    className="text-sm font-bold leading-none"
                    style={{
                      color: "var(--color-footer-text)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {t("footer.googlePlay")}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Nav columns */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10"
          style={{ borderBottom: "1px solid var(--color-footer-border)" }}
        >
          {/* Shop column */}
          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{
                color: "var(--color-primary-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("footer.shop")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150 hover:underline"
                    style={{
                      color: "var(--color-footer-text-muted)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <FooterFavouritesLink
                label={t("footer.favourites")}
                color="var(--color-footer-text-muted)"
              />
            </ul>
          </div>

          {/* Account column — only rendered client-side when a user exists */}
          <FooterAccountLinks
            labels={{
              myOrders: t("footer.myOrders"),
              cart: t("footer.cart"),
              savedAddresses: t("footer.savedAddresses"),
              accountSettings: t("footer.accountSettings"),
              account: t("footer.account"),
            }}
            textMutedColor="var(--color-footer-text-muted)"
            headingColor="var(--color-primary-muted)"
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {/*     {LEGAL_LINKS.map((link, i) => (
              <span key={link.label} className="flex items-center gap-5">
                <Link
                  href={link.href}
                  className="text-xs transition-colors duration-150 hover:underline"
                  style={{
                    color: "var(--color-footer-text-faint)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span
                    style={{
                      color: "var(--color-footer-border)",
                      fontSize: "10px",
                    }}
                  >
                    •
                  </span>
                )}
              </span>
            ))} */}
          </div>

          <p
            className="text-xs"
            style={{
              color: "var(--color-footer-text-faint)",
              fontFamily: "var(--font-sans)",
            }}
          >
            © {year} {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}