// useResolvedUrl.ts
import { useState, useEffect } from "react";
import { resolveUrlAsync } from "../../utils/ResolveUrl";

export const useResolvedUrl = (path?: string | null): string => {
  const [resolved, setResolved] = useState<any>(() => {
    // Try sync resolution first (works if base URL already cached)
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return null; // placeholder until async resolves
  });

  useEffect(() => {
    if (!path) return;
    resolveUrlAsync(path).then(setResolved);
  }, [path]);

  return resolved;
};
