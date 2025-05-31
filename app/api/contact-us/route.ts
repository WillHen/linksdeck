import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { subject, message, email } = await req.json();

    try {
        const emailResponse = await resend.emails.send({
            from: 'no-reply@linksdeck.com',
            to: 'william@linksdeck.com',
            subject,
            text: `From: ${email}\n\n${message}`,
        });

        if (emailResponse.error) {
            console.error(emailResponse.error);
            return NextResponse.json({ error: emailResponse.error.message }, {
                status: 500,
            });
        }
    } catch (error: unknown) {
        return NextResponse.json({ error }, {
            status: 500,
        });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}