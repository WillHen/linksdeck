export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[600px]'>
      {/* Ink panel — hidden on small screens */}
      <div className='hidden lg:flex flex-col justify-between gap-16 h-full min-h-[600px] p-12 rounded-[18px] bg-[var(--ld-ink)]'>
        <div className='flex items-center gap-2.5'>
          <span className='w-[22px] h-[22px] rounded-[7px] bg-[var(--ld-accent)]' />
          <span className='text-[21px] font-bold tracking-[-0.02em] text-[var(--ld-paper)]'>
            LinksDeck
          </span>
        </div>
        <div className='flex flex-col gap-5'>
          <h2 className='max-w-[420px] text-[44px] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--ld-paper)]'>
            Every link you meant to come back to.
          </h2>
          <p className='max-w-[400px] text-[17px] leading-[1.5] text-[#98a3ae]'>
            Sorted into lists. Shareable with one URL.
          </p>
        </div>
        <div className='flex gap-2'>
          <span className='w-11 h-2.5 rounded-full bg-[var(--ld-accent)]' />
          <span className='w-3.5 h-2.5 rounded-full bg-[#39424c]' />
          <span className='w-3.5 h-2.5 rounded-full bg-[#39424c]' />
        </div>
      </div>

      <div className='flex justify-center'>{children}</div>
    </div>
  );
}
