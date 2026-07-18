import Image from "next/image";

export default function BannerQuote({ onClick }: { onClick: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#981a3d] via-[#b51649] to-[#d41459] px-4 py-6 sm:px-6 md:h-60 md:py-4 lg:px-8">
      <div className="relative mx-auto h-40 w-40 shrink-0 md:hidden xl:absolute xl:bottom-0 xl:left-8 xl:block xl:h-full xl:w-50">
        <Image
          src="/romantic-couple.png"
          alt="Romantic couple illustration"
          fill
          className="object-contain object-top"
        />
      </div>

      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-8 lg:px-6">
        <div className="z-10 flex max-w-md flex-col items-center gap-3 text-center md:items-start md:text-left">
          <p
            className="text-lg font-semibold leading-snug text-white md:text-xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            It is true that marriages are made in heaven and life is too much
            boring without a life partner.
          </p>

          <button
            type="button"
            onClick={onClick}
            className="btn-primary cursor-pointer rounded-full px-5 py-2 text-xs uppercase tracking-widest"
          >
            Register Now
          </button>
        </div>

        <div className="hidden shrink-0 rotate-12 text-4xl opacity-60 md:block xl:mr-[320px]">
          🎺
        </div>

      </div>

      <div className="absolute -bottom-8 right-4 hidden h-[125%] w-80 xl:block 2xl:right-8 2xl:w-88">
        <Image
          src="/wedding-bg.webp"
          alt="Newly married couple"
          fill
          className="object-contain object-bottom"
          sizes="352px"
        />
      </div>
    </section>
  );
}
