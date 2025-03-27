export function SkeletonLoader() {
  return (
    <div className='animate-pulse w-[30rem] mx-auto'>
      {/* Skeleton for Link 1 */}
      <div className='mb-4 p-2 border border-gray-200 rounded bg-gray-100'>
        {/* Title Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
        <div className='h-10 bg-gray-300 rounded w-full mb-4'></div>

        {/* Description Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
        <div className='h-10 bg-gray-300 rounded w-full mb-4'></div>

        {/* URL Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
        <div className='h-10 bg-gray-300 rounded w-full mb-4'></div>

        {/* Delete Button Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-8'></div>
      </div>

      {/* Skeleton for Link 3 */}
      <div className='mb-4 p-2 border border-gray-200 rounded bg-gray-100'>
        {/* Title Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
        <div className='h-10 bg-gray-300 rounded w-full mb-4'></div>

        {/* Description Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
        <div className='h-10 bg-gray-300 rounded w-full mb-4'></div>

        {/* URL Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
        <div className='h-10 bg-gray-300 rounded w-full mb-4'></div>

        {/* Delete Button Skeleton */}
        <div className='h-4 bg-gray-300 rounded w-8'></div>
      </div>

      {/* Add Link Button Skeleton */}
      <div className='h-10 bg-gray-300 rounded w-full'></div>
    </div>
  );
}
