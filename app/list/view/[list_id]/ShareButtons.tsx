'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'next-share';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  };

  return (
    <div className='flex space-x-2 mt-4'>
      <FacebookShareButton url={url} quote={title} hashtag={'#linkhub'}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={'www.bbc.com'} title={title}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <button onClick={handleCopyLink} className='bg-gray-200 p-2 rounded'>
        {copied ? 'Link Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
