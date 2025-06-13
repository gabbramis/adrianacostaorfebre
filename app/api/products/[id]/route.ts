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
        name: name,
        price: price,
        category: category,
        description: description,
        image: image,
        stock: stock,
        is_posted: is_posted,
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
    console.error("Unexpected error in POST /api/products/create:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product from database:", error);
      return NextResponse.json(
        { message: "Error deleting product" },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Unexpected error in DELETE /api/products/[id]:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedFields = await req.json();

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("products")
      .update(updatedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product in database:", error);
      return NextResponse.json(
        { message: "Error updating product" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in PATCH /api/products/[id]:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
