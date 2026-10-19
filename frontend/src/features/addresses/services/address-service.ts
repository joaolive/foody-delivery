import type { Address } from "@/features/addresses/types/address";
import { apiRequest } from "@/lib/api-client";

export function fetchAddresses(signal: AbortSignal) {
  return apiRequest<Address[]>("/addresses", { signal });
}

export function createAddress(address: string) {
  return apiRequest<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}
