// app/api/contacts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import nodemailer from "nodemailer";

// Definir variables de entorno para Nodemailer
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS; // ¡Tu Contraseña de Aplicación de Google!
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Tu email donde quieres recibir los mensajes

// Configurar el transportador de Nodemailer
// Esto es mejor hacerlo fuera de la función POST para que solo se inicialice una vez
let transporter: nodemailer.Transporter | null = null;
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && ADMIN_EMAIL) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT), // Asegurarse de que el puerto sea un número
      secure: false, // true para puerto 465 (SSL), false para puerto 587 (TLS/STARTTLS)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } catch (initError: unknown) {
    // Captura errores durante la inicialización del transporter
    console.error(
      "ERROR: No se pudo inicializar el transportador de email:",
      initError
    );
    transporter = null; // Asegurarse de que sea null si falla la inicialización
  }
} else {
  console.error(
    "ADVERTENCIA: Faltan variables de entorno para el envío de emails. El envío de correos no funcionará."
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Desestructurar 'tipoConsulta' para que coincida con el frontend
    const { nombre, email, telefono, asunto, mensaje, tipo_consulta } = body;

    // Validaciones básicas de campos obligatorios
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios (nombre, email, asunto, mensaje).",
        },
        { status: 400 }
      );
    }

    // 1. Guardar en Supabase
    const { data, error: supabaseError } = await supabaseAdmin
      .from("contacts")
      .insert([
        {
          nombre,
          email,
          telefono: telefono || null,
          asunto,
          mensaje,
          // Usar 'tipoConsulta' del frontend para 'tipo_consulta' en la DB
          tipo_consulta: tipo_consulta || "general",
          estado: "nuevo",
        },
      ])
      .select();

    if (supabaseError) {
      console.error("Error al guardar contacto en Supabase:", supabaseError);
      return NextResponse.json(
        {
          error: "Failed to save contact to database",
          details: supabaseError.message,
        },
        { status: 500 }
      );
    }

    // 2. Enviar email (si el transportador fue inicializado correctamente)
    if (transporter) {
      try {
        const mailOptions = {
          from: SMTP_USER, // Tu email de envío configurado
          to: ADMIN_EMAIL, // Tu email donde quieres recibir el mensaje
          subject: `[${
            tipo_consulta || "General"
          }] Nuevo mensaje de ${nombre} - ${asunto}`,
          html: `
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ""}
            <p><strong>Tipo de Consulta:</strong> ${
              tipo_consulta || "No especificado"
            }</p>
            <p><strong>Asunto:</strong> ${asunto}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
          `,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email enviado con éxito.");
      } catch (emailError: unknown) {
        // <-- CAMBIO: `emailError: unknown`
        // Manejo seguro del error de email
        let emailErrorMessage = "Error desconocido al enviar el email.";
        if (emailError instanceof Error) {
          emailErrorMessage = emailError.message;
        } else if (typeof emailError === "string") {
          emailErrorMessage = emailError;
        }
        console.error("Error al enviar el email:", emailErrorMessage);
        // Nota: Aquí el email falló, pero el contacto ya se guardó en Supabase.
        // Decide si este fallo debe hacer que la respuesta sea un error 500 o solo una advertencia.
      }
    } else {
      console.warn(
        "Transporter de email no inicializado. No se envió el correo."
      );
    }

    // Respuesta final si todo (o al menos Supabase) fue exitoso
    return NextResponse.json(
      {
        message: "Contact saved and email sent successfully",
        contact: data ? data[0] : null,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // <-- CAMBIO: `error: unknown`
    // Captura cualquier error general en el proceso POST
    console.error("Error general en /api/contacts POST:", error);

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

export async function GET() {
  try {
    const { data, error: supabaseError } = await supabaseAdmin // <-- CAMBIO: Renombrar 'error' a 'supabaseError' para claridad
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (supabaseError) {
      // <-- CAMBIO: Usar 'supabaseError'
      console.error("Error al obtener contactos de Supabase:", supabaseError);
      return NextResponse.json(
        { error: "Failed to fetch contacts", details: supabaseError.message }, // <-- CAMBIO: Añadir detalles
        { status: 500 }
      );
    }

    return NextResponse.json({ contacts: data });
  } catch (error: unknown) {
    // <-- CAMBIO: `error: unknown`
    // Captura cualquier error general en el proceso GET
    console.error("Error general en /api/contacts GET:", error);

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
