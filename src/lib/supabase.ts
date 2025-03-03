import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// These values should be replaced with your actual Supabase URL and anon key
// You'll need to click the "Connect to Supabase" button to set these up
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);