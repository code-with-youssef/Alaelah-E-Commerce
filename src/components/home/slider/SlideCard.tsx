import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { Banner } from "@/src/types/home/banner";
import { resolveBannerUrl } from "@/src/utils/bannerUrlResolver";
import { useTranslations } from "next-intl";

export default function SlideCard({
  slide,
  isActive,
}: {
  slide: Banner;
  isActive: boolean;
}) {
  const imageUrl = useResolvedUrl(slide.photo);

  function useBannerLinkUrl(rawUrl: string | undefined): string {
    const patternUrl = resolveBannerUrl(rawUrl); // null → no pattern matched
    const resolvedUrl = useResolvedUrl(rawUrl ?? null); // storage-base fallback

    return patternUrl ?? resolvedUrl ?? "#";
  }
  const linkUrl = useBannerLinkUrl(slide.url);
  const t = useTranslations("home");

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 transition-opacity duration-500 ease-in-out select-none"
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
        zIndex: isActive ? 2 : 1,
        display: "block",
      }}
      tabIndex={isActive ? 0 : -1}
      draggable={false}
      aria-label={t("slider.slideLinkAlt")}
    >
      {/* Blurred background */}
      {/*       <div className="absolute inset-0 overflow-hidden">
       */}{" "}
      {/*  <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: "blur(25px) brightness(0.7)",
            transform: "scale(1.2)",
          }}
        /> */}
      {/* Main image */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <img
          src={imageUrl}
          alt={t("slider.slideImageAlt")}
          className="w-full h-full object-full max-h-full max-w-full"
          draggable={false}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/default.png";
          }}
        />
      </div>
      {/*       </div>
       */}
      {/* Dark overlay */}
      {/*       <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
       */}
      {/* Decorative circles — desktop only */}
      {/*     <span
        className="hidden md:block absolute -top-8 -right-8 w-40 h-40 rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      />
      <span
        className="hidden md:block absolute -bottom-12 -left-6 w-48 h-48 rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      /> */}
    </a>
  );
}
