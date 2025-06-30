//admin/orders
import { createSupabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DetallesDeOrdenes from "@/components/admin/DetallesDeOrdenes";

export default async function OrderPage() {
  const supabase = await createSupabaseServer();

  // CHECKEAR QUE EL USER EXISTA
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // TRAER ORDERS
  const { data: orders } = await supabase.from("orders").select("*");

  return <DetallesDeOrdenes orders={orders || []} />;
}
