"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { Logo } from "@/src/components/navbar/Logo";
import { apiRequest } from "@/src/lib/shared/apiClient";
import { setToken } from "@/src/lib/shared/tokenServices";

export default function LoginForm() {
  const t = useTranslations("auth.login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    login_by: "phone",
    user_type: "customer",
  });

  const [errorMessages, setErrorMessages] = useState<Record<string, string[]>>(
    {},
  );
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const detectLoginBy = (value: string): "email" | "phone" => {
    const trimmed = value.trim();
    if (trimmed.startsWith("0") || trimmed.startsWith("+")) return "phone";
    if (trimmed.includes("@")) return "email";
    return "phone"; // default
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "email" ? { login_by: detectLoginBy(value) } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/api/v2/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrorMessages(data.errors);
        } else {
          setGeneralError(data.message || t("generalError"));
        }
        setIsLoading(false);
        return;
      }

      if (data.access_token) {
        setToken(data.access_token);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("userLoggedIn"));
        }
        setFormData({
          email: "",
          password: "",
          login_by: "phone",
          user_type: "customer",
        });
        const callbackUrl = searchParams.get("callbackUrl") ?? "/";
        router.replace(callbackUrl);
      } else {
        setGeneralError(t("generalError"));
      }
    } catch {
      setGeneralError(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      key: "email",
      label: t("emailOrPhone"),
      placeholder: t("emailOrPhonePlaceholder"),
      type: "text",
    },
    {
      key: "password",
      label: t("password"),
      placeholder: t("passwordPlaceholder"),
      type: "password",
    },
  ] as const;

  return (
    <div
      className="page flex flex-col items-center justify-center px-4"
      style={{
        minHeight: "calc(100vh - 120px)",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div className="max-w-[480px] w-full">
        {/* Logo — compact */}
        <div className="flex justify-center mb-4">
          <Logo width={160} />
        </div>

        <div
          className="card p-4 sm:p-6"
          style={{ backgroundColor: "var(--color-bg-subtle)" }}
        >
          <h1 className="text-center text-2xl font-bold leading-tight">
            {t("title")}
          </h1>

          {generalError && (
            <div className="mt-3 p-2.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-error text-xs text-center">{generalError}</p>
            </div>
          )}

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key} className="input-group" dir="rtl">
                <label className="input-label text-sm">{label}</label>
                <div className="relative flex items-center">
                  <input
                    name={key}
                    type={type}
                    required
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={handleChange}
                    className={`input ${
                      errorMessages[key]
                        ? "border-error focus:border-error"
                        : ""
                    }`}
                    style={{
                      height: "2.5rem",
                      fontSize: "0.875rem",
                      backgroundColor: "var(--color-bg)",
                    }}
                    dir="rtl"
                  />
                </div>
                {errorMessages[key] && (
                  <p className="text-error text-xs mt-0.5">
                    {errorMessages[key][0]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary btn-full mt-2 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ height: "2.75rem" }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </button>

            <p className="text-xs text-center text-muted pt-1">
              {t("noAccount")}{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary-hover font-semibold"
              >
                {t("registerLink")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
