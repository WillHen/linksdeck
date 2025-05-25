import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServiceClient } from '@/utils/supabase/server';

// import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the Service Role Key
);

export async function POST(req: Request) {
    try {
        const supabase = await createServiceClient();
        // const authHeader = req.headers.get('Authorization');
        // const usertoken = authHeader?.split(' ')[1];
        // console.log('User token:', usertoken);
        // const supabase = createClient(
        //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
        //     process.env.SUPABASE_SERVICE_ROLE_KEY!,
        //     {
        //         global: {
        //             headers: {
        //                 Authorization: `Bearer ${usertoken}`,
        //             },
        //         },
        //     }
        // );
        const body = await req.json();

        const { to_email, list_id } = body;

        // Validate required fields
        if (!to_email || !list_id) {
            return NextResponse.json(
                { error: 'Missing required fields: to_email or list_id' },
                { status: 400 }
            );
        }

        // Get the authenticated user's ID (replace with your auth logic)
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        const { user: { id: from_user_id } } = user;

        // Look up the user ID of the recipient by email
        const { data: recipient, error: recipientError } = await supabaseAdmin
            .from('user_profiles') // Replace 'users' with the name of your users table
            .select('id')
            .eq('email', to_email)
            .single();

        console.log('Recipient:', recipient);
        console.log('Recipient error:', recipientError);

        if (recipientError || !recipient) {
            return NextResponse.json(
                { error: 'Recipient not found' },
                { status: 404 }
            );
        }

        const to_user_id = recipient.id;

        // Insert the share request into the database
        const { data, error } = await supabase
            .from('share_requests')
            .insert([
                {
                    from_user_id,
                    to_user_id,
                    list_id,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                },
            ]);

        if (error) {
            return NextResponse.json(
                { error: 'Failed to create share request', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: 'Share request created successfully', data });
    } catch (err) {
        console.error('Error creating share request:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}