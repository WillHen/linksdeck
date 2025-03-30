import { Button } from '@/components/ui/button';
import {
  signOutAction,
  changeEmailAction,
  deleteUserAction
} from '@/app/actions';
export default async function Settings() {
  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row gap-4'>
          <div>Sign out</div>
          <div>
            <form action={signOutAction}>
              <Button type='submit' variant={'outline'}>
                Sign out
              </Button>
            </form>
          </div>
        </div>
        <div className='flex flex-row gap-4'>
          <h1>Change Email</h1>
          <div>
            <form action={changeEmailAction}>
              <input
                type='email'
                id='email'
                name='email' // The name attribute is important for form submission
                placeholder='Enter your email'
              />
              <Button type='submit' variant={'outline'}>
                Change email
              </Button>
            </form>
          </div>
        </div>
        <div>
          <form action={deleteUserAction}>
            <div>Delete your account</div>
            <Button type='submit' variant={'outline'}>
              Delete Account
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
