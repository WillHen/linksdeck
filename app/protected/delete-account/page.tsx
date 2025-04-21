import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

interface DeleteAccountPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function DeleteAccountPage({
  searchParams
}: DeleteAccountPageProps) {
  const params = searchParams;

  const { token } = await params;

  if (!token) {
    // Redirect to an error page or home if the token is missing
    redirect('/error?message=Missing cancellation token');
  }

  const supabase = await createClient();

  const access_token = await supabase.auth
    .getSession()
    .then((res) => res.data.session?.access_token);

  const headersList = headers();
  const protocol = (await headersList).get('x-forwarded-proto') || 'http';
  const host = (await headersList).get('host');
  const baseUrl = `${protocol}://${host}`;

  try {
    const result = await fetch(`${baseUrl}/api/confirm-deletion`, {
      method: 'POST',
      body: JSON.stringify({
        token
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    });

    if (result?.status > 200) {
      redirect('/protected/delete-confirmed?success=false');
    }

    redirect('/protected/delete-confirmed?success=true');
  } catch (err) {
    console.error('Error calling delete-user API:', err);
    redirect(
      '/protected/delete-confirmed?success=false&error=An%20unexpected%20error%20occurred'
    );
  }
}
