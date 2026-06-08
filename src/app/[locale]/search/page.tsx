import Loader from "@/src/components/common/Loader";
import { SearchClient } from "@/src/components/search/client/SearchClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchClient />
    </Suspense>
  );
}
