import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const { share_id } = await req.json(); // Extract share_id from the request body

        if (!share_id) {
            return NextResponse.json(
                { error: 'Share ID is required.' },
                { status: 400 }
            );
        }

        // Initialize Supabase client with the service role key
        const supabase = await createClient();

        // Call the RPC function to accept the share request
        const { data, error } = await supabase.rpc('accept_share_request', {
            share_id,
        });

        if (error) {
            console.error('Error accepting share request:', error);
            return NextResponse.json(
                { error: 'Failed to accept the share request.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Share request accepted successfully.', data },
            { status: 200 }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json(
            { error: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}