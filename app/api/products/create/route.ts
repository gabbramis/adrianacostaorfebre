import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/utils/supabase/server";

export const POST = async (req: NextRequest) => {
  const { name, price, description, category, image, stock, isPosted } =
    await req.json();

  if (!name || !price || !category) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: name,
      price: price,
      category: category,
      description: description,
      image: image,
      stock: stock,
      is_posted: isPosted,
    })
    .select()
    .single();

  if (error) {
    console.log(error);
    return new NextResponse("Error creating product", { status: 500 });
  }

  return new NextResponse(JSON.stringify(data), { status: 201 });
};
