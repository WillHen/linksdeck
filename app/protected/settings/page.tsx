'use client';

import ChangeEmailClient from './components/ChangeEmailClient';
import DeleteAccountClient from './components/DeleteAccountClient';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/app/actions';

export default function Settings() {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Settings</h1>
      <div className='flex flex-col gap-6'>
        {/* Sign Out Section */}
        <div className='p-6 border rounded-lg shadow-md bg-white'>
          <h2 className='text-xl font-semibold mb-4'>Sign Out</h2>
          <form action={signOutAction}>
            <Button type='submit' variant='outline'>
              Sign Out
            </Button>
          </form>
        </div>

        {/* Change Email Section */}
        <ChangeEmailClient />

        {/* Delete Account Section */}
        <DeleteAccountClient />
      </div>
    </div>
  );
}
