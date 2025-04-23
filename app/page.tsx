import Image from 'next/image';

export default async function Home() {
  return (
    <>
      <div className='flex flex-col md:flex-row items-center justify-between bg-cover bg-center bg-no-repeat mt-20 md:mt-24 px-6 md:px-12 gap-12'>
        {/* Left Section: Text */}
        <div className='flex-1 max-w-lg'>
          <h1 className='text-5xl font-extrabold text-gray-800 mb-6'>
            Welcome to LinksDeck
          </h1>
          <p className='text-lg text-gray-600 leading-relaxed'>
            Organize and manage your favorite links all in one place. Start your
            journey with us today and experience seamless link management.
          </p>
        </div>

        {/* Right Section: Image */}
        <div className='relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]'>
          <Image
            fill
            priority
            src='/assets/frontpageimage4.png'
            alt='Background'
            className='object-cover rounded-lg shadow-lg'
          />
        </div>
      </div>
    </>
  );
}
