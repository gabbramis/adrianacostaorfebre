import { createSupabaseServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Discount code ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createSupabaseServer();
    const { error } = await supabase
      .from("discount_codes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting discount code from database:", error);
      return NextResponse.json(
        { message: "Error deleting discount code" },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Unexpected error in DELETE /api/discount-codes/[id]:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Discount code ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedFields = await req.json();

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("discount_codes")
      .update(updatedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating discount code in database:", error);
      return NextResponse.json(
        { message: "Error updating discount code" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in PATCH /api/discount-codes/[id]:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
