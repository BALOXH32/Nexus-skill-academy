// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================
// Replace the values below with your actual Supabase credentials
// You can find these in your Supabase Dashboard → Settings → API

// 🔹 STEP 1: Replace this with your Supabase Project URL
const SUPABASE_URL = "https://xmbdxpekhxjqabevkcbd.supabase.co";

// 🔹 STEP 2: Replace this with your Supabase Anon/Public Key
const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtYmR4cGVraHhqcWFiZXZrY2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3OTA5OTEsImV4cCI6MjA1NTM2Njk5MX0.YOUR_ACTUAL_ANON_KEY_HERE";

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================

// Get createClient from the global supabase object (loaded via CDN)
const { createClient } = window.supabase;

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

// Export URL and key if needed elsewhere
export { SUPABASE_URL, SUPABASE_PUBLIC_KEY };
