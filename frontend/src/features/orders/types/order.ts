export type OrderStatus =
  "RECEBIDO" | "EM_PREPARO" | "SAIU_PARA_ENTREGA" | "ENTREGUE" | "CANCELADO";

export type OrderItem = {
  productId: string;
  unitPrice: number;
  quantity: number;
};

export type OrderSummary = {
  id: string;
  clientId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string | null;
};

export type Order = OrderSummary & {
  clientName: string;
  addressId: string;
  address: string;
  items: OrderItem[];
};

export type CreateOrderData = {
  addressId: string;
  items: { productId: string; quantity: number }[];
};
