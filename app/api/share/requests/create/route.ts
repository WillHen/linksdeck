import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServiceClient } from '@/utils/supabase/server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the Service Role Key
);

export async function POST(req: Request) {
    try {
        const supabase = await createServiceClient();

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
            .from('user_profiles')
            .select('id')
            .eq('email', to_email)
            .single();

        if (recipientError || !recipient) {
            return NextResponse.json(
                { error: 'Recipient not found' },
                { status: 404 }
            );
        }

        const to_user_id = recipient.id;

        const newShareId = crypto.randomUUID();

        // Insert the share request into the database
        const { data, error } = await supabase
            .from('share_requests')
            .insert([
                {
                    id: newShareId, // Generate a unique ID for the share request
                    from_user_id,
                    to_user_id,
                    list_id,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                },
            ]);

        if (error) {
            console.error('Error creating share request:', error);
            return NextResponse.json(
                { error: 'Failed to create share request' },
                { status: 500 }
            );
        }


        await resend.emails.send({
            from: 'LinksDeck <info@linksdeck.com>',
            to: [to_email as string],
            subject: 'You have a new share request on LinksDeck',
            html: `<p>You have received a new share request on LinksDeck!</p>
                   <p>To accept the share request, please click the link below:</p>
                   <p><a href="${process.env.NEXT_PUBLIC_SUPABASE_URL}/sign-in?redirect_to=/protected/shares/accept/${newShareId}">Accept Share Request</a></p>
                   <p>If you did not expect this email, you can safely ignore it.</p>`
        });

        return NextResponse.json({ message: 'Share request created successfully', data });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Failed to create share request', details: error.message },
                { status: 500 }
            );
        }
    }
}