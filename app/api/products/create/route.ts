// app/api/products/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { name, price, description, category, image, stock, is_posted } =
      await req.json();

    // More explicit validation for better error messages
    if (!name) {
      return NextResponse.json(
        { message: "Product name is required." },
        { status: 400 }
      );
    }
    if (price === undefined || price === null) {
      // Check for undefined or null price
      return NextResponse.json(
        { message: "Product price is required." },
        { status: 400 }
      );
    }
    if (isNaN(Number(price)) || Number(price) < 0) {
      // Validate price is a non-negative number
      return NextResponse.json(
        { message: "Product price must be a valid non-negative number." },
        { status: 400 }
      );
    }
    if (!category) {
      return NextResponse.json(
        { message: "Product category is required." },
        { status: 400 }
      );
    }
    if (!Array.isArray(image) || image.length === 0) {
      return NextResponse.json(
        { message: "At least one product image is required." },
        { status: 400 }
      );
    }
    if (
      stock === undefined ||
      stock === null ||
      isNaN(Number(stock)) ||
      Number(stock) < 0
    ) {
      // Validate stock
      return NextResponse.json(
        { message: "Product stock must be a valid non-negative number." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        price,
        category,
        description: description || null, // Ensure description can be null if not provided
        image,
        stock,
        is_posted,
        // Add default values for fields not passed from frontend if necessary,
        // e.g., popularity: 0, materials: []
      })
      .select() // Select the inserted row
      .single(); // Expecting a single row back

    if (error) {
      console.error("Supabase error creating product:", error);
      // Return a more descriptive error from Supabase if available
      return NextResponse.json(
        { message: error.message || "Error creating product in database." },
        { status: 500 }
      );
    }

    // Return the newly created product data with a 201 Created status
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in POST /api/products/create:", err);
    // Return a generic internal server error for unhandled exceptions
    return NextResponse.json(
      { message: "Internal server error. Could not process request." },
      { status: 500 }
    );
  }
}
