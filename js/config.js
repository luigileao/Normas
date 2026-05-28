/* ============ config.js ============ */
const CONFIG = {
  APP_VER: 'v6',
  // Supabase — a chave anon é pública por design (vai no cliente).
  // A proteção real dos dados é o RLS configurado no banco (ver supabase-setup.sql).
  SUPABASE_URL: 'https://afdpeaefqjwbzbqckesv.supabase.co',
  SUPABASE_ANON: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZHBlYWVmcWp3YnpicWNrZXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDQ0NTgsImV4cCI6MjA5MDQ4MDQ1OH0.lUUwFpJ0juTVuqB46xiaplB8KVIgeVAWBLNnSbwXF-c',
  TABLE: 'calculos',
};
