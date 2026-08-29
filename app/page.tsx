import Link from 'next/link';

export default async function Home() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-10 lg:py-20'>
      {/* Left: copy */}
      <div className='flex flex-col items-start gap-7'>
        <span className='ld-chip h-8 px-3 text-[13px]'>your links, your deck</span>
        <h1 className='text-[44px] sm:text-[58px] lg:text-[66px] font-bold leading-[0.98] tracking-[-0.035em] text-[var(--ld-ink)] text-pretty'>
          Welcome to LinksDeck
        </h1>
        <p className='max-w-[480px] text-[18px] sm:text-[20px] leading-[1.5] text-[var(--ld-body)]'>
          Organize and manage your favorite links all in one place. Start your
          journey with us today and experience seamless link management.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Link href='/sign-up' className='ld-btn ld-btn-primary h-[52px] px-6 text-[17px]'>
            Sign up free
          </Link>
          <Link href='/sign-in' className='ld-btn h-[52px] px-6 text-[17px]'>
            Sign in
          </Link>
        </div>
      </div>

      {/* Right: a deck of two list cards, rotated */}
      <div className='relative h-[420px] sm:h-[470px] hidden sm:flex items-center justify-center'>
        <div className='absolute w-[380px] max-w-full rotate-[-6deg] translate-x-[-26px] translate-y-[34px] bg-white border-2 border-[var(--ld-ink)] rounded-[18px] shadow-[8px_8px_0_rgba(20,24,28,0.16)] p-6'>
          <div className='flex justify-between items-center mb-4'>
            <span className='text-[22px] font-semibold'>Reading later</span>
            <span className='ld-chip' style={{ background: 'var(--ld-danger-soft)' }}>
              1 link
            </span>
          </div>
          <div className='h-3 w-[78%] rounded-md bg-[var(--ld-line)]' />
        </div>
        <div className='absolute w-[380px] max-w-full rotate-[3deg] translate-x-[22px] translate-y-[-48px] bg-white border-2 border-[var(--ld-ink)] rounded-[18px] shadow-[10px_10px_0_var(--ld-accent)] p-6'>
          <div className='flex justify-between items-center mb-[18px]'>
            <span className='text-[24px] font-semibold tracking-[-0.01em]'>
              Algo sites
            </span>
            <span className='ld-chip'>2 links</span>
          </div>
          <div className='flex flex-col gap-2.5'>
            {[
              { title: 'Structy', url: 'structy.net' },
              { title: 'Algo Monster', url: 'algo.monster/dashboard' }
            ].map((l) => (
              <div
                key={l.title}
                className='flex flex-col gap-[3px] px-3.5 py-3 bg-[var(--ld-paper)] border-2 border-[var(--ld-ink)] rounded-xl'
              >
                <span className='text-base font-semibold'>{l.title}</span>
                <span className='ld-mono text-[13px] text-[var(--ld-muted)]'>
                  {l.url}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
