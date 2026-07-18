'use client';

import dynamic from 'next/dynamic';

// react-pageflip uses window/document, so load it client-side only.
const BookComponent = dynamic(
  () => import('@/components/ui/3d-book-testimonial').then((m) => m.Component),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[470px] text-[#c0174c] text-sm">
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

export default function ProfileBook() {
  return (
    <section className="bg-[#fdf5f7] px-4 py-14">
      <div className="text-center mb-6">
        <p className="text-[#c0174c] text-xs font-bold tracking-widest uppercase mb-2">
          ✦ Meet Our Members
        </p>
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-gray-800"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Flip Through Profiles
        </h2>
        <p className="text-gray-500 text-xs mt-2">
          Drag the page corner or tap a name to browse — just like a real album.
        </p>

        {/* Small blinking hint to nudge interaction */}
        <span className="animate-blink inline-flex items-center gap-1.5 mt-3 text-[#c0174c] text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-[#c0174c]" />
          Tap or drag to flip →
        </span>
      </div>

      <BookComponent testimonials={profiles} />
    </section>
  );
}
