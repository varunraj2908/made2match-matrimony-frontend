import type { MyProfile } from "@/services/homeService";

// Brand colours
const BRAND: [number, number, number] = [178, 34, 52]; // #b22234
const ACCENT: [number, number, number] = [234, 88, 12]; // #ea580c
const INK: [number, number, number] = [40, 40, 40];
const MUTED: [number, number, number] = [110, 110, 110];

const fmtIncome = (n?: number) => {
  if (!n || n <= 0) return undefined;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr / year`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} Lakh / year`;
  return `₹${n.toLocaleString("en-IN")} / year`;
};

const cap = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, " ") : undefined;

// Try to load an image URL as a data URL for embedding (best-effort; needs CORS).
async function loadImage(url?: string): Promise<{ data: string; fmt: "PNG" | "JPEG" } | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const fmt: "PNG" | "JPEG" = blob.type.includes("png") ? "PNG" : "JPEG";
    const data = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    return { data, fmt };
  } catch {
    return null;
  }
}

export async function downloadBiodata(me: MyProfile): Promise<void> {
  // Load the browser ESM build directly (avoids jsPDF's Node build + fflate worker under SSR).
  // @ts-expect-error - deep import has no bundled types
  const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;

  const fullName =
    [me.firstName, me.lastName].filter(Boolean).join(" ").trim() || "Member";
  const userCode = `M2M-E${String(me.userId).padStart(7, "0")}`;

  // ── Header band ──
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, W, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BIO-DATA", margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Made2Match Matrimony", margin, 26);

  // ── Photo (best-effort) + name block ──
  const photo = await loadImage(
    me.profilePhotoUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=b22234&color=fff&size=240`,
  );
  const photoX = W - margin - 34;
  const photoY = 44;
  if (photo) {
    try {
      doc.addImage(photo.data, photo.fmt, photoX, photoY, 34, 42);
      doc.setDrawColor(...BRAND);
      doc.setLineWidth(0.6);
      doc.rect(photoX, photoY, 34, 42);
    } catch {
      /* ignore bad image */
    }
  }

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(fullName, margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(userCode, margin, 57);
  if (me.isPremium) {
    doc.setTextColor(...ACCENT);
    doc.setFont("helvetica", "bold");
    doc.text("★ Prime Member", margin, 63);
  }

  // ── Section renderer ──
  let y = 78;

  const heading = (label: string) => {
    if (y > 265) {
      doc.addPage();
      y = 24;
    }
    doc.setFillColor(...ACCENT);
    doc.rect(margin, y - 4, 3, 6, "F");
    doc.setTextColor(...BRAND);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(label.toUpperCase(), margin + 6, y);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 3, W - margin, y + 3);
    y += 11;
  };

  const row = (label: string, value?: string) => {
    if (!value) return;
    if (y > 280) {
      doc.addPage();
      y = 24;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(value, W - margin - (margin + 50));
    doc.text(lines, margin + 50, y);
    y += Math.max(7, lines.length * 5.2);
  };

  heading("Personal Details");
  row("Full Name", fullName);
  row("Gender", cap(me.gender));
  row("Age", me.age ? `${me.age} years` : undefined);
  row("Marital Status", cap(me.maritalStatus));
  row("Religion", cap(me.religion));
  row("Caste / Community", cap(me.caste));

  heading("Education & Career");
  row("Qualification", me.highestQualification);
  row("Occupation", cap(me.occupation));
  row("Annual Income", fmtIncome(me.annualIncome));

  heading("Location");
  row("City", cap(me.city));
  row("State", cap(me.state));
  row("Country", cap(me.country) || "India");

  if (me.bio && me.bio.trim()) {
    heading("About Me");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(me.bio.trim(), W - margin * 2);
    if (y > 270) {
      doc.addPage();
      y = 24;
    }
    doc.text(lines, margin, y);
    y += lines.length * 5.2 + 4;
  }

  // ── Footer ──
  const footerY = 288;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, footerY - 4, W - margin, footerY - 4);
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Generated via Made2Match · ${today}`, margin, footerY);
  doc.text("made2match.com", W - margin, footerY, { align: "right" });

  doc.save(`Biodata-${fullName.replace(/\s+/g, "-")}.pdf`);
}
