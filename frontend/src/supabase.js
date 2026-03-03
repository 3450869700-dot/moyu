import { createClient } from "@supabase/supabase-js";

// 确保使用正确的 API 密钥
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://oiewadumjixvrqbghczl.supabase.co";
// 使用用户提供的 Anon Key
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZXdhZHVtaml4dnJxYmdoY3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzY2OTUsImV4cCI6MjA4ODAxMjY5NX0.C-BGaqSDYCalCv7R3KCvFmuLPJS8R_D7s90wblap8Wc";

console.log("Supabase URL:", supabaseUrl);
console.log(
  "Supabase Anon Key (first 20 chars):",
  supabaseAnonKey.substring(0, 20) + "...",
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 添加错误处理
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session);
});
