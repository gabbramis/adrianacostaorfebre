// app/api/contacts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

// INTERFACE: Define una interfaz para el contexto que satisfaga la expectativa de Next.js
// del error de tipo. Esto le dice a TypeScript que 'params' podría ser una Promesa.
interface RouteContextWithPromiseParams {
  params: Promise<{ id: string }>; // Explicita que 'params' es una Promesa de un objeto {id: string}
}

export async function PATCH(
  request: NextRequest,
  context: RouteContextWithPromiseParams // Usa la interfaz definida
) {
  try {
    // Await 'context.params' para resolver la Promesa (según lo que el verificador de tipos espera)
    const resolvedParams = await context.params;
    const { id } = resolvedParams; // Accede al ID desde el objeto resuelto

    // --- PASOS DE DEPURACIÓN (puedes dejarlos o quitarlos después) ---
    console.log("PATCH request received for ID:", id);
    console.log("Full resolved params object:", resolvedParams);
    // --- FIN PASOS DE DEPURACIÓN ---

    // Validación básica: asegúrate de que el ID existe
    if (!id) {
      return NextResponse.json(
        { error: "Missing contact ID in URL" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { estado } = body;

    // Validación: asegúrate de que 'estado' está en el cuerpo de la petición
    if (!estado) {
      return NextResponse.json(
        { error: "Missing 'estado' field in request body" },
        { status: 400 }
      );
    }

    // Realiza la actualización en Supabase
    const { data, error: supabaseError } = await supabaseAdmin
      .from("contacts")
      .update({ estado, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (supabaseError) {
      console.error("Error updating contact status:", supabaseError);
      return NextResponse.json(
        {
          error: "Failed to update contact status",
          details: supabaseError.message,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Contact not found or no changes applied" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Contact status updated successfully", contact: data[0] },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Manejo de errores tipo-seguro
    console.error("Error in PATCH /api/contacts/[id] route:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContextWithPromiseParams // Usa la misma interfaz aquí
) {
  try {
    // Await 'context.params' de nuevo para resolver la Promesa
    const resolvedParams = await context.params;
    const { id } = resolvedParams; // Accede al ID desde el objeto resuelto

    if (!id) {
      return NextResponse.json(
        { error: "Missing contact ID" },
        { status: 400 }
      );
    }

    const { data, error: supabaseError } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (supabaseError) {
      console.error("Error fetching single contact:", supabaseError);
      return NextResponse.json(
        { error: "Failed to fetch contact", details: supabaseError.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ contact: data }, { status: 200 });
  } catch (error: unknown) {
    // Manejo de errores tipo-seguro
    console.error("Error in GET /api/contacts/[id] route:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
