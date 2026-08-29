import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { createClient } from '@/utils/supabase/server';

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <div className='flex gap-4 items-center'>
        <Badge variant={'default'} className='font-normal pointer-events-none'>
          Please update .env.local file with anon key and url
        </Badge>
        <div className='flex gap-2.5'>
          <span className='ld-btn h-10 px-4 opacity-75 pointer-events-none'>
            Sign in
          </span>
          <span className='ld-btn ld-btn-primary h-10 px-4 opacity-75 pointer-events-none'>
            Sign up
          </span>
        </div>
      </div>
    );
  }

  return user ? (
    <div className='flex gap-2.5 items-center'>
      <Link
        href='/protected'
        data-testid='home-header-link'
        className='ld-btn h-10 px-4'
      >
        Home
      </Link>
      <Link href='/protected/settings' className='ld-btn h-10 px-4'>
        Settings
      </Link>
    </div>
  ) : (
    <div className='flex gap-2.5 items-center'>
      <Link href='/sign-in' data-testid='sign-in-link' className='ld-btn h-10 px-4'>
        Sign in
      </Link>
      <Link href='/sign-up' className='ld-btn ld-btn-primary h-10 px-4'>
        Sign up
      </Link>
    </div>
  );
}
