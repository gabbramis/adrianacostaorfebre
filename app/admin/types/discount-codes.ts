export interface DiscountCode {
  id: string;
  name: string;
  type: string;
  value: number;
  discount_code: string;
  description: string;
  active: boolean;
  start_date: string;
  end_date: string;
}
