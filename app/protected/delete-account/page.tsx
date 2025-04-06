import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import DeleteAccountClient from '../delete-confirmed/page';

interface DeleteAccountPageProps {
  searchParams: { token?: string };
}

export default async function DeleteAccountPage({
  searchParams
}: DeleteAccountPageProps) {
  const token = searchParams?.token;

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
    await fetch(`${baseUrl}/api/confirm_deletion`, {
      method: 'POST',
      body: JSON.stringify({
        token
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    });

    return <DeleteAccountClient success />;
  } catch (err) {
    console.error('Error calling delete-user API:', err);
    return <DeleteAccountClient error='An unexpected error occurred' />;
  }

  // Query the cancellation_tokens table to validate the token

  // Check if the token is expired

  // If the token is valid, render the delete account confirmation page
  return (
    <div>
      <h1>Deleting Account....</h1>
    </div>
  );
}
