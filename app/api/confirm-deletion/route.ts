import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

import type { Database } from '@/app/types/Supabase';

import { deleteUserAndData } from '@/app/api/utils/deleteUsers';


export async function POST(req: Request) {

    const supabase = await createClient();

    const {
        data: { user }, error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { token } = body;


    const { data } = await supabase
        .from('cancellation_tokens')
        .select('token, expiration, is_used, user_id')
        .eq('user_id', user?.id)
        .eq('token', token)
        .single();

    if (!data) {
        return NextResponse.json({ error: 'Token not found' }, { status: 401 });
    }


    const cancellationTokenData = data as Database['public']['Tables']['cancellation_tokens']['Row']
    const expiration = new Date();


    if (new Date(cancellationTokenData.expiration) < expiration) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    await deleteUserAndData(user?.id as string);

    return NextResponse.json({}, { status: 200 });

}