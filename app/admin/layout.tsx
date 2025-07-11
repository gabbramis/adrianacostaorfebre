import AdminLayout from "@/components/admin/AdminLayout";
import { createSupabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const ADMIN_EMAIL_USERS = [
  "gabrielaramis01@gmail.com",
  "adrianacostaorfebre@gmail.com",
];

export default async function AdminLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  // CHECKEAR QUE EL USER EXISTA
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAIL_USERS.includes(user.email!)) {
    if (user) supabase.auth.signOut();

    redirect("/auth");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
