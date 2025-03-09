export function SkeletonLoader() {
  return (
    <div className='max-w-[960px] flex flex-1 justify-start items-start flex-col'>
      <div className='flex flex-wrap self-stretch justify-between items-start flex-row gap-3 p-4'>
        <div className='min-w-[288px] flex justify-start items-start flex-col gap-3'>
          <div className='flex flex-row items-center w-[352px]'>
            <div className='h-8 bg-gray-300 rounded w-3/4'></div>
            <div className='h-8 bg-gray-300 rounded w-8 ml-2'></div>
          </div>
        </div>
      </div>
      <div className='max-w-[480px] flex flex-wrap justify-start items-end flex-row gap-4 py-3 px-4'>
        <div className='min-w-[160px] flex flex-1 justify-start items-start flex-col'>
          <div className='flex self-stretch justify-start items-start flex-col pb-2'>
            <div className='h-6 bg-gray-300 rounded w-1/2'></div>
          </div>
          <div className='h-10 bg-gray-300 rounded w-full'></div>
        </div>
      </div>
      <div className='max-w-[480px] flex flex-wrap justify-start items-end flex-row gap-4 py-3 px-4'>
        <div className='min-w-[160px] flex flex-1 justify-start items-start flex-col'>
          <div className='flex self-stretch justify-start items-start flex-col pb-2'>
            <div className='h-6 bg-gray-300 rounded w-1/2'></div>
          </div>
          <div className='h-36 bg-gray-300 rounded w-full'></div>
        </div>
      </div>
      <div className='flex self-stretch justify-start items-start flex-col pt-4 pb-2 px-4'>
        <div className='h-6 bg-gray-300 rounded w-1/3'></div>
      </div>
      <div className='flex self-stretch justify-start items-start flex-row py-3 px-4'>
        <div className='flex justify-between items-center p-4 bg-gray-100 rounded'>
          <div className='flex-1'>
            <div className='h-4 bg-gray-300 rounded w-full'></div>
            <div className='h-4 bg-gray-300 rounded w-3/4'></div>
          </div>
          <div className='h-8 bg-gray-300 rounded w-12'></div>
        </div>
      </div>
      <div className='flex self-stretch justify-start items-start flex-row py-3 px-4'>
        <div className='h-10 bg-gray-300 rounded w-1/4'></div>
      </div>
      <div className='flex self-stretch justify-start items-start flex-row py-3 px-4'>
        <div className='h-10 bg-gray-300 rounded w-1/4'></div>
      </div>
    </div>
  );
}
