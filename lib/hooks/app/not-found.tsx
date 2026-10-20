import Link from "next/link";

export const metadata = {
  title: "Page Not Found · Made2Match",
  description: "The page you are looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf5f5] px-4 py-16 font-sans">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-baseline justify-center gap-0.5 mb-8">
          <span className="text-2xl font-black" style={{ color: "#c0174c", fontFamily: "Georgia, serif" }}>Made</span>
          <span className="text-2xl font-bold" style={{ color: "#f3e228" }}>2</span>
          <span className="text-2xl font-black" style={{ color: "#c0174c", fontFamily: "Georgia, serif" }}>Match</span>
        </div>

        {/* Big 404 with a heart */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-7xl sm:text-8xl font-black text-[#c0174c] leading-none">4</span>
          <svg viewBox="0 0 24 24" fill="#c0174c" className="w-16 h-16 sm:w-20 sm:h-20 -mt-1">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-7xl sm:text-8xl font-black text-[#c0174c] leading-none">4</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-2">
          Oops! This match doesn't exist
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          The page you're looking for may have been moved, removed, or never existed.
          Let's get you back on your journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-white text-sm font-bold shadow-lg transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)" }}
          >
            ← Back to Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-full text-sm font-bold border-2 transition-all hover:bg-[#c0174c] hover:text-white"
            style={{ borderColor: "#c0174c", color: "#c0174c" }}
          >
            Find Matches
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Need help? Visit our{" "}
          <Link href="/help" className="font-semibold text-[#c0174c] hover:underline">
            Help Centre
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
