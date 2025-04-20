import React from 'react';
import Image from 'next/image';

export function SplashScreen() {
  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <Image
        src='/assets/splashpage.png'
        alt='Splash Page Background'
        fill
        priority
        sizes='100vw'
        className='object-cover object-center -z-10'
      />
      <div className='absolute inset-0 flex flex-col justify-start items-center pt-8'>
        <h1 className='text-white text-3xl font-bold'>Coming Soon</h1>
      </div>
    </div>
  );
}
