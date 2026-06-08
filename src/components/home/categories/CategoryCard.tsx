import { Category } from "@/src/types/home/category";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";

export default function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  const t = useTranslations("home");

  const resolvedSrc = useResolvedUrl(category.banner || category.icon);

  return (
    <Link
      href={`/category/${category.id}/${category.slug.replace(/\./g, "")}`}
      className=" animate-fade-in group block rounded-xl overflow-hidden"
      style={{ animationDelay: `${index * 40}ms` }}
      aria-label={t("category.cardAriaLabel", { name: category.name })}
    >
      {/* Image */}
      <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
        {resolvedSrc && (
          <img
            src={resolvedSrc}
            alt={t("category.imageAlt", { name: category.name })}
            className="absolute bottom-0 right-0 top-3 w-full h-full object-cover object-center
                       transition-transform duration-300 group-hover:scale-105 rounded-xl"
            style={{ borderRadius: "12px 0 0 0" }}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/default.png";
            }}
          />
        )}
      </div>
      {/* Text on top */}
      <div className="px-3 pt-4 text-center pb-1">
        <p
          className="text-sm font-bold leading-tight line-clamp-2"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-text)",
          }}
        >
          {category.name}
        </p>
      </div>
    </Link>
  );
}
