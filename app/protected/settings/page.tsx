'use client';

import ChangeEmailClient from './components/ChangeEmailClient';
import DeleteAccountClient from './components/DeleteAccountClient';
import { signOutAction } from '@/app/actions';

export default function Settings() {
  return (
    <div className='w-full max-w-[760px] mx-auto flex flex-col gap-7'>
      <h1 className='text-[36px] sm:text-[42px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ld-ink)]'>
        Settings
      </h1>

      <div className='ld-card overflow-hidden'>
        {/* Email row */}
        <ChangeEmailClient />

        {/* Session row */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-[26px] py-6'>
          <div className='flex flex-col gap-1'>
            <span className='text-[18px] font-semibold leading-[1.2]'>
              Session
            </span>
            <span className='text-sm text-[var(--ld-muted)]'>
              Sign out of this browser.
            </span>
          </div>
          <form action={signOutAction}>
            <button type='submit' className='ld-btn'>
              Sign Out
            </button>
          </form>
        </div>
      </div>

      <DeleteAccountClient />
    </div>
  );
}
