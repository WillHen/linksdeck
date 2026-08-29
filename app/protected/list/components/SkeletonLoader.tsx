export function SkeletonLoader() {
  return (
    <div className='w-full max-w-[760px] mx-auto flex flex-col gap-7 animate-pulse'>
      {/* Header Skeleton */}
      <div className='flex justify-between items-center gap-6'>
        <div className='h-10 w-56 bg-[var(--ld-line)] rounded-lg'></div>
        <div className='h-10 w-24 bg-[var(--ld-line)] rounded-lg'></div>
      </div>

      {/* List meta card skeleton */}
      <div className='ld-card flex flex-col gap-[22px] p-7'>
        <div className='flex flex-col gap-2'>
          <div className='h-4 w-24 bg-[var(--ld-line)] rounded'></div>
          <div className='h-[52px] w-full bg-[var(--ld-line)] rounded-xl'></div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='h-4 w-32 bg-[var(--ld-line)] rounded'></div>
          <div className='h-[52px] w-full bg-[var(--ld-line)] rounded-xl'></div>
        </div>
      </div>

      {/* Links Section Skeleton */}
      <div className='flex flex-col gap-4'>
        <div className='h-6 w-20 bg-[var(--ld-line)] rounded'></div>
        <div className='flex flex-col gap-4'>
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className='flex flex-col gap-3.5 p-5 bg-white border-2 border-[var(--ld-ink)] rounded-2xl'
            >
              <div className='h-[46px] w-full bg-[var(--ld-line)] rounded-[10px]'></div>
              <div className='h-[46px] w-full bg-[var(--ld-line)] rounded-[10px]'></div>
            </div>
          ))}
        </div>
        <div className='h-[52px] w-full bg-[var(--ld-line)] rounded-xl'></div>
      </div>

      {/* Submit Button Skeleton */}
      <div className='h-14 w-full bg-[var(--ld-line)] rounded-xl'></div>
    </div>
  );
}
