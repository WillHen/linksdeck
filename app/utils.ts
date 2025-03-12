import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/app/types/Supabase';

import { GenericSchema } from '@supabase/postgrest-js/src/types';

export function getListsFromSupabase(supabaseClient: SupabaseClient<Database, 'public' extends keyof Database ? 'public' : string & keyof Database,
    Database['public'] extends GenericSchema ? Database['public'] : unknown>) {
    return supabaseClient.from('lists').select('*');
}

export function getLinksFromSupabase(supabaseClient: SupabaseClient<Database, 'public' extends keyof Database ? 'public' : string & keyof Database,
    Database['public'] extends GenericSchema ? Database['public'] : unknown>) {
    return supabaseClient.from('links').select('*');
}