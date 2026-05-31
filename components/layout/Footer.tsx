"use client";

import Link from "next/link";
import { useState } from "react";
import { submitContactMessage } from "@/services/contactService";

const PRIMARY_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Registration", href: "/" },
  { label: "Member Login", href: "/login" },
  { label: "Partner Search", href: "/search" },
  { label: "Membership", href: "/specialoffer" },
  { label: "Astrology Guide", href: "/horoscope" },
];

const SECONDARY_LINKS: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact Us", href: "/help" },
  { label: "About Us", href: "/about-us" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Success Story", href: "/#success-stories" },
];

const SUPPORT_PHONE = "+91 8075067058";
const SUPPORT_PHONE_TEL = "+918075067058";
const SUPPORT_EMAIL = "madetwomatch08@gmail.com";

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; text: string }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ ok: false, text: "Please fill in your name, email and message." });
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        mobileNumber: mobile.trim() || undefined,
        message: message.trim(),
      });
      setStatus({
        ok: true,
        text: "Thanks! We received your message and will get back soon.",
      });
      setName("");
      setEmail("");
      setMobile("");
      setMessage("");
    } catch (err: any) {
      setStatus({
        ok: false,
        text:
          err?.response?.data?.message ||
          "Could not send right now. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      style={{ background: "#c0174c" }}
      className="px-4 md:px-64 py-8 "
    >
      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-8">

        {/* QUICK LINKS */}
        <div className="flex-1">
          <h4 className="text-white font-bold text-base mb-4">
            Quick Links
          </h4>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
            <div className="flex flex-col gap-2">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/80 hover:text-white text-xs transition border-b border-white/20 pb-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {SECONDARY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/80 hover:text-white text-xs transition border-b border-white/20 pb-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* SUPPORT */}
        <div className="flex-1">
          <h4 className="text-white font-bold text-base mb-4">
            Help &amp; Support
          </h4>

          <div className="flex flex-col gap-3">
            <a href={`tel:${SUPPORT_PHONE_TEL}`} className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-sm shrink-0">
                📞
              </div>
              <span className="text-white/80 group-hover:text-white text-xs transition">
                {SUPPORT_PHONE}
              </span>
            </a>

            <a href={`https://wa.me/${SUPPORT_PHONE_TEL.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-sm shrink-0">
                📱
              </div>
              <span className="text-white/80 group-hover:text-white text-xs transition">
                {SUPPORT_PHONE} (WhatsApp)
              </span>
            </a>

            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-sm shrink-0">
                ✉️
              </div>

              <div>
                <p className="text-white/80 group-hover:text-white text-xs transition">
                  {SUPPORT_EMAIL}
                </p>

                <p className="text-white/60 text-xs">
                  (And we will respond you right away)
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="flex-1">
          <h4 className="text-white font-bold text-base mb-4">
            Need Assistance
          </h4>

          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30"
            />

            <input
              type="tel"
              placeholder="Phone number (optional)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30"
            />

            <textarea
              placeholder="Message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30 resize-none"
            />

            <button
              type="submit"
              disabled={submitting}
              className="self-start bg-[#8b1a3a] hover:bg-[#6e1430] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-2 rounded text-xs tracking-widest uppercase transition"
            >
              {submitting ? "Sending..." : "Submit"}
            </button>

            {status && (
              <p className={`text-xs mt-1 ${status.ok ? "text-green-100" : "text-yellow-100"}`}>
                {status.text}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-6 pt-4 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/60 text-xs text-center md:text-left">
          © Made2Match, all rights are reserved
        </p>

        <div className="flex gap-2">
          <button className="bg-[#3b5998] hover:bg-[#2d4373] text-white text-xs font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition">
            f Share
          </button>

          <button className="bg-[#1da1f2] hover:bg-[#0c85d0] text-white text-xs font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition">
            🐦 Tweet
          </button>
        </div>
      </div>
    </footer>
  );
}
