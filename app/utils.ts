import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/app/types/Supabase';

export function getListsFromSupabaseAnon(supabaseClient: SupabaseClient<Database>) {
    return supabaseClient.from('lists').select('*');
}

export function getLinksFromSupabaseAnon(supabaseClient: SupabaseClient<Database>) {
    return supabaseClient.from('links').select('*');
}

export function getListsFromSupabase(supabaseClient: SupabaseClient<Database>, userId: string) {
    return supabaseClient.from('lists').select('*').eq('user_id', userId);
}

export function getLinksFromSupabase(supabaseClient: SupabaseClient<Database>, userId: string) {
    return supabaseClient.from('links').select('*').eq('user_id', userId);
}

export type Link = Database['public']['Tables']['links']['Row'];
export type List = Database['public']['Tables']['lists']['Row'];
