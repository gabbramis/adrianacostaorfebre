export interface DiscountCode {
  id: string;
  name: string;
  type: "percentage" | "flat_rate";
  value: number;
  discount_code: string;
  description: string;
  active: boolean;
  start_date: string;
  end_date: string;
}
