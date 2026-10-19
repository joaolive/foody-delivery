export type OrderStatus =
  "RECEIVED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELED";

export type OrderItem = {
  productId: string;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  clientId: string;
  address: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItem[];
};

export type CreateOrderData = {
  addressId: string;
  items: { productId: string; quantity: number }[];
};
