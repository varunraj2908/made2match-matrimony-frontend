'use client'
import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useMediaQuery } from '@react-hook/media-query';
import Image from 'next/image';

interface Testimonial {
  image?: string;
  text: string;
  name: string;
  jobtitle: string;
  rating: number;
}

interface ComponentProps {
  testimonials: Testimonial[];
  width?: number;
  height?: number;
}

export const Component = ({ testimonials, width = 300, height = 450 }: ComponentProps) => {
  const book = useRef<any>(null);

  const isSmallScreen = useMediaQuery('(min-width: 640px)');
  const smallerDevice = isSmallScreen ? false : true;

  const handleFlip = (pageNum: number) => {
    book.current?.pageFlip()?.flip(pageNum);
    book.current?.pageFlip()?.flipNext(false);
  };

  // Close the book — flip all the way back to the cover.
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    book.current?.pageFlip()?.flip(0);
  };

  // Accept / Decline a profile — advance to the next one.
  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    book.current?.pageFlip()?.flipNext();
  };

  return (
    <div className="w-full text-black flex justify-center items-center py-10">
      <HTMLFlipBook
        ref={book}
        width={width}
        height={height}
        showCover={true}
        usePortrait={smallerDevice}
        className={'text-sm'}
        style={{}}
        startPage={0}
        size={'fixed'}
        minWidth={0}
        maxWidth={0}
        minHeight={0}
        maxHeight={0}
        drawShadow={true}
        flippingTime={1000}
        startZIndex={0}
        autoSize={false}
        maxShadowOpacity={0}
        mobileScrollSupport={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={0}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        {/* ── Cover ── */}
        <div className="relative bg-gradient-to-b from-[#c0174c] to-[#8b1a3a] border  p-8 text-white flex flex-col items-center justify-center shadow-lg shadow-gray-600 cursor-grab">
          <div className="flex justify-center items-center">
            <Image src="/golden-hearts.png" alt="Made2Match" width={100} height={100} />
          </div>
          <h1 className="text-4xl mb-6 text-center relative z-10 font-serif">Made2Match</h1>

          {/* Profile preview avatars on the cover */}
          <div className="flex -space-x-3 mb-6 relative z-10">
            {testimonials.slice(0, 4).map((t, i) => (
              <Image
                key={i}
                src={t.image || ''}
                alt={t.name}
                width={48}
                height={48}
                className="rounded-full border-2 border-white object-cover h-12 w-12"
                style={{ zIndex: 10 - i }}
              />
            ))}
          </div>

          <div className="w-full h-1 bg-white mb-6 relative z-10"></div>
          <div className="text-center">
            <span className="text-lg text-white text-center hover:text-pink-100 transition-colors duration-300 relative z-10">
              Browse real verified profiles
            </span>
             <div className="flex gap-1 mb-6 relative z-10">
            {testimonials.slice(0, 4).map((t, i) => (
              <Image
                key={i}
                src={t.image || ''}
                alt={t.name}
                width={48}
                height={48}
                className="rounded-xl border-2 border-white object-cover h-14 w-14"
                // style={{ zIndex: 10 - i }}
              />
            ))}
            
          </div>
            <span className="text-lg text-white text-center hover:text-pink-100 transition-colors duration-300 relative z-10">
              ProfilesBook
            </span>
          </div>
        </div>

        {/* ── Index ── */}
        <div className="w-full h-full flex justify-center items-center bg-[#fbeef2] border border-gray-300 box-border">
          <div className="page-front text-start text-white p-3 bg-[#c0174c]">Index</div>
          <div className="flex flex-col justify-start items-start p-8 space-y-3">
            <div>
              <ol className="grid grid-cols-2 gap-2">
                {testimonials.map((testimonial, index) => (
                  <React.Fragment key={index}>
                    <li
                      onClick={() => handleFlip(index + 2)}
                      className="flex justify-start items-center text-xs cursor-pointer hover:text-[#c0174c] transition-colors"
                    >
                      <Image
                        src={testimonial.image || ''}
                        alt={testimonial.name}
                        width={20}
                        height={20}
                        className="rounded-full mr-2 object-cover h-5 w-5"
                      />
                      {testimonial.name}
                    </li>
                    <li className="flex justify-end text-xs items-center">{index + 2}</li>
                  </React.Fragment>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* ── Profile pages ── */}
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-full h-full flex flex-col justify-center items-center bg-white border border-gray-300 box-border cursor-grab"
          >
            <div className="page-front text-end text-white p-3 bg-[#c0174c]">{index + 2}</div>
            <div className="flex justify-center items-center mt-7">
              <Image
                src={testimonial.image || ''}
                alt={testimonial.name}
                width={100}
                height={100}
                className="rounded-full object-cover h-[100px] w-[100px] border-4 border-[#fbeef2]"
              />
            </div>
            <div className="flex flex-col justify-center items-center mt-3">
              <span className="font-semibold text-gray-800">{testimonial.name}</span>
              <span className="text-gray-500 text-sm">{testimonial.jobtitle}</span>
            </div>
            <div className="p-5 font-serif font-semibold text-center text-gray-700">{testimonial.text}</div>
            <div className="flex justify-center items-center mt-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFA800" className="size-7">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
              {[...Array(5 - testimonial.rating)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CBD5E1" className="size-7">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
            </div>

            {/* Accept / Decline actions */}
            <div className="flex justify-center items-center gap-3 mt-5">
              <button
                onClick={handleAction}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex items-center gap-1 border border-gray-300 text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕ Decline
              </button>
              <button
                onClick={handleAction}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex items-center gap-1 bg-[#c0174c] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-[#a01040] transition-colors"
              >
                ♥ Accept
              </button>
            </div>
          </div>
        ))}

        {/* ── Back cover ── */}
        <div className="relative bg-gradient-to-b from-[#c0174c] to-[#8b1a3a] border p-8 text-white flex flex-col items-center justify-center">
          {/* Close button — flips the book back to the cover. */}
          <button
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Close book"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h1 className="text-4xl font-bold mb-4 text-center font-serif">Find Your Match</h1>
          <p className="text-lg text-center">Your story could be next 💍</p>

          <button
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
            className="mt-6 bg-white text-[#c0174c] text-sm font-bold px-5 py-2 rounded-full hover:bg-pink-100 transition-colors"
          >
            ✕ Close book
          </button>
        </div>
      </HTMLFlipBook>
    </div>
  );
};
