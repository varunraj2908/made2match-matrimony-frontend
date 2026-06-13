"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "1. How do I register?",
    a: "Registration is simple and free! Click on 'Register Free' on the homepage, fill in your basic details like name, email, mobile number, date of birth, religion and caste. Verify your mobile number with an OTP and your profile will be live within minutes.",
  },
  {
    q: "2. Can I search for profiles by Christian community?",
    a: "Yes! Made2Match allows you to filter profiles by religion, caste, sub-caste and community. Simply use the search filters and select 'Christian' under Religion, then further narrow down by denomination or region to find the most compatible matches.",
  },
  {
    q: "3. Is the app free to download?",
    a: "Yes, the Made2Match app is completely free to download on both Android and iOS. Basic features like profile creation, browsing and sending interests are free. Premium membership unlocks unlimited messaging, contact details and advanced search filters.",
  },
  {
    q: "4. Are the profiles verified?",
    a: "All profiles on Made2Match go through a verification process. Members can get a 'Verified' badge by submitting a government-issued ID. We also use AI-based photo verification to ensure profile photos are genuine and up to date.",
  },
  {
    q: "5. How do I contact a profile I like?",
    a: "You can send an 'Interest' to any profile you like. If they accept your interest, you can start chatting. Premium members get access to direct contact numbers and can initiate conversations without waiting for interest acceptance.",
  },
  {
    q: "6. Can I hide my profile from certain members?",
    a: "Yes! Made2Match offers privacy controls that let you hide your profile from specific members, show it only to members you have connected with, or set it to visible only after you send an interest. You can manage these settings under Privacy Settings.",
  },
  {
    q: "7. What membership plans are available?",
    a: "Made2Match offers three membership plans — Basic (Free), Silver and Gold. Silver gives you access to contact details and unlimited messaging. Gold includes all Silver features plus priority placement in search results, profile highlighting and dedicated relationship manager support.",
  },
  {
    q: "8. How do I report a fake or suspicious profile?",
    a: "If you come across a suspicious profile, click the 'Report' button on their profile page and select the reason. Our trust and safety team reviews all reports within 24 hours and takes appropriate action including removal of fake profiles.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#fdf5f5" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1a0a0c" }}
          >
            Your{" "}
            <em
              className="not-italic"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                color: "#1a0a0c",
              }}
            >
              Made2Match
            </em>
            <br />
            Queries
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? "#fff" : "#fff",
                  border: isOpen ? "1.5px solid #f5c6cb" : "1.5px solid #f0e8e8",
                  boxShadow: isOpen ? "0 4px 24px rgba(178,34,52,0.08)" : "none",
                }}
              >
                {/* Question Row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-7 py-5 text-left transition-colors group"
                  style={{ background: isOpen ? "#fff9f9" : "transparent" }}
                >
                  <span
                    className="text-base font-semibold pr-4 transition-colors"
                    style={{
                      color: isOpen ? "#b22234" : "#2d1a1e",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {faq.q}
                  </span>

                  {/* Chevron */}
                  <span
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isOpen ? "#b22234" : "#f5eded",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M2 5l5 5 5-5"
                        stroke={isOpen ? "#fff" : "#b22234"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer */}
                <div
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  <div className="px-7 pb-5 pt-1">
                    <div
                      className="h-px mb-4"
                      style={{ background: "linear-gradient(90deg, #f5c6cb, transparent)" }}
                    />
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#9e6670" }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-sm mb-4" style={{ color: "#c97080" }}>
            Still have questions? We&apos;re here to help.
          </p>
          <button className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm cursor-pointer">
            💬 Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}