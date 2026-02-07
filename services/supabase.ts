
import { createClient } from '@supabase/supabase-js';

// MUHIMU: Hizi thamani zitachukuliwa kutoka kwenye environment variables zako.
// Ikiwa hazipo, mfumo utatumia 'Simulation Mode' ili usikwame (kuepuka Failed to Fetch).
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

export const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder-project');

// Tunaunda client, lakini tutakuwa makini kwenye kila call
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL SCHEMA KWA MUHASIBU NA USAJILI (Run in Supabase SQL Editor):
 * 
 * -- Transactions table update for approval workflow
 * alter table transactions add column status text default 'approved'; -- 'pending', 'approved', 'rejected'
 * 
 * -- Assets table
 * create table assets (
 *   id uuid default uuid_generate_v4() primary key,
 *   name text not null,
 *   category text,
 *   value numeric,
 *   condition text,
 *   purchased_date date,
 *   created_at timestamp with time zone default now()
 * );
 */
