// app/settings/saved-cards/add/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { AddCardClient } from "@/src/components/settings/clients/AddCardClient";
import { AddCardFormData } from "@/src/config/settings";
import { redirect } from "next/navigation";

async function addCard(data: AddCardFormData) {
  "use server";
  redirect("/settings/saved-cards");
}

export default function AddCardPage() {
  return <AddCardClient onAdd={addCard} />;
}
