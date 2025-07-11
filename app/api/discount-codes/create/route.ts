import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  try {
    const {
      name,
      type,
      value,
      discount_code,
      description,
      active,
      start_date,
      end_date,
    } = await request.json();
    const { data, error } = await supabase
      .from("discount_codes")
      .insert({
        name,
        type,
        value,
        discount_code,
        description,
        active,
        start_date,
        end_date,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating discount code:", error);
    return NextResponse.json(
      { error: "Failed to create discount code" },
      { status: 500 }
    );
  }
}
