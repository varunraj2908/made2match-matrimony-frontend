import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Made2Match Matrimony",
};

export default function TermsAndConditionsPage() {
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
        <h1 className="text-3xl font-black text-gray-900 mb-2">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 28 May 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of terms</h2>
            <p>
              By creating an account or using Made2Match, you agree to these Terms & Conditions and our{" "}
              <Link href="/privacy-policy" className="text-[#c0174c] font-semibold">
                Privacy Policy
              </Link>
              . If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Eligibility</h2>
            <p>
              You must be of legal marriageable age in your jurisdiction to register. You confirm that all information you provide is accurate, current, and belongs to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Acceptable use</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Do not impersonate another person or create multiple accounts.</li>
              <li>Do not solicit, harass, or share inappropriate content with other members.</li>
              <li>Do not use the service for any commercial or non-matrimonial purpose.</li>
              <li>Respect the privacy of other members at all times.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Memberships and payments</h2>
            <p>
              Prime memberships are billed in advance and renew automatically unless cancelled. Refunds, where applicable, are governed by our money-back policy detailed on the membership page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Account suspension</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms, post misleading information, or engage in behaviour harmful to other members.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Limitation of liability</h2>
            <p>
              Made2Match is a platform that helps people connect; we cannot guarantee a marriage or the conduct of any member. To the extent permitted by law, we are not liable for any indirect or consequential damages arising from use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Governing law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes will be resolved in the courts located in Kerala, India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a href="mailto:legal@made2match.com" className="text-[#c0174c] font-semibold">
                legal@made2match.com
              </a>{" "}
              or visit the{" "}
              <Link href="/help" className="text-[#c0174c] font-semibold">
                Help Centre
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
