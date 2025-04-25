import { createServiceClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

import { emailRegex } from '@/app/constants';

export async function POST(req: Request) {
    const supabase = await createServiceClient();
    const { email } = await req.json();

    // Validate the email
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    try {
        const { error } = await supabase.auth.updateUser({ email });

        if (error) {
            console.error('Error updating email:', error.message);
            return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Email updated successfully' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json(err, { status: 500 });
    }
}