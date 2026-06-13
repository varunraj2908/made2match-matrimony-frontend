"use client";

export default function RegisterNowButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-50 justify-center items-center p-4 cursor-pointer">
      <button
        onClick={onClick}
        className="text-white font-bold text-xs sm:text-sm w-32 sm:w-36 py-2 shadow-lg -rotate-90 origin-left cursor-pointer rounded-t-md"
        style={{ background: "#c0174c" }}
      >
        Register Now
      </button>
    </div>
  );
}
