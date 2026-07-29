// lib/supabase.js
// Taruh file ini di folder: lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://izszfloyozvxcvgyaulr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6c3pmbG95b3p2eGN2Z3lhdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODEwODYsImV4cCI6MjA5Nzc1NzA4Nn0.A_4jmmybGVSTAskV_AE8UZpnOjnJAtlaDJqCCE05FWk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
