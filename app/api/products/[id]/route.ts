import { createSupabaseServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

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
  // Correctly destructure params directly, it's not a Promise
  { params }: { params: { id: string } } // <-- Changed here
) {
  const { id } = params; // <-- Changed here (no 'await' needed)

  if (!id) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedFields = await req.json();

    if (updatedFields.image !== undefined) {
      // Check if 'image' field is being updated
      if (!Array.isArray(updatedFields.image)) {
        return NextResponse.json(
          { message: "Image field must be an array of URLs." },
          { status: 400 }
        );
      }

      if (updatedFields.image.some((url: any) => typeof url !== "string")) {
        return NextResponse.json(
          {
            message: "All items in the image array must be valid URL strings.",
          },
          { status: 400 }
        );
      }

      if (updatedFields.image.length === 0) {
        return NextResponse.json(
          { message: "At least one image URL is required for the product." },
          { status: 400 }
        );
      }
    }

    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("products")
      .update(updatedFields) // This will correctly send the 'image' array to Supabase
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product in database:", error);
      return NextResponse.json(
        { message: error.message || "Error updating product." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
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
