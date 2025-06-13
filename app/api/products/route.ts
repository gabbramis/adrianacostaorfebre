import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { name, price, description, category, image, stock, is_posted } =
    await req.json();

  if (!name || !price || !category) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        price,
        category,
        description,
        image,
        stock,
        is_posted,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product in database:", error);
      return NextResponse.json(
        { message: "Error creating product" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in POST /api/products:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
