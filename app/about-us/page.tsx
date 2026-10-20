import Link from "next/link";

export const metadata = {
  title: "About Us | Made2Match Matrimony",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#c0174c] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-bold tracking-wide">Made2Match Matrimony</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold border border-white/60 rounded-full px-3 py-1.5 hover:bg-white hover:text-[#c0174c] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-3">About Us</h1>
        <p className="text-base text-gray-600 mb-10 max-w-2xl">
          Made2Match is a new matrimony platform created to help individuals and
          families discover compatible life partners with confidence, dignity,
          and respect for personal and cultural values.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            {
              title: "Growing community",
              description: "A welcoming space for people beginning a meaningful partner search.",
            },
            {
              title: "Compatibility focused",
              description: "Discover profiles using preferences that matter to you and your family.",
            },
            {
              title: "Privacy conscious",
              description: "Controls and secure account features help you manage your experience.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#c0174c]">{item.title}</h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Our mission</h2>
            <p>
              We believe finding a life partner should be thoughtful,
              transparent, and respectful of every family&apos;s values. Our
              platform is being built to make profile discovery and communication
              simpler, so members can focus on getting to know the right person.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">What sets us apart</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Search and discovery based on profile and partner preferences.</li>
              <li>Photo review and verification features that support member trust.</li>
              <li>Tools for interests, shortlists, matches, and conversations.</li>
              <li>Privacy controls for profile visibility and contact access.</li>
              <li>A growing service shaped by member feedback and continuous improvement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Reach us</h2>
            <p>
              Have a question or feedback? Our team is here to help — visit our{" "}
              <Link href="/help" className="text-[#c0174c] font-semibold">
                Help Centre
              </Link>{" "}
              or write to us at{" "}
              <a href="mailto:madetwomatch08@gmail.com" className="text-[#c0174c] font-semibold">
                madetwomatch08@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
