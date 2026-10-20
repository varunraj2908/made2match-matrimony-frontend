'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// react-pageflip uses window/document, so load it client-side only.
const BookComponent = dynamic(
  () => import('@/components/ui/3d-book-testimonial').then((m) => m.Component),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[470px] w-[320px] text-white text-sm">
        Loading profiles…
      </div>
    ),
  }
);

const profiles = [
  {
    image: '/image1.jpg',
    name: 'Ananya Sharma',
    jobtitle: '28 · Software Engineer · Bangalore',
    text: 'Loves travel, books and weekend treks. Looking for a kind, ambitious partner.',
    rating: 5,
  },
  {
    image: '/image2.jpg',
    name: 'Rohan Mehta',
    jobtitle: '31 · Architect · Mumbai',
    text: 'Foodie and fitness enthusiast. Family-oriented and looking to settle down.',
    rating: 4,
  },
  {
    image: '/image3.jpg',
    name: 'Priya Nair',
    jobtitle: '27 · Doctor · Kochi',
    text: 'Caring and career-driven. Enjoys music, cooking and long conversations.',
    rating: 5,
  },
  {
    image: '/image4.jpg',
    name: 'Arjun Reddy',
    jobtitle: '30 · Entrepreneur · Hyderabad',
    text: 'Building my own startup. Adventurous, honest and looking for a best friend for life.',
    rating: 5,
  },
  {
    image: '/matrimony7.jpg',
    name: 'Kavya Iyer',
    jobtitle: '26 · Designer · Chennai',
    text: 'Creative soul who loves art, dance and chai. Seeking someone genuine and warm.',
    rating: 4,
  },
  {
    image: '/matrimony8.jpg',
    name: 'Vikram Singh',
    jobtitle: '33 · Commercial Pilot · Delhi',
    text: 'Travel the world for work, but home is where the heart is. Hoping to find mine.',
    rating: 5,
  },
  {
    image: '/matrimony1.webp',
    name: 'Sneha Patel',
    jobtitle: '29 · Chartered Accountant · Ahmedabad',
    text: 'Grounded, family-loving and ambitious. Looking for mutual respect and laughter.',
    rating: 4,
  },
  {
    image: '/image1.jpg',
    name: 'Karan Malhotra',
    jobtitle: '32 · Professor · Pune',
    text: 'Lifelong learner who loves history and trekking. Searching for a thoughtful partner.',
    rating: 5,
  },
];

export default function ProfileBookModal() {
  const [open, setOpen] = useState(false);

  // Auto-open fast on landing.
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden p-4  animate-fade-in"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {/* <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-[#c0174c] shadow-lg flex items-center justify-center hover:bg-pink-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button> */}

       
        <div className="animate-shake">
          <BookComponent testimonials={profiles} />
        </div>

        {/* Small blinking hint */}
        <div className="text-center -mt-2">
          <span className="animate-blink inline-flex items-center gap-1.5 text-white text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-white" />
            Tap or drag the corner to flip →
          </span>
        </div>
      </div>
    </div>
  );
}
