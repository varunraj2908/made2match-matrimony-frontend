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

        {/* ── Profile pages — full-bleed photo cards ── */}
        {testimonials.map((testimonial, index) => {
          const parts = (testimonial.jobtitle || '').split('·').map((s) => s.trim());
          const age = parts[0] || '';
          const city = parts[parts.length - 1] || '';
          const tier =
            testimonial.rating >= 5
              ? { label: 'DIAMOND', bg: 'linear-gradient(135deg,#5b2a86,#2d1b35)' }
              : testimonial.rating >= 4
              ? { label: 'GOLD', bg: 'linear-gradient(135deg,#d4a017,#8a6d11)' }
              : { label: 'SILVER', bg: 'linear-gradient(135deg,#9ca3af,#4b5563)' };
          return (
            <div
              key={index}
              className="relative w-full h-full overflow-hidden bg-gray-900 box-border cursor-grab rounded-xl border-[3px] border-white"
              style={{
                boxShadow:
                  '0 14px 30px rgba(80,10,30,0.40), 0 6px 10px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.06)',
              }}
            >
              {/* Photo */}
              <Image
                src={testimonial.image || ''}
                alt={testimonial.name}
                fill
                sizes="300px"
                className="object-cover"
              />

              {/* Dark + signature orange glow overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(0,0,0,0.88) 6%, rgba(0,0,0,0.15) 48%, rgba(0,0,0,0) 70%), ' +
                    'linear-gradient(0deg, rgba(255,110,40,0.55) 2%, rgba(255,110,40,0) 42%)',
                }}
              />

              {/* Tier ribbon — top-left */}
              <div
                className="absolute top-0 left-4 z-10 px-2.5 pt-2 pb-3 text-center text-white shadow-lg"
                style={{ background: tier.bg, clipPath: 'polygon(0 0,100% 0,100% 78%,50% 100%,0 78%)' }}
              >
                <div className="text-[8px] leading-none text-amber-300">★★★★★</div>
                <div className="text-[8px] font-bold tracking-[0.15em] mt-1">{tier.label}</div>
              </div>

              {/* Rating badge — top-right */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-0.5 bg-white/85 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold text-gray-800 shadow">
                {testimonial.rating.toFixed(1)}
                <span className="text-amber-500">★</span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
                <h3 className="text-2xl font-bold leading-tight font-serif drop-shadow">{testimonial.name}</h3>
                <p className="text-[11px] text-white/85 leading-snug mt-1 font-mono line-clamp-2">
                  {testimonial.text}
                </p>

                <div className="flex items-end justify-between mt-3 gap-2">
                  <div className="flex gap-4">
                    {age && (
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-white/60">Age</p>
                        <p className="text-sm font-bold">{age}</p>
                      </div>
                    )}
                    {city && (
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-white/60">City</p>
                        <p className="text-sm font-bold">{city}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAction}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-white transition-colors shadow"
                  >
                    Follow
                  </button>
                </div>
              </div>
            </div>
          );
        })}

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
