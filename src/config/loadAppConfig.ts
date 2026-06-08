// src/config/loadAppConfig.ts
export const loadAppConfig = async () => {
  if (typeof window === "undefined") {
    // Server: read directly from disk
    const { default: fs } = await import("node:fs/promises");
    const { default: path } = await import("node:path");

    const filePath = path.join(process.cwd(), "public/assets/config.json");
    const file = await fs.readFile(filePath, "utf-8");
    return JSON.parse(file);
  } else {
    // Browser: relative fetch works fine
    const res = await fetch("/assets/config.json");
    if (!res.ok) throw new Error("Failed to load config");
    return res.json();
  }
};