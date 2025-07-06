export interface Contact {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  asunto: string;
  mensaje: string;
  tipo_consulta: ContactType;
  estado: ContactStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactInsert {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  tipo_consulta: ContactType;
}

export type ContactStatus = "nuevo" | "leido" | "respondido" | "cerrado";
export type ContactType =
  | "general"
  | "personalizado"
  | "reparacion"
  | "presupuesto";
