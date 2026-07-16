"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type SlideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  width?: string;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
};

/* ─────────────────────────────────────────────
   SLIDE MODAL
───────────────────────────────────────────── */
export default function SlideModal({
  isOpen,
  onClose,
  title,
  width = "max-w-md",
  children,
  onSave,
  saving = false,
}: SlideModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* ── Backdrop — only covers LEFT of panel, not behind it ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          backgroundColor: "rgba(0,0,0,0.4)",
          transition: "opacity 0.3s",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* ── Slide Panel ── */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          zIndex: 9999,
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxShadow: isOpen ? "-4px 0 24px rgba(0,0,0,0.12)" : "none",
          transition: "transform 0.3s ease-in-out",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          // Explicit width so it never bleeds
          width: "100%",
          maxWidth: "448px", // matches max-w-md (28rem)
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #e5e7eb",
            flexShrink: 0,
            backgroundColor: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1f2937", margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#f3f4f6";
              (e.currentTarget as HTMLElement).style.color = "#111827";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#6b7280";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.25rem",
            backgroundColor: "#ffffff",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            borderTop: "1px solid #e5e7eb",
            flexShrink: 0,
            backgroundColor: "#ffffff",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#4b5563",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              background: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f9fafb"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#fff"; }}
          >
            Cancel
          </button>
          <button
            disabled={saving}
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              backgroundColor: "#c0174c",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a3a"; }}
            onMouseLeave={e => { if (!saving) (e.currentTarget as HTMLElement).style.backgroundColor = "#c0174c"; }}
            onClick={onSave ?? onClose}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}