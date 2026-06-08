// app/settings/saved-cards/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { SavedCardsClient } from "@/src/components/settings/clients/SavedCardsClient";
import { SavedCard } from "@/src/config/settings";

    
async function getSavedCards(): Promise<SavedCard[]> {
  // Return [] to show empty state, or mock data to show list
  return [];
}

async function deleteCard(id: number) {
  "use server";
}

export default async function SavedCardsPage() {
  const cards = await getSavedCards();
  return <SavedCardsClient initialCards={cards} onDelete={deleteCard} />;
}
