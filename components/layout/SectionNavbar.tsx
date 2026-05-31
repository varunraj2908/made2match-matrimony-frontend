"use client";
import { useState } from "react";

interface NavbarProps {
  onScrollTo?: (section: string) => void;
  /** When true, navbar slides up to top:0; otherwise sits at top:72 below Header. */
  scrolled?: boolean;
  /** @deprecated The navbar now uses a fixed offset (72px) below the page header. */
  navTop?: string;
}
type NavItem = {
  key: string;
  label: string;
  badge?: number | string | null;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    key: "home",
    label: "Register",
    badge: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    key: "Featured Profiles",
    label: "Profiles",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    key: "Working Flow",
    label: "Connect",
    badge: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    key: "Success Stories",
    label: "Stories",
    badge: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    key: "Plans",
    label: "Plans",
    badge: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19 3H5L2 9l10 12L22 9l-3-6zm-9 13.5L4.5 9.5 6.85 5h10.3l2.35 4.5L10 16.5zm1-9.5h2v5h-2zm0 6h2v2h-2z" />
      </svg>
    ),
  },
  {
    key: "Faqs",
    label: "FAQs",
    badge: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
      </svg>
    ),
  },
];

export default function SectionNavbar({ onScrollTo }: NavbarProps) {
  const [active, setActive] = useState("home");

  const handleNav = (key: string) => {
    setActive(key);
    if (onScrollTo) onScrollTo(key);
  };

  return (
    <header className="relative bg-gray-100 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center h-16">
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className="relative flex flex-col items-center cursor-pointer gap-0.5 px-4 py-2 rounded-lg transition-all group"
                style={{ color: isActive ? "#c0174c" : "#6b7280" }}
              >
                {/* Badge */}
                {item.badge && (
                  <span
                    className="absolute -top-0.5 right-2.5 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "#c0174c" }}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Icon */}
                <span className="transition-transform group-hover:scale-110">
                  {item.icon}
                </span>

                {/* Label */}
                <span className="text-[10px] font-semibold">{item.label}</span>

                {/* Active dot */}
                {isActive && (
                  <span
                    className="absolute bottom-0.5 w-7 h-1 rounded-full"
                    style={{ background: "#c0174c" }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}