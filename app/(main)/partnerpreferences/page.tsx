"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getMyPreferences,
  updateMyPreferences,
  type PartnerPreferencePayload,
} from "@/services/profileService";

type Pref = PartnerPreferencePayload;

const sections = ["Basic", "Religious", "Professional", "Location", "About My Partner"] as const;
type Section = typeof sections[number];

// ── Option lists ────────────────────────────────────────────────
type Opt = { label: string; value?: string };
const opts = (...labels: string[]): Opt[] => [{ label: "Any" }, ...labels.map((l) => ({ label: l, value: l }))];

const AGE_OPTS = Array.from({ length: 48 }, (_, i) => 18 + i); // 18–65
const HEIGHT_CM = Array.from({ length: 56 }, (_, i) => 140 + i); // 140–195 cm
const cmToFtIn = (cm?: number) => {
  if (!cm) return "";
  const t = Math.round(cm / 2.54);
  return `${Math.floor(t / 12)}'${t % 12}" / ${cm} Cms`;
};

const MARITAL_OPTS: Opt[] = [
  { label: "Any" },
  { label: "Never Married", value: "NEVER_MARRIED" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Widowed", value: "WIDOWED" },
  { label: "Awaiting Divorce", value: "AWAITING_DIVORCE" },
];
const DIET_OPTS: Opt[] = [
  { label: "Any" },
  { label: "Vegetarian", value: "VEGETARIAN" },
  { label: "Non Vegetarian", value: "NON_VEGETARIAN" },
  { label: "Eggetarian", value: "EGGETARIAN" },
  { label: "Vegan", value: "VEGAN" },
  { label: "Jain", value: "JAIN" },
];
const RELIGION_OPTS = opts("Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other");
const EDUCATION_OPTS = opts("Any Graduate", "B.Tech", "M.Tech", "MBA", "MBBS", "B.Sc", "M.Sc", "PhD", "Diploma");
const OCCUPATION_OPTS = opts("Software Professional", "Doctor", "Engineer", "Teacher", "Business", "Government", "Accountant", "Lawyer");
const COUNTRY_OPTS = opts("India", "USA", "UK", "Canada", "Australia", "UAE");
const STATE_OPTS = opts("Kerala", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Other");
const INCOME_OPTS: { label: string; value?: number }[] = [
  { label: "No Preference" },
  { label: "₹2 Lakhs+", value: 200000 },
  { label: "₹4 Lakhs+", value: 400000 },
  { label: "₹6 Lakhs+", value: 600000 },
  { label: "₹8 Lakhs+", value: 800000 },
  { label: "₹10 Lakhs+", value: 1000000 },
  { label: "₹15 Lakhs+", value: 1500000 },
  { label: "₹25 Lakhs+", value: 2500000 },
];

// ── Field descriptors ───────────────────────────────────────────
type Editor =
  | { kind: "agerange" }
  | { kind: "heightrange" }
  | { kind: "select"; field: keyof Pref; options: Opt[] }
  | { kind: "bool"; field: keyof Pref; trueLabel: string; falseLabel: string }
  | { kind: "income"; field: "minAnnualIncome" }
  | { kind: "text"; field: keyof Pref }
  | { kind: "textarea"; field: keyof Pref };

interface Row {
  id: string;
  label: string;
  editor: Editor;
  display: (p: Pref) => string;
}

const selLabel = (options: Opt[], value?: string) =>
  value ? options.find((o) => o.value === value)?.label ?? value : "Any";

const ROWS: Record<Section, Row[]> = {
  Basic: [
    { id: "age", label: "Partner Age", editor: { kind: "agerange" },
      display: (p) => (p.minAge || p.maxAge ? `${p.minAge ?? "Any"} - ${p.maxAge ?? "Any"} years` : "Any") },
    { id: "height", label: "Height", editor: { kind: "heightrange" },
      display: (p) => (p.minHeightCm || p.maxHeightCm ? `${cmToFtIn(p.minHeightCm) || "Any"} - ${cmToFtIn(p.maxHeightCm) || "Any"}` : "Any") },
    { id: "marital", label: "Marital Status", editor: { kind: "select", field: "preferredMaritalStatus", options: MARITAL_OPTS },
      display: (p) => selLabel(MARITAL_OPTS, p.preferredMaritalStatus) },
    { id: "diet", label: "Eating Habits", editor: { kind: "select", field: "preferredDiet", options: DIET_OPTS },
      display: (p) => selLabel(DIET_OPTS, p.preferredDiet) },
    { id: "smoking", label: "Smoking", editor: { kind: "bool", field: "smokingAcceptable", trueLabel: "Acceptable", falseLabel: "Should not smoke" },
      display: (p) => (p.smokingAcceptable ? "Acceptable" : "Should not smoke") },
    { id: "drinking", label: "Drinking", editor: { kind: "bool", field: "drinkingAcceptable", trueLabel: "Acceptable", falseLabel: "Should not drink" },
      display: (p) => (p.drinkingAcceptable ? "Acceptable" : "Should not drink") },
  ],
  Religious: [
    { id: "religion", label: "Religion", editor: { kind: "select", field: "preferredReligion", options: RELIGION_OPTS },
      display: (p) => selLabel(RELIGION_OPTS, p.preferredReligion) },
    { id: "caste", label: "Caste", editor: { kind: "text", field: "preferredCaste" },
      display: (p) => p.preferredCaste || "Any" },
    { id: "casteNoBar", label: "Caste No Bar", editor: { kind: "bool", field: "casteNoBar", trueLabel: "Yes — any caste", falseLabel: "No" },
      display: (p) => (p.casteNoBar ? "Yes — any caste" : "No") },
  ],
  Professional: [
    { id: "education", label: "Education", editor: { kind: "select", field: "preferredEducation", options: EDUCATION_OPTS },
      display: (p) => selLabel(EDUCATION_OPTS, p.preferredEducation) },
    { id: "occupation", label: "Occupation", editor: { kind: "select", field: "preferredOccupation", options: OCCUPATION_OPTS },
      display: (p) => selLabel(OCCUPATION_OPTS, p.preferredOccupation) },
    { id: "income", label: "Annual Income", editor: { kind: "income", field: "minAnnualIncome" },
      display: (p) => INCOME_OPTS.find((o) => o.value === p.minAnnualIncome)?.label ?? "No Preference" },
  ],
  Location: [
    { id: "country", label: "Country", editor: { kind: "select", field: "preferredCountry", options: COUNTRY_OPTS },
      display: (p) => selLabel(COUNTRY_OPTS, p.preferredCountry) },
    { id: "state", label: "State", editor: { kind: "select", field: "preferredState", options: STATE_OPTS },
      display: (p) => selLabel(STATE_OPTS, p.preferredState) },
  ],
  "About My Partner": [
    { id: "desc", label: "About My Partner", editor: { kind: "textarea", field: "partnerDescription" },
      display: (p) => p.partnerDescription || "Not specified yet." },
  ],
};

const sectionIcons: Record<Section, React.ReactNode> = {
  Basic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Religious: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Professional: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Location: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  "About My Partner": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

const selectCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c0174c] focus:border-transparent text-sm bg-white appearance-none cursor-pointer";

/* ── Edit Modal (dropdown-aware) ─────────────────────────────────── */
function EditModal({
  row,
  pref,
  onClose,
  onSave,
}: {
  row: Row;
  pref: Pref;
  onClose: () => void;
  onSave: (patch: Pref) => void;
}) {
  const [draft, setDraft] = useState<Pref>({ ...pref });
  const e = row.editor;

  const body = (() => {
    switch (e.kind) {
      case "agerange":
        return (
          <div className="flex items-center gap-3">
            <select className={selectCls} value={draft.minAge ?? ""} onChange={(ev) => setDraft((d) => ({ ...d, minAge: ev.target.value ? Number(ev.target.value) : undefined }))}>
              <option value="">Any</option>
              {AGE_OPTS.map((a) => <option key={a} value={a}>{a} yrs</option>)}
            </select>
            <span className="text-gray-400 text-sm">to</span>
            <select className={selectCls} value={draft.maxAge ?? ""} onChange={(ev) => setDraft((d) => ({ ...d, maxAge: ev.target.value ? Number(ev.target.value) : undefined }))}>
              <option value="">Any</option>
              {AGE_OPTS.map((a) => <option key={a} value={a}>{a} yrs</option>)}
            </select>
          </div>
        );
      case "heightrange":
        return (
          <div className="flex items-center gap-3">
            <select className={selectCls} value={draft.minHeightCm ?? ""} onChange={(ev) => setDraft((d) => ({ ...d, minHeightCm: ev.target.value ? Number(ev.target.value) : undefined }))}>
              <option value="">Any</option>
              {HEIGHT_CM.map((c) => <option key={c} value={c}>{cmToFtIn(c)}</option>)}
            </select>
            <span className="text-gray-400 text-sm">to</span>
            <select className={selectCls} value={draft.maxHeightCm ?? ""} onChange={(ev) => setDraft((d) => ({ ...d, maxHeightCm: ev.target.value ? Number(ev.target.value) : undefined }))}>
              <option value="">Any</option>
              {HEIGHT_CM.map((c) => <option key={c} value={c}>{cmToFtIn(c)}</option>)}
            </select>
          </div>
        );
      case "select":
        return (
          <select className={selectCls} value={(draft[e.field] as string) ?? ""} onChange={(ev) => setDraft((d) => ({ ...d, [e.field]: ev.target.value || undefined }))}>
            {e.options.map((o) => <option key={o.label} value={o.value ?? ""}>{o.label}</option>)}
          </select>
        );
      case "bool":
        return (
          <select className={selectCls} value={draft[e.field] ? "true" : "false"} onChange={(ev) => setDraft((d) => ({ ...d, [e.field]: ev.target.value === "true" }))}>
            <option value="false">{e.falseLabel}</option>
            <option value="true">{e.trueLabel}</option>
          </select>
        );
      case "income":
        return (
          <select className={selectCls} value={draft.minAnnualIncome ?? ""} onChange={(ev) => setDraft((d) => ({ ...d, minAnnualIncome: ev.target.value ? Number(ev.target.value) : undefined }))}>
            {INCOME_OPTS.map((o) => <option key={o.label} value={o.value ?? ""}>{o.label}</option>)}
          </select>
        );
      case "text":
        return (
          <input className={selectCls} value={(draft[e.field] as string) ?? ""} placeholder="Type here (or leave blank for Any)"
            onChange={(ev) => setDraft((d) => ({ ...d, [e.field]: ev.target.value || undefined }))} />
        );
      case "textarea":
        return (
          <textarea rows={5} className={`${selectCls} resize-none`} value={(draft[e.field] as string) ?? ""} placeholder="Describe the partner you're looking for…"
            onChange={(ev) => setDraft((d) => ({ ...d, [e.field]: ev.target.value || undefined }))} />
        );
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}>
          <h3 className="text-white font-semibold text-base tracking-wide">Edit {row.label}</h3>
        </div>
        <div className="p-5">
          <label className="block text-xs font-medium text-gray-500 mb-2">{row.label}</label>
          {body}
        </div>
        <div className="px-5 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave(draft)} className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PartnerPreferences() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("Basic");
  const [pref, setPref] = useState<Pref>({});
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const load = () => {
    setLoading(true);
    getMyPreferences()
      .then((p) => setPref(p ?? {}))
      .catch(() => setToast({ ok: false, text: "Could not load preferences." }))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Auto-dismiss the toast so it doesn't linger across sections.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const applyPatch = (patch: Pref) => {
    setPref(patch);
    setEditRow(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const saved = await updateMyPreferences(pref);
      setPref(saved ?? pref);
      setToast({ ok: true, text: "Preferences saved!" });
    } catch (e) {
      setToast({
        ok: false,
        text:
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || "Could not save preferences.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className=" bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <header className="text-white shadow-lg" style={{ background: "linear-gradient(135deg, #c0174c 0%, #a01040 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer" aria-label="Back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-wide">Partner Preferences</span>
          </div>
          <button className="text-xs px-3 py-1.5 border border-white/60 rounded-full font-bold hover:bg-white hover:text-[#c0174c] transition-colors"
            onClick={() => router.push("/specialoffer")}>
            Upgrade
          </button>
        </div>

        {/* Mobile section tabs */}
        <div className="md:hidden border-t border-white/10 overflow-x-auto flex" style={{ scrollbarWidth: "none" }}>
          {sections.map((section) => (
            <button key={section} onClick={() => setActiveSection(section)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeSection === section ? "bg-white/20 border-b-2 border-white text-white" : "text-white/70 hover:text-white"
              }`}>
              <span className="opacity-80">{sectionIcons[section]}</span>
              {section}
            </button>
          ))}
        </div>
      </header>

      {/* Desktop layout */}
      <div className="max-w-6xl mx-auto my-8 px-4 hidden md:flex gap-4 min-h-[calc(100vh-80px)]">
        <aside className="w-64 shrink-0 text-white flex flex-col rounded-xl overflow-hidden self-start"
          style={{ background: "linear-gradient(180deg, #c0174c 0%, #8b0f38 100%)" }}>
          <div className="px-6 py-7 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm tracking-wider uppercase leading-tight">Partner</p>
                <p className="font-bold text-sm tracking-wider uppercase leading-tight">Preferences</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 py-3">
            {sections.map((section) => (
              <button key={section} onClick={() => setActiveSection(section)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-200 group ${
                  activeSection === section ? "bg-white/20 font-semibold border-r-4 border-white" : "hover:bg-white/10 font-medium text-white/80"
                }`}>
                <span className={`transition-colors ${activeSection === section ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
                  {sectionIcons[section]}
                </span>
                <span className="text-sm tracking-wide">{section}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <MainContent activeSection={activeSection} pref={pref} loading={loading} onEdit={setEditRow}
            onSave={handleSave} onReset={load} saving={saving} toast={toast} />
        </main>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden px-3 py-4">
        <main className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <MainContent activeSection={activeSection} pref={pref} loading={loading} onEdit={setEditRow}
            onSave={handleSave} onReset={load} saving={saving} toast={toast} />
        </main>
      </div>

      {editRow && (
        <EditModal row={editRow} pref={pref} onClose={() => setEditRow(null)} onSave={applyPatch} />
      )}
    </div>
  );
}

/* ── Shared Main Content ─────────────────────────────────────────── */
function MainContent({
  activeSection, pref, loading, onEdit, onSave, onReset, saving, toast,
}: {
  activeSection: Section;
  pref: Pref;
  loading: boolean;
  onEdit: (row: Row) => void;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  toast: { ok: boolean; text: string } | null;
}) {
  const rows = ROWS[activeSection];

  return (
    <>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0" style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}>
          {sectionIcons[activeSection]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">{activeSection} Preferences</h2>
          <p className="text-xs text-gray-400">{rows.length} preference{rows.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          Loading your preferences…
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {rows.map((row, index) => (
            <div key={row.id}
              className={`flex items-center justify-between px-4 py-3.5 hover:bg-[#fff5f8] transition-colors ${index !== rows.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-[11px] text-gray-400 font-medium mb-0.5">{row.label}</p>
                <p className="font-semibold text-gray-800 text-xs leading-snug">{row.display(pref)}</p>
              </div>
              <button onClick={() => onEdit(row)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0"
                style={{ background: "#fff0f4", color: "#c0174c" }} title={`Edit ${row.label}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <p className={`text-xs font-medium mt-4 ${toast.ok ? "text-green-600" : "text-red-500"}`}>{toast.text}</p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving || loading}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}>
          {saving ? "Saving…" : "Save Preferences"}
        </button>
        <button onClick={onReset} disabled={saving || loading}
          className="px-5 py-3 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95 hover:bg-[#fff5f8] disabled:opacity-60"
          style={{ borderColor: "#c0174c", color: "#c0174c" }}>
          Reset
        </button>
      </div>
    </>
  );
}
