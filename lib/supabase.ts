import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin;
}

export type Photo = {
  id: string;
  title: string;
  category: string;
  storage_path: string;
  public_url: string;
  created_at: string;
  frame_num: string;
  medium: "35mm" | "digital";
  camera: string | null;
  film_roll: string | null;
  film_iso: string | null;
  film_type: "color" | "bw" | null;
};
