import { SavedAddressesClient } from "@/src/components/settings/addresses/client/SavedAdressesClient";

// NOT async — Client Components cannot be async
export default function SavedAddressesPage() {
  return <SavedAddressesClient />;
}
