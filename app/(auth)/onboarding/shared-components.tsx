import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
export const days         = Array.from({ length: 31 }, (_, i) => String(i + 1));
export const months       = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const years        = Array.from({ length: 50 }, (_, i) => String(2006 - i));
export const motherTongues = ["Malayalam","Tamil","Telugu","Kannada","Hindi","Bengali","Marathi","Gujarati","Punjabi","Other"];
export const profileCreatedForOptions = ["Self","Son","Daughter","Brother","Sister","Relative","Friend"];
export const genders = ["Male","Female"];
export const heights      = ["4'0\"","4'1\"","4'2\"","4'3\"","4'4\"","4'5\"","4'6\"","4'7\"","4'8\"","4'9\"","4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\""];
export const religions    = ["Hindu","Muslim","Christian","Sikh","Buddhist","Jain","Other"];
export const castesByReligion: Record<string, string[]> = {
  Hindu:   ["Ambalavasi","Brahmin","Ezhava","Nair","Kshatriya","Nadar","Other"],
  Muslim:  ["Sunni","Shia","Other"],
  Christian:["Catholic","Protestant","Orthodox","Other"],
  default: ["Any"],
};
export const maritalOptions   = ["Never married","Widower","Awaiting divorce","Divorced"];
export const physicalOptions  = ["Normal","Physically challenged"];
export const jathakamOptions  = ["Yes","No","Don't know"];
export const educationList    = ["Below 10th","SSLC","Plus Two","Diploma","Bachelor's Degree","Master's Degree","Doctorate","Other"];
export const professionList   = ["Private Sector","Government / PSU","Business / Self Employed","Defence / Civil Services","Not Working","Other"];
export const incomeList       = ["No Income","Less than 1 Lakh","1–2 Lakhs","2–3 Lakhs","3–5 Lakhs","5–7 Lakhs","7–10 Lakhs","10–15 Lakhs","15–20 Lakhs","20+ Lakhs"];

// ─── UI Atoms ─────────────────────────────────────────────────────────────────
export function StyledSelect({ label, value, onChange, options, placeholder }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <div className="relative rounded-xl border-2 transition-all"
      style={{ borderColor: value ? "#c0174c" : "#e5e7eb" }}>
      {label && (
        <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold"
          style={{ color: value ? "#c0174c" : "#9ca3af" }}>{label}</span>
      )}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3.5 text-sm bg-transparent outline-none appearance-none cursor-pointer rounded-xl"
        style={{ color: value ? "#1f2937" : "#9ca3af" }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400">
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export function PillSelect({ options, value, onChange, multi = false }: {
  options: string[]; value: string | string[]; onChange: (v: any) => void; multi?: boolean;
}) {
  const toggle = (opt: string) => {
    if (multi) {
      const arr = (value as string[]) || [];
      onChange(arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt]);
    } else {
      onChange(opt === value ? "" : opt);
    }
  };
  const isActive = (opt: string) =>
    multi ? ((value as string[]) || []).includes(opt) : value === opt;
  return (
    <div className="flex flex-wrap gap-3">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className="px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: isActive(opt) ? "#c0174c" : "#e5e7eb",
            background: isActive(opt) ? "linear-gradient(135deg,#c0174c,#8b0f38)" : "white",
            color: isActive(opt) ? "white" : "#374151",
          }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export function PlainInput({ placeholder, value, onChange, type = "text" }: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className="w-full px-4 py-3.5 rounded-xl border-2 text-sm outline-none transition-all"
      style={{ borderColor: focused ? "#c0174c" : "#e5e7eb", color: "#1f2937" }}
    />
  );
}

export function Checkbox({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={() => onChange(!checked)}
        className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
        style={{ borderColor: checked ? "#c0174c" : "#d1d5db", background: checked ? "#c0174c" : "white" }}>
        {checked && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export function ActionBtn({ onClick, label = "Continue", disabled = false }: {
  onClick: () => void; label?: string; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-4 px-4  rounded-2xl cursor-pointer text-white font-black text-base tracking-wide uppercase transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
      style={{
        background: "linear-gradient(135deg, #c0174c, #8b0f38)",
        // boxShadow: "0 6px 20px rgba(192,23,76,0.35)",
        opacity: disabled ? 0.5 : 1,
      }}>
      {label}
    </button>
  );
}

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className=" h-14.2 w-40 rounded-2xl cursor-pointer font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all">
      ← Back
    </button>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2 sticky top-0 z-20 bg-white">
      <h2 className="text-xl font-black text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function FieldGroup({ label, error, optional, children,isHeight }: {
  label: string; error?: string; optional?: boolean; children: React.ReactNode;isHeight?:string
}) {
  return (
    <div className={isHeight ? isHeight:"min-h-20"}>
      <h3 className="text-sm font-bold text-gray-700 mb-2.5">
        {label}
        {optional && <span className="text-gray-400 font-normal ml-1 text-xs">(Optional)</span>}
      </h3>
      {children}
      {error && <p className="text-xs mt-1.5 text-red-500">{error}</p>}
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="border-t border-dashed border-gray-200 pt-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">{label}</p>
    </div>
  );
}

