import { signInAction } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type SearchParams = Message & { redirect_to?: string };

export default async function Login(props: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  // Get the current user session
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const searchParams = await props.searchParams;
  const redirectTo = searchParams?.redirect_to || '/protected';

  if (user) {
    redirect(redirectTo);
  }
  return (
    <form className='flex-1 flex flex-col min-w-64'>
      <h1 className='text-2xl font-medium'>Sign in</h1>
      <p className='text-sm text-foreground'>
        Don&apos;t have an account?{' '}
        <Link className='text-foreground font-medium underline' href='/sign-up'>
          Sign up
        </Link>
      </p>
      <div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
        <Label htmlFor='email'>Email</Label>
        <Input
          name='email'
          placeholder='you@example.com'
          className='bg-white'
          required
        />
        <div className='flex justify-between items-center'>
          <Label htmlFor='password'>Password</Label>
          <Link
            className='text-xs text-foreground underline'
            href='/forgot-password'
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type='password'
          name='password'
          placeholder='Your password'
          required
          className='bg-white'
        />
        <input type='hidden' name='redirect_to' value={redirectTo} />
        <SubmitButton
          data-testid='submit-button-sign-in'
          pendingText='Signing In...'
          formAction={signInAction}
        >
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
