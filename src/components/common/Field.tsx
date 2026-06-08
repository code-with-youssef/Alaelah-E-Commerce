import { useTranslations } from "next-intl";

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("settings");

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-error, #e53e3e)" }}> *</span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="text-xs"
          style={{
            color: "var(--color-error, #e53e3e)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
