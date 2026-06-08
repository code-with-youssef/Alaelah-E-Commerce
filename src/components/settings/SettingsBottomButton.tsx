interface SettingsBottomButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "disabled";
  type?: "button" | "submit";
}

export function SettingsBottomButton({
  label,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
}: SettingsBottomButtonProps) {
  const isDisabled = disabled || variant === "disabled";

  return (
    <div
      className="sticky bottom-0 left-0 right-0 p-4 -mx-4 md:mx-0 md:relative md:bottom-auto md:p-0 md:mt-8"
      style={{
        backgroundColor: "var(--color-bg)",
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className="w-full rounded-2xl py-4 cursor-pointer text-base font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed"
        style={{
          fontFamily: "var(--font-display)",
          backgroundColor: isDisabled ? "var(--color-bg-muted)" : "var(--color-primary)",
          color: isDisabled ? "var(--color-text-placeholder)" : "#ffffff",
        }}
      >
        {label}
      </button>
    </div>
  );
}