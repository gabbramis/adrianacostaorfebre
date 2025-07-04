export interface Order {
  id: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  description?: string;
  payment_method_id?: string;
  payer_email?: string;
  mp_payment_id?: string;
  approved_at?: string;
  payer_id?: string;
  delivery_method: "envio" | "retiro";
  promo_applied?: boolean;
  shipping_cost?: number;
  notes?: string;
  client_id: string;
  payment_method: "mercadopago" | "transfer";
  payment_intent_id?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Client {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
}

export interface OrderWithDetails extends Order {
  client: Client;
  order_items: OrderItem[];
}

export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "enviado"
  | "entregado"
  | "cancelado";
