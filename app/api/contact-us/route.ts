import { Resend } from 'resend';

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
            return new Response(JSON.stringify({ error: emailResponse.error.message }), {
                status: 500,
            });
        }
    } catch (e) {
        console.error('Error sending email:', e);
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
            status: 500,
        });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}