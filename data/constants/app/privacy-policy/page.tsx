import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Made2Match Matrimony",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 28 May 2026</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information we collect</h2>
            <p>
              When you create a profile, we collect the details you provide — including your name, date of birth, gender, contact information, religious and community details, preferences, and photographs. We also collect technical information such as device, browser, and IP address to keep the service secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. How we use your information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To match you with other members based on your preferences.</li>
              <li>To verify your identity and protect against fraudulent profiles.</li>
              <li>To send communications about matches, account activity, and offers you have opted into.</li>
              <li>To improve and personalise the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Who can see your profile</h2>
            <p>
              Your profile is visible to other registered members who meet our match criteria. You can use privacy settings to control who can view your photos and contact details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data security</h2>
            <p>
              We use industry-standard encryption and access controls to protect your information. No internet service can guarantee 100% security, but we work continuously to keep your data safe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Your rights</h2>
            <p>
              You may view, update, or delete your profile information at any time from your account settings. To request a full export or permanent deletion of your data, contact us at{" "}
              <a href="mailto:privacy@made2match.com" className="text-[#c0174c] font-semibold">
                privacy@made2match.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Updates to this policy</h2>
            <p>
              We may update this policy from time to time. The updated version will be posted on this page with a new "Last updated" date.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
