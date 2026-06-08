// ─────────────────────────────────────────────────────────────────────────────
import { SelectLocationClient } from "@/src/components/settings/addresses/client/SelectLocationClient";
import { redirect } from "next/navigation";

async function confirmLocation(lat: number, lng: number, address: string) {
  "use server";
  redirect("/settings/saved-addresses");
}

export default function SelectLocationPage() {
  return (
    <SelectLocationClient
      initialLat={30.0635}
      initialLng={31.2432}
      initialAddress="2, Algeria Street, Shubra al Khayma, Al Qa..."
      onConfirm={confirmLocation}
    />
  );
}