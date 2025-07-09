import { createSupabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/admin");
  }

  return <>{children}</>;
}
