import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde .env

const supabaseUrl = "https://vjgxusixoqjviyjsedau.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZ3h1c2l4b3Fqdml5anNlZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDU0NTQsImV4cCI6MjA2MjQ4MTQ1NH0.fXxRPTF2tngrF2hmxTmCg88GxMViG53Oykn9Spg9CF4";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Error: SUPABASE_URL o SUPABASE_ANON_KEY no están definidos en .env"
  );
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
