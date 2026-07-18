import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header({
  onClick,
}: {
  onClick?: () => void;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-999 bg-white border-b border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 lg:px-6 py-3 gap-1 lg:gap-0">
        
        {/* TOP SECTION */}
        <div className="flex items-center justify-between lg:justify-start w-full lg:w-auto">
          <div className="flex items-center">
            <Image
              src="/golden-hearts.png"
              alt="golden-hearts"
              width={120}
              height={60}
              className="object-cover w-28 -ml-2 sm:-ml-3 lg:-ml-4"
            />

            <div className="w-auto lg:w-75">
              <span
                className="text-[26px] font-extrabold tracking-tight"
                style={{
                  color: "#e63975",
                  fontFamily: "Georgia, serif",
                }}
              >
                <span className="text-[#c0174c] text-[36px]">M</span>
                ade
                <span style={{ color: "#e63975" }}>
                  <span className="text-[#FFD700] text-[36px]">2</span>
                  <span className="text-[#c0174c] text-[36px]">M</span>
                  atch
                </span>
              </span>
            </div>
          </div>

          {/* MOBILE LOGO */}
          <div className="w-14 h-14 lg:hidden rounded-full bg-white border-2 border-[#c0174c] flex items-center justify-center font-bold text-[#c0174c] text-[16px]">
            M<span className="text-[#FFD700]">2</span>M
          </div>
        </div>

        {/* MARQUEE */}
        <div className="overflow-hidden w-full lg:w-auto">
          <div className="whitespace-nowrap animate-marquee text-[#c0174c] font-semibold text-xs sm:text-sm text-center">
            🇮🇳 India’s No.1 Made2Match App • Find Your Perfect Match •
            Made2Match 💍
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-center lg:justify-end gap-2 sm:gap-4">
          <span className="hidden lg:block text-gray-700 font-medium italic text-base">
            Let&apos;s Get Married
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => router.push("/login")}
              className="btn-primary px-4 sm:px-5 py-1.5 rounded-md cursor-pointer text-sm"
            >
              Login
            </button>

            <button
              onClick={onClick}
              className="btn-primary px-4 sm:px-5 py-1.5 rounded-md cursor-pointer text-sm"
            >
              Register Free
            </button>
          </div>

          {/* DESKTOP LOGO */}
          <div className="hidden lg:flex w-8 h-10 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-[#c0174c] items-center justify-center font-bold text-[#c0174c] text-[16px]">
            M<span className="text-[#FFD700]">2</span>M
          </div>
        </div>
      </div>
    </header>
  );
}