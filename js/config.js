/* ============ config.js ============ */
const CONFIG = {
  APP_VER: 'v9',
  // Supabase — a chave anon é pública por design (vai no cliente).
  // A proteção real dos dados é o RLS configurado no banco (ver supabase-setup.sql).
  SUPABASE_URL: 'https://dwoffltlesujvkfzuimn.supabase.co',
  SUPABASE_ANON: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b2ZmbHRsZXN1anZrZnp1aW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODI1NzcsImV4cCI6MjA5NTU1ODU3N30.lFDs2xsxGH5eSm0GZWK2Wnsd46659FQDo3oM1MGPmL8',
  TABLE: 'calculos',
  // IA: URL da Edge Function 'analisar'. Deixe vazio até fazer o deploy.
  // Ex.: 'https://afdpeaefqjwbzbqckesv.supabase.co/functions/v1/analisar'
  AI_URL: 'https://dwoffltlesujvkfzuimn.supabase.co/functions/v1/analisar',
};
