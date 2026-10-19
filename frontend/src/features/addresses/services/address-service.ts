import type { SavedAddress } from "@/features/addresses/types/address";
import { apiRequest } from "@/lib/api-client";

export function fetchSavedAddresses(signal: AbortSignal) {
  return apiRequest<SavedAddress[]>("/addresses", { signal });
}

export function createSavedAddress(address: string) {
  return apiRequest<SavedAddress>("/addresses", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}
