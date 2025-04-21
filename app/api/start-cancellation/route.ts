import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);



const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};
export async function POST() {

    const supabase = await createClient();

    // Pass the token to the Supabase client
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user?.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Generate a token and set an expiration time (24 hours from now)
    const token = generateToken();
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);  // Set expiration to 24 hours from now

    // Store the token and expiration in Supabase

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await supabase
            .from('cancellation_tokens')
            .insert([
                {
                    user_id: user.id,
                    token: token,
                    expiration: expiration.toISOString(),
                },
            ]);

        await resend.emails.send({
            from: 'LinksDeck <info@linksdeck.com>',
            to: [user.email as string],
            subject: 'Account Deletion Confirmation',
            html: `<p>To confirm your account deletion, please click the link below:</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/protected/delete-account?token=${token}">Confirm Account Deletion</a></p>`
        });


        // Respond with success
        return NextResponse.json({ message: 'User deletion initiated successfully' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting user:', error?.message);
        }
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}