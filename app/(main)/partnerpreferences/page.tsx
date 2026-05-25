"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
const sections = ["Basic", "Religious", "Professional", "Location", "About My Partner"] as const;
type Section = typeof sections[number];

interface PreferenceItem {
  label: string;
  value: string;
}
interface EditFieldType extends PreferenceItem {}
const preferenceData: Record<Section, PreferenceItem[]> = {
  Basic: [
    { label: "Bride's Age",     value: "20 - 33 years" },
    { label: "Height",          value: "4 Ft 6 In - 5 Ft 6 In / 137 Cms - 168 Cms" },
    { label: "Marital Status",  value: "Never Married" },
    { label: "Mother Tongue",   value: "Any" },
    { label: "Physical Status", value: "Normal" },
    { label: "Eating Habits",   value: "Non Vegetarian, Eggetarian" },
    { label: "Drinking Habits", value: "Does not drink" },
    { label: "Smoking Habits",  value: "Does not smoke" },
  ],
  Religious: [
    { label: "Religion", value: "Hindu" },
    { label: "Caste",    value: "Any" },
    { label: "Sub Caste",value: "Any" },
    { label: "Star",     value: "Any" },
    { label: "Raasi",    value: "Any" },
    { label: "Gothram",  value: "Any" },
  ],
  Professional: [
    { label: "Education",     value: "Any Graduate" },
    { label: "Employed In",   value: "Any" },
    { label: "Occupation",    value: "Any" },
    { label: "Annual Income", value: "No Preference" },
  ],
  Location: [
    { label: "Country",          value: "India" },
    { label: "State",            value: "Kerala" },
    { label: "City / District",  value: "Any" },
    { label: "Residency Status", value: "Any" },
  ],
  "About My Partner": [
    { label: "About My Partner", value: "Looking for a kind and caring partner who values family traditions." },
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

/* ── Edit Modal ─────────────────────────────────────────────────── */
function EditModal({
  field,
  onClose,
  onSave,
}: {
  field: EditFieldType;
  onClose: () => void;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(field.value);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}>
          <h3 className="text-white font-semibold text-base tracking-wide">Edit {field.label}</h3>
        </div>
        <div className="p-5">
          <label className="block text-xs font-medium text-gray-500 mb-2">{field.label}</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c0174c] focus:border-transparent text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="px-5 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(value)}
            className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PartnerPreferences() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("Basic");
  const [data, setData] = useState(preferenceData);
  const [editField, setEditField] = useState<EditFieldType | null>(null);
  const handleSave = (newValue: string) => {
    setData((prev) => ({
      ...prev,
      [activeSection]: prev[activeSection].map((f) =>
        f.label === editField!.label ? { ...f, value: newValue } : f
      ),
    }));
    setEditField(null);
  };

  return (
    <div className=" bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <header className="text-white shadow-lg" style={{ background: "linear-gradient(135deg, #c0174c 0%, #a01040 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-wide">MatriMatch</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-xs px-3 py-1.5 border border-white/60 rounded-full font-bold hover:bg-white hover:text-[#c0174c] transition-colors"
              onClick={() => router.push("/specialoffer")}
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* ── Mobile section tabs (horizontal scroll under header) ── */}
        <div className="md:hidden border-t border-white/10 overflow-x-auto flex" style={{ scrollbarWidth: "none" }}>
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeSection === section
                  ? "bg-white/20 border-b-2 border-white text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span className="opacity-80">{sectionIcons[section]}</span>
              {section}
            </button>
          ))}
        </div>
      </header>

      {/* ── Desktop layout ── */}
      <div className="max-w-6xl mx-auto my-8 px-4 hidden md:flex gap-4 min-h-[calc(100vh-80px)]">

        {/* Sidebar */}
        <aside
          className="w-64 shrink-0 text-white flex flex-col rounded-xl overflow-hidden"
          style={{ background: "linear-gradient(180deg, #c0174c 0%, #8b0f38 100%)" }}
        >
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
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-200 group ${
                  activeSection === section
                    ? "bg-white/20 font-semibold border-r-4 border-white"
                    : "hover:bg-white/10 font-medium text-white/80"
                }`}
              >
                <span className={`transition-colors ${activeSection === section ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
                  {sectionIcons[section]}
                </span>
                <span className="text-sm tracking-wide">{section}</span>
                {activeSection === section && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 ml-auto">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </button>
            ))}
          </nav>
          <div className="px-5 py-5 border-t border-white/10">
            <p className="text-xs text-white/60 mb-2 uppercase tracking-wider">Profile Completion</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mb-1">
              <div className="bg-white rounded-full h-1.5" style={{ width: "75%" }} />
            </div>
            <p className="text-xs text-white/70 mt-1">75% complete</p>
          </div>
        </aside>

        {/* Desktop Main */}
        <main className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <MainContent
            activeSection={activeSection}
            data={data}
            onEdit={setEditField}
          />
        </main>
      </div>

      {/* ── Mobile layout ── */}
      <div className="md:hidden px-3 py-4">
        <main className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <MainContent
            activeSection={activeSection}
            data={data}
            onEdit={setEditField}
          />
        </main>
      </div>

      {/* Edit Modal */}
      {editField && (
        <EditModal field={editField} onClose={() => setEditField(null)} onSave={handleSave} />
      )}
    </div>
  );
}

/* ── Shared Main Content ─────────────────────────────────────────── */
function MainContent({
  activeSection,
  data,
  onEdit,
}: {
  activeSection: Section;
  data: Record<Section, PreferenceItem[]>;
  onEdit: (item: PreferenceItem) => void;
}) {
  return (
    <>
      {/* Info Banner */}
      <div className="rounded-xl p-4 mb-6 border" style={{ background: "#fff5f8", borderColor: "#f9c8d6" }}>
        <div className="flex gap-3 items-start">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#fde8ef" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2" className="w-3.5 h-3.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-sm mb-0.5">Partner Preferences</h2>
            <p className="text-gray-600 text-xs leading-relaxed">
              Matches are based on{" "}
              <span className="font-semibold" style={{ color: "#c0174c" }}>Acceptable matches</span>{" "}
              and may slightly exceed your preferences.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Turn on <span className="font-medium">"Compulsory"</span> for exact matches.
            </p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0" style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}>
          {sectionIcons[activeSection]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">{activeSection} Preferences</h2>
          <p className="text-xs text-gray-400">{data[activeSection]?.length} preferences set</p>
        </div>
      </div>

      {/* Preferences List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {data[activeSection]?.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-4 py-3.5 hover:bg-[#fff5f8] transition-colors ${
              index !== data[activeSection].length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-[11px] text-gray-400 font-medium mb-0.5">{item.label}</p>
              <p className="font-semibold text-gray-800 text-xs leading-snug">{item.value}</p>
            </div>
            <button
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0"
              style={{ background: "#fff0f4", color: "#c0174c" }}
              title={`Edit ${item.label}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
          style={{ background: "linear-gradient(135deg, #c0174c, #e8305e)" }}
        >
          Save Preferences
        </button>
        <button
          className="px-5 py-3 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95 hover:bg-[#fff5f8]"
          style={{ borderColor: "#c0174c", color: "#c0174c" }}
        >
          Reset
        </button>
      </div>
    </>
  );
}