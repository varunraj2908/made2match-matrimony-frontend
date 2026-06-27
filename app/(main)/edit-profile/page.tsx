"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SlideModal from "@/components/modals/SlideModal";
import {
  getMyProfileFull,
  updateMyProfile,
  type FullProfile,
  type ProfileUpdatePayload,
} from "@/services/profileService";

// ── Display helpers (DB → readable) ─────────────────────────────────
const NOT_SET = "Not Specified";

const friendly = (v?: string): string => {
  if (!v) return NOT_SET;
  return v
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const fmtHeight = (cm?: number): string => {
  if (!cm) return NOT_SET;
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft} Ft ${inch} In / ${cm} Cms`;
};

const fmtWeight = (kg?: number): string =>
  kg ? `${kg} Kgs / ${Math.round(kg * 2.205)} lbs` : NOT_SET;

const fmtIncome = (annual?: number): string => {
  if (annual == null) return NOT_SET;
  if (annual === 0) return "No income";
  const lakhs = annual / 100000;
  return `Rs. ${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)} Lakhs`;
};

const fullNameOf = (p: FullProfile | null): string =>
  p ? [p.firstName, p.lastName].filter(Boolean).join(" ") || "—" : "—";

const createdForLabel = (v?: string): string =>
  (v || "").toUpperCase() === "SELF" ? "My Self" : friendly(v);

// ─── Icons ────────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const AddIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c0174c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CameraIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const UploadCloudIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const StarBadge = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface UploadedPhoto {
  id: string;
  url: string;
  name: string;
  size: number;
  isPrimary: boolean;
}

const formatSize = (b: number) =>
  b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;

// ─── Edit Mobile Modal ────────────────────────────────────────────────────────
const EditMobileModal = ({
  isOpen, onClose, currentNumber, onSave,
}: {
  isOpen: boolean; onClose: () => void; currentNumber: string; onSave: (num: string) => void;
}) => {
  const [step, setStep]               = useState<"enter" | "otp" | "success">("enter");
  const [newNumber, setNewNumber]     = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const handleSendOtp = () => {
    setError("");
    if (newNumber.replace(/\D/g, "").length < 10) { setError("Please enter a valid 10-digit mobile number."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); startResendTimer(); }, 1000);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.join("").length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); onSave(`${countryCode}-${newNumber.replace(/\D/g, "")}`); }, 1000);
  };

  const handleClose = () => {
    setStep("enter"); setNewNumber(""); setOtp(["","","","","",""]); setError(""); setLoading(false); onClose();
  };

  if (!isOpen) return null;

  return (
    /* Mobile: bottom sheet. Desktop: centered modal */
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden max-h-[92dvh] flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fdf2f5", color: "#c0174c" }}>
              <PhoneIcon />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {step === "enter" ? "Edit Mobile Number" : step === "otp" ? "Verify OTP" : "Number Updated!"}
              </h2>
              <p className="text-xs text-gray-400">
                {step === "enter" ? "Update your registered mobile number" : step === "otp" ? `OTP sent to ${countryCode} ${newNumber}` : "Your mobile number has been saved"}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "enter" && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <PhoneIcon />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Current Number</p>
                  <p className="text-sm font-semibold text-gray-700">{currentNumber}</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  <CheckIcon /> Verified
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">New Mobile Number</label>
                <div className="flex gap-2">
                  <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-white w-20 shrink-0">
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+1-CA">🇨🇦 +1</option>
                  </select>
                  <input type="tel" placeholder="Enter 10-digit number" value={newNumber}
                    onChange={e => setNewNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-all" />
                </div>
              </div>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-blue-700">
                <InfoIcon /><p>An OTP will be sent to your new number for verification. Standard SMS rates may apply.</p>
              </div>
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-2.5 rounded-xl"><InfoIcon /> {error}</div>}
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-white" style={{ backgroundColor: "#c0174c" }}>
                  <ShieldIcon />
                </div>
                <p className="text-sm text-gray-600">OTP sent to <span className="font-bold text-gray-900">{countryCode} {newNumber}</span></p>
                <p className="text-xs text-gray-400 mt-1">Enter the code below to verify your number</p>
              </div>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, idx) => (
                  <input key={idx} ref={el => { otpRefs.current[idx] = el; }} type="text" inputMode="numeric"
                    maxLength={1} value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className="w-10 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold border-2 rounded-xl focus:outline-none transition-all"
                    style={{ borderColor: digit ? "#c0174c" : "#e5e7eb", color: "#c0174c", backgroundColor: digit ? "#fdf2f5" : "#fff" }} />
                ))}
              </div>
              <div className="text-center">
                {resendTimer > 0
                  ? <p className="text-xs text-gray-400">Resend OTP in <span className="font-semibold text-gray-600">{resendTimer}s</span></p>
                  : <button onClick={() => { setOtp(["","","","","",""]); startResendTimer(); }} className="text-xs font-semibold" style={{ color: "#4a90d9" }}>Resend OTP</button>}
              </div>
              <button onClick={() => { setStep("enter"); setOtp(["","","","","",""]); setError(""); }}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto">← Change number</button>
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-2.5 rounded-xl"><InfoIcon /> {error}</div>}
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4 space-y-3">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-green-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">Mobile Number Updated!</h3>
              <p className="text-sm text-gray-500">Your new number <span className="font-semibold text-gray-800">{countryCode} {newNumber}</span> is now verified and saved.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          {step === "success" ? (
            <button onClick={handleClose} className="px-6 py-2 text-sm font-bold text-white rounded-full" style={{ backgroundColor: "#c0174c" }}>Done</button>
          ) : (
            <>
              <button onClick={handleClose} className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-full bg-gray-100">Cancel</button>
              <button onClick={step === "enter" ? handleSendOtp : handleVerify} disabled={loading}
                className="px-5 py-2 text-sm font-bold text-white rounded-full flex items-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: "#c0174c" }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a3a"; }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#c0174c"; }}>
                {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
                {step === "enter" ? (loading ? "Sending OTP…" : "Send OTP") : (loading ? "Verifying…" : "Verify & Save")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Photo Upload Modal ───────────────────────────────────────────────────────
const PhotoUploadModal = ({
  isOpen, onClose, photos, onPhotosChange,
}: {
  isOpen: boolean; onClose: () => void; photos: UploadedPhoto[]; onPhotosChange: (p: UploadedPhoto[]) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const MAX_FILES = 8;
  const MAX_SIZE  = 5 * 1024 * 1024;

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    setError(null);
    const added: UploadedPhoto[] = [];
    const remaining = MAX_FILES - photos.length;
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith("image/")) { setError("Only image files (JPG, PNG, WEBP) are allowed."); return; }
      if (file.size > MAX_SIZE) { setError(`"${file.name}" exceeds the 5 MB size limit.`); return; }
      added.push({ id: `${Date.now()}-${Math.random()}`, url: URL.createObjectURL(file), name: file.name, size: file.size, isPrimary: photos.length === 0 && added.length === 0 });
    });
    if (added.length) onPhotosChange([...photos, ...added]);
  }, [photos, onPhotosChange]);

  const handleDrop     = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); };
  const handleDelete   = (id: string) => { const u = photos.filter(p => p.id !== id); if (u.length && !u.some(p => p.isPrimary)) u[0].isPrimary = true; onPhotosChange(u); };
  const handleSetPrimary = (id: string) => onPhotosChange(photos.map(p => ({ ...p, isPrimary: p.id === id })));

  if (!isOpen) return null;

  return (
    /* Mobile: bottom sheet. Desktop: centered modal */
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl flex flex-col overflow-hidden" style={{ maxHeight: "92dvh" }}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">Add / Edit Photos</h2>
            <p className="text-xs text-gray-400 mt-0.5">Up to {MAX_FILES} photos · Max 5 MB each · JPG, PNG, WEBP</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"><XIcon /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
          <label htmlFor="photo-upload-input"
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-8 px-4 cursor-pointer transition-all select-none ${
              photos.length >= MAX_FILES ? "border-gray-200 bg-gray-50 opacity-50 pointer-events-none" :
              dragging ? "border-[#c0174c] bg-[#fdf2f5]" : "border-gray-300 bg-gray-50 hover:border-[#c0174c] hover:bg-[#fdf2f5]"
            }`}>
            <div className={`transition-colors ${dragging ? "text-[#c0174c]" : "text-gray-300"}`}><UploadCloudIcon /></div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">{dragging ? "Drop your photos here!" : "Tap or drag to upload photos"}</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse files</p>
            </div>
            <span className="inline-flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-full pointer-events-none" style={{ backgroundColor: "#c0174c" }}>
              <CameraIcon /> Browse Photos
            </span>
            <p className="text-[10px] text-gray-300">{MAX_FILES - photos.length} slot{MAX_FILES - photos.length !== 1 ? "s" : ""} remaining</p>
            <input id="photo-upload-input" ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
              onChange={e => processFiles(e.target.files)} />
          </label>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl">
              <InfoIcon /> {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><XIcon /></button>
            </div>
          )}

          {photos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uploaded ({photos.length}/{MAX_FILES})</p>
                <p className="text-[10px] text-gray-400 hidden sm:block">Hover a photo to set primary or delete</p>
              </div>
              {/* 3 cols on mobile, 4 on sm+ */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 transition-all"
                    style={{ borderColor: photo.isPrimary ? "#c0174c" : "#e5e7eb" }}>
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    {photo.isPrimary && (
                      <div className="absolute top-1 left-1 flex items-center gap-0.5 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400">
                        <StarBadge /> Primary
                      </div>
                    )}
                    {/* On mobile: always show actions. On desktop: show on hover */}
                    <div className="absolute inset-0 bg-black/55 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1.5">
                      {!photo.isPrimary && (
                        <button onClick={() => handleSetPrimary(photo.id)}
                          className="w-full flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-900 bg-amber-400 hover:bg-amber-300 px-1.5 py-1 rounded-lg transition-colors">
                          <StarBadge /> Set Primary
                        </button>
                      )}
                      <button onClick={() => handleDelete(photo.id)}
                        className="w-full flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-1.5 py-1 rounded-lg transition-colors">
                        <TrashIcon /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {photos.length < MAX_FILES && (
                  <label htmlFor="photo-upload-input"
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#c0174c] hover:bg-[#fdf2f5] transition-all">
                    <span className="text-2xl text-gray-300 leading-none">+</span>
                    <span className="text-[10px] text-gray-400 mt-1">Add</span>
                  </label>
                )}
              </div>
              <div className="mt-3 space-y-1.5">
                {photos.map(photo => (
                  <div key={photo.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                    <img src={photo.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{photo.name}</p>
                      <p className="text-[10px] text-gray-400">{formatSize(photo.size)}</p>
                    </div>
                    {photo.isPrimary && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">PRIMARY</span>}
                    <button onClick={() => handleDelete(photo.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0"><TrashIcon /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <p className="text-xs text-gray-400">{photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? "s" : ""} ready` : "No photos uploaded yet"}</p>
          <div className="flex gap-2 sm:gap-3">
            <button onClick={onClose} className="px-4 sm:px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-full bg-gray-100">Cancel</button>
            <button onClick={onClose} className="px-5 sm:px-6 py-2 text-sm font-bold text-white rounded-full transition-all shadow-sm"
              style={{ backgroundColor: "#c0174c" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#8b1a3a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#c0174c"; }}>
              Save Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Button ──────────────────────────────────────────────────────────────
const EditBtn = ({ label = "Edit", onClick }: { label?: string; onClick?: () => void }) => (
  <button onClick={onClick}
    className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all shrink-0"
    style={{ backgroundColor: "#4a90d9" }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#357ab8"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#4a90d9"; }}>
    {label === "Add" ? <AddIcon /> : <EditIcon />}
    {label}
  </button>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, editLabel = "Edit", onEdit, children }: {
  title: string; editLabel?: string; onEdit?: () => void; children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 sm:mb-4">
    <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-gray-100 gap-2">
      <h3 className="text-sm sm:text-base font-bold text-gray-800">{title}</h3>
      <EditBtn label={editLabel} onClick={onEdit} />
    </div>
    <div className="px-4 sm:px-5 py-3 sm:py-4">{children}</div>
  </div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) => (
  <div className="flex items-start py-1 sm:py-1.5 gap-1">
    {/* Mobile: w-24, Desktop: w-44 */}
    <span className="text-xs sm:text-sm text-gray-500 w-24 sm:w-44 shrink-0 leading-snug">{label}</span>
    <span className="text-gray-400 mr-1 text-xs sm:text-sm shrink-0">:</span>
    {isLink ? (
      <button className="text-xs sm:text-sm font-medium flex items-center gap-1" style={{ color: "#4a90d9" }}>
        {value} <ChevronRightIcon />
      </button>
    ) : (
      <span className="text-xs sm:text-sm font-medium text-gray-800 leading-snug wrap-break-word min-w-0">{value}</span>
    )}
  </div>
);

// ─── Two-Col Details — 1 col on mobile, 2 cols on sm+ ─────────────────────────
const TwoColDetails = ({ rows }: { rows: { label: string; value: string; isLink?: boolean }[][] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
    {rows.map((col, ci) => (
      <div key={ci}>{col.map(r => <DetailRow key={r.label} {...r} />)}</div>
    ))}
  </div>
);

// ─── Controlled form fields ───────────────────────────────────────────────────
const FIELD_CLS = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all";
const LABEL_CLS = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

const TextField = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div className="mb-4">
    <label className={LABEL_CLS}>{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={FIELD_CLS} />
  </div>
);
const EnumField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) => (
  <div className="mb-4">
    <label className={LABEL_CLS}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD_CLS} bg-white`}>
      <option value="">Select…</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);

// Backend enum option lists (value = enum NAME sent to API).
const OPT = {
  createdFor:   [["SELF","My Self"],["SON","Son"],["DAUGHTER","Daughter"],["BROTHER","Brother"],["SISTER","Sister"],["RELATIVE","Relative"],["FRIEND","Friend"]] as [string,string][],
  motherTongue: [["MALAYALAM","Malayalam"],["TAMIL","Tamil"],["TELUGU","Telugu"],["KANNADA","Kannada"],["HINDI","Hindi"],["BENGALI","Bengali"],["GUJARATI","Gujarati"],["MARATHI","Marathi"],["PUNJABI","Punjabi"],["OTHER","Other"]] as [string,string][],
  marital:      [["NEVER_MARRIED","Never Married"],["DIVORCED","Divorced"],["WIDOWED","Widowed"],["AWAITING_DIVORCE","Awaiting Divorce"]] as [string,string][],
  bodyType:     [["SLIM","Slim"],["ATHLETIC","Athletic"],["AVERAGE","Average"],["HEAVY","Heavy"]] as [string,string][],
  complexion:   [["VERY_FAIR","Very Fair"],["FAIR","Fair"],["WHEATISH","Wheatish"],["DARK","Dark"]] as [string,string][],
  physical:     [["NORMAL","Normal"],["PHYSICALLY_CHALLENGED","Physically Challenged"]] as [string,string][],
  diet:         [["VEGETARIAN","Vegetarian"],["NON_VEGETARIAN","Non Vegetarian"],["EGGETARIAN","Eggetarian"],["VEGAN","Vegan"],["JAIN","Jain"]] as [string,string][],
  smoking:      [["NO","Never smokes"],["OCCASIONALLY","Occasionally"],["YES","Regularly"]] as [string,string][],
  drinking:     [["NO","Never drinks"],["OCCASIONALLY","Occasionally"],["YES","Regularly"]] as [string,string][],
  familyType:   [["NUCLEAR","Nuclear"],["JOINT","Joint"],["EXTENDED","Extended"]] as [string,string][],
  familyStatus: [["MIDDLE_CLASS","Middle Class"],["UPPER_MIDDLE_CLASS","Upper Middle Class"],["RICH","Rich"],["AFFLUENT","Affluent"]] as [string,string][],
  shudha:       [["YES","Yes"],["NO","No"],["DONT_KNOW","Don't Know"]] as [string,string][],
};

type FormProps = { profile: FullProfile | null; onChange: (p: ProfileUpdatePayload) => void };
const num = (s: string): number | undefined => (s.trim() === "" ? undefined : Number(s));
const str = (s: string): string | undefined => (s.trim() === "" ? undefined : s);

const BasicDetailsForm = ({ profile, onChange }: FormProps) => {
  const [v, setV] = useState({
    firstName: profile?.firstName ?? "", lastName: profile?.lastName ?? "",
    profileCreatedBy: profile?.profileCreatedBy ?? "", heightCm: profile?.heightCm != null ? String(profile.heightCm) : "",
    weightKg: profile?.weightKg != null ? String(profile.weightKg) : "", motherTongue: profile?.motherTongue ?? "",
    maritalStatus: profile?.maritalStatus ?? "", bodyType: profile?.bodyType ?? "",
    diet: profile?.diet ?? "", drinking: profile?.drinking ?? "", smoking: profile?.smoking ?? "",
  });
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));
  useEffect(() => {
    onChange({
      firstName: str(v.firstName), lastName: str(v.lastName), profileCreatedBy: str(v.profileCreatedBy),
      heightCm: num(v.heightCm), weightKg: num(v.weightKg), motherTongue: str(v.motherTongue),
      maritalStatus: str(v.maritalStatus), bodyType: str(v.bodyType), diet: str(v.diet),
      drinking: str(v.drinking), smoking: str(v.smoking),
    });
  }, [v, onChange]);
  return (<>
    <EnumField label="Profile Created For" value={v.profileCreatedBy} onChange={(x) => set("profileCreatedBy", x)} options={OPT.createdFor} />
    <TextField label="First Name" value={v.firstName} onChange={(x) => set("firstName", x)} />
    <TextField label="Last Name" value={v.lastName} onChange={(x) => set("lastName", x)} />
    <TextField label="Height (cm)" value={v.heightCm} onChange={(x) => set("heightCm", x)} type="number" />
    <TextField label="Weight (kg)" value={v.weightKg} onChange={(x) => set("weightKg", x)} type="number" />
    <EnumField label="Mother Tongue" value={v.motherTongue} onChange={(x) => set("motherTongue", x)} options={OPT.motherTongue} />
    <EnumField label="Marital Status" value={v.maritalStatus} onChange={(x) => set("maritalStatus", x)} options={OPT.marital} />
    <EnumField label="Body Type" value={v.bodyType} onChange={(x) => set("bodyType", x)} options={OPT.bodyType} />
    <EnumField label="Eating Habits" value={v.diet} onChange={(x) => set("diet", x)} options={OPT.diet} />
    <EnumField label="Drinking Habits" value={v.drinking} onChange={(x) => set("drinking", x)} options={OPT.drinking} />
    <EnumField label="Smoking Habits" value={v.smoking} onChange={(x) => set("smoking", x)} options={OPT.smoking} />
  </>);
};

const ReligionForm = ({ profile, onChange }: FormProps) => {
  const [v, setV] = useState({
    religion: profile?.religion ?? "", caste: profile?.caste ?? "", subcaste: profile?.subcaste ?? "",
    willingToMarryAnyCaste: !!profile?.willingToMarryAnyCaste, shudhajathakam: profile?.shudhajathakam ?? "",
  });
  const set = (k: keyof typeof v, val: string | boolean) => setV((s) => ({ ...s, [k]: val }));
  useEffect(() => {
    onChange({
      religion: str(v.religion), caste: str(v.caste), subcaste: str(v.subcaste),
      willingToMarryAnyCaste: v.willingToMarryAnyCaste, shudhajathakam: str(v.shudhajathakam),
    });
  }, [v, onChange]);
  return (<>
    <TextField label="Religion" value={v.religion} onChange={(x) => set("religion", x)} />
    <TextField label="Caste" value={v.caste} onChange={(x) => set("caste", x)} />
    <TextField label="Sub Caste" value={v.subcaste} onChange={(x) => set("subcaste", x)} />
    <EnumField label="Suddha Jadhagam" value={v.shudhajathakam} onChange={(x) => set("shudhajathakam", x)} options={OPT.shudha} />
    <label className="flex items-center gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
      <input type="checkbox" checked={v.willingToMarryAnyCaste} onChange={(e) => set("willingToMarryAnyCaste", e.target.checked)} className="accent-[#c0174c] w-4 h-4" />
      Willing to marry any caste (Caste No Bar)
    </label>
  </>);
};

const LocationForm = ({ profile, onChange }: FormProps) => {
  const [v, setV] = useState({
    country: profile?.country ?? "", state: profile?.state ?? "", city: profile?.city ?? "", pincode: profile?.pincode ?? "",
  });
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));
  useEffect(() => {
    onChange({ country: str(v.country), state: str(v.state), city: str(v.city), pincode: str(v.pincode) });
  }, [v, onChange]);
  return (<>
    <TextField label="Country" value={v.country} onChange={(x) => set("country", x)} />
    <TextField label="State" value={v.state} onChange={(x) => set("state", x)} />
    <TextField label="City" value={v.city} onChange={(x) => set("city", x)} />
    <TextField label="Pincode" value={v.pincode} onChange={(x) => set("pincode", x)} />
  </>);
};

const ProfessionalForm = ({ profile, onChange }: FormProps) => {
  const [v, setV] = useState({
    highestQualification: profile?.highestQualification ?? "", collegeUniversity: profile?.collegeUniversity ?? "",
    employedIn: profile?.employedIn ?? "", occupation: profile?.occupation ?? "",
    annualIncome: profile?.annualIncome != null ? String(profile.annualIncome) : "",
  });
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));
  useEffect(() => {
    onChange({
      highestQualification: str(v.highestQualification), collegeUniversity: str(v.collegeUniversity),
      employedIn: str(v.employedIn), occupation: str(v.occupation), annualIncome: num(v.annualIncome),
    });
  }, [v, onChange]);
  return (<>
    <TextField label="Education" value={v.highestQualification} onChange={(x) => set("highestQualification", x)} />
    <TextField label="College / Institution" value={v.collegeUniversity} onChange={(x) => set("collegeUniversity", x)} />
    <TextField label="Employed In" value={v.employedIn} onChange={(x) => set("employedIn", x)} />
    <TextField label="Occupation" value={v.occupation} onChange={(x) => set("occupation", x)} />
    <TextField label="Annual Income (₹ per year)" value={v.annualIncome} onChange={(x) => set("annualIncome", x)} type="number" />
  </>);
};

const FamilyForm = ({ profile, onChange }: FormProps) => {
  const [v, setV] = useState({
    familyType: profile?.familyType ?? "", familyStatus: profile?.familyStatus ?? "",
    fatherOccupation: profile?.fatherOccupation ?? "", motherOccupation: profile?.motherOccupation ?? "",
    noOfBrothers: profile?.noOfBrothers != null ? String(profile.noOfBrothers) : "",
    noOfSisters: profile?.noOfSisters != null ? String(profile.noOfSisters) : "",
  });
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));
  useEffect(() => {
    onChange({
      familyType: str(v.familyType), familyStatus: str(v.familyStatus),
      fatherOccupation: str(v.fatherOccupation), motherOccupation: str(v.motherOccupation),
      noOfBrothers: num(v.noOfBrothers), noOfSisters: num(v.noOfSisters),
    });
  }, [v, onChange]);
  return (<>
    <EnumField label="Family Type" value={v.familyType} onChange={(x) => set("familyType", x)} options={OPT.familyType} />
    <EnumField label="Family Status" value={v.familyStatus} onChange={(x) => set("familyStatus", x)} options={OPT.familyStatus} />
    <TextField label="Father's Occupation" value={v.fatherOccupation} onChange={(x) => set("fatherOccupation", x)} />
    <TextField label="Mother's Occupation" value={v.motherOccupation} onChange={(x) => set("motherOccupation", x)} />
    <TextField label="No. of Brothers" value={v.noOfBrothers} onChange={(x) => set("noOfBrothers", x)} type="number" />
    <TextField label="No. of Sisters" value={v.noOfSisters} onChange={(x) => set("noOfSisters", x)} type="number" />
  </>);
};

const AboutMyselfForm = ({ profile, onChange }: FormProps) => {
  const [bio, setBio] = useState(profile?.bio ?? "");
  useEffect(() => { onChange({ bio: str(bio) }); }, [bio, onChange]);
  return (
    <div className="mb-4">
      <label className={LABEL_CLS}>About Yourself</label>
      <textarea rows={6} value={bio} onChange={(e) => setBio(e.target.value)} className={`${FIELD_CLS} resize-none`} />
    </div>
  );
};

// Hobbies are managed via a separate interests endpoint — informational only here.
const HobbiesForm = () => (
  <p className="text-sm text-gray-500">
    Hobbies &amp; interests are managed from the onboarding “Interests” step. Coming soon to this editor.
  </p>
);

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function MyProfilePage() {
  const router   = useRouter();
  const params   = useParams();
  const profileId = params?.id ?? "profile-preview";

  const [photos, setPhotos]                   = useState<UploadedPhoto[]>([]);
  const [showPhotoModal, setShowPhotoModal]   = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [imgFallback, setImgFallback]         = useState(false);
  const [showAcademicInput, setShowAcademicInput] = useState(true);
  const [academicInput, setAcademicInput]     = useState("");
  const [openModal, setOpenModal]             = useState<string | null>(null);
  const [mobileNumber, setMobileNumber]       = useState("+91-8075067058");
  const [profile, setProfile]                 = useState<FullProfile | null>(null);
  const [saving, setSaving]                   = useState(false);
  const [toast, setToast]                     = useState("");
  const draftRef = useRef<ProfileUpdatePayload>({});
  const setDraft = useCallback((p: ProfileUpdatePayload) => { draftRef.current = p; }, []);

  // Load the logged-in user's real profile from the database.
  useEffect(() => {
    getMyProfileFull()
      .then(setProfile)
      .catch(() => undefined);
  }, []);

  const open  = (key: string) => { draftRef.current = {}; setOpenModal(key); };
  const close = () => setOpenModal(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 2500);
  };

  // Persist the currently-open form's draft to the backend (PUT /profiles/me).
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(draftRef.current);
      setProfile(updated);
      showToast("Profile updated successfully");
      close();
    } catch (e: any) {
      showToast(e?.response?.data?.message || e?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const primaryPhoto  = photos.find(p => p.isPrimary);
  const displayPhoto  = primaryPhoto?.url ?? profile?.profilePhotoUrl ?? "https://i.pravatar.cc/300?img=33";
  const displayMobile = mobileNumber.startsWith("+91-") ? `+91-${mobileNumber.slice(4)}` : mobileNumber;

  // ── Real profile display values ──
  const displayName   = fullNameOf(profile);
  const createdFor    = createdForLabel(profile?.profileCreatedBy);
  const ageStr        = profile?.age != null ? `${profile.age} Years` : NOT_SET;
  const heightStr     = fmtHeight(profile?.heightCm);
  const religionStr   = friendly(profile?.religion);
  const casteStr      = profile?.caste
    ? `${profile.caste}${profile.willingToMarryAnyCaste ? " (Caste No Bar)" : ""}`
    : NOT_SET;
  const cityState     = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(", ") || NOT_SET;
  const educationStr  = friendly(profile?.highestQualification);
  const occupationStr = friendly(profile?.occupation);
  const isGroom       = (profile?.gender || "").toUpperCase().startsWith("M");
  const heroSummaryLine = profile?.age != null || profile?.heightCm
    ? `${profile?.age != null ? `${profile.age} Yrs` : ""}${profile?.heightCm ? `, ${fmtHeight(profile.heightCm)}` : ""}`
    : NOT_SET;

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 px-3 sm:px-4">
      {/* Save / error toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[10000] bg-[#c0174c] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">

        {/* ── Back nav ── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#c0174c] transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        {/* ── Hero / Profile Header ── */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5">

          {/* Mobile: photo + name row at top, then info below. Desktop: 3-col row unchanged */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-5">

            {/* ── Mobile top row: photo left, name+preview right ── */}
            <div className="flex items-start gap-3 sm:hidden mb-3">
              {/* Photo */}
              <div className="shrink-0">
                <div className="relative w-24 h-28 rounded-lg overflow-hidden border-2 mb-2 group cursor-pointer"
                  style={{ borderColor: "#e0e0e0" }} onClick={() => setShowPhotoModal(true)}>
                  {!imgFallback ? (
                    <img src={displayPhoto} alt={displayName} className="w-full h-full object-cover object-top" onError={() => setImgFallback(true)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-linear-to-br from-gray-100 to-gray-200">🤵</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <div className="text-white"><CameraIcon /></div>
                    <p className="text-white text-[10px] font-semibold">Change</p>
                  </div>
                  {photos.length > 0 && (
                    <div className="absolute bottom-1 right-1 text-white text-[9px] font-bold px-1 py-0.5 rounded-full" style={{ backgroundColor: "#c0174c" }}>
                      {photos.length} 📷
                    </div>
                  )}
                </div>
                <button onClick={() => setShowPhotoModal(true)}
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded w-full justify-center transition-all bg-white"
                  style={{ color: "#4a90d9", border: "1px solid #4a90d9" }}>
                  <CameraIcon />
                  {photos.length > 0 ? `Edit (${photos.length})` : "Add Photo"}
                </button>
              </div>

              {/* Name + quick info + preview button */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">{displayName}</h1>
                  <button onClick={() => router.push(`/edit-profile/${profileId}`)}
                    className="flex items-center gap-1 border-2 text-xs font-semibold px-2.5 py-1.5 rounded shrink-0 transition-all"
                    style={{ borderColor: "#c0174c", color: "#c0174c" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#c0174c"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#c0174c"; }}>
                    <EyeIcon /> Preview
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">Profile created for {createdFor}</p>
                <div className="space-y-0.5 text-xs text-gray-700">
                  <p>{heroSummaryLine}</p>
                  <p>{religionStr}{casteStr !== NOT_SET ? `, ${casteStr}` : ""}</p>
                  <p>{cityState}</p>
                  <p className="text-[11px] text-gray-500">{educationStr}{occupationStr !== NOT_SET ? `, ${occupationStr}` : ""}</p>
                </div>
                {/* Mobile number row */}
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-2">
                  <PhoneIcon />
                  <span className="font-medium text-gray-800 text-xs">{displayMobile}</span>
                  <span className="flex items-center gap-0.5 text-green-600 font-semibold text-[10px]">
                    <CheckIcon /> Verified
                  </span>
                  <button onClick={() => setShowMobileModal(true)}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-all"
                    style={{ color: "#4a90d9", borderColor: "#4a90d9" }}>
                    <span className="flex items-center gap-0.5"><EditIcon /> Edit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Desktop layout (unchanged, hidden on mobile) ── */}
            {/* Photo */}
            <div className="shrink-0 text-center hidden sm:block">
              <div className="relative w-36 h-40 rounded-lg overflow-hidden border-2 mb-2.5 group cursor-pointer"
                style={{ borderColor: "#e0e0e0" }} onClick={() => setShowPhotoModal(true)}>
                {!imgFallback ? (
                  <img src={displayPhoto} alt={displayName} className="w-full h-full object-cover object-top" onError={() => setImgFallback(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-linear-to-br from-gray-100 to-gray-200">🤵</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <div className="text-white"><CameraIcon /></div>
                  <p className="text-white text-[10px] font-semibold">Change Photo</p>
                </div>
                {photos.length > 0 && (
                  <div className="absolute bottom-1.5 right-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#c0174c" }}>
                    {photos.length} 📷
                  </div>
                )}
              </div>
              <button onClick={() => setShowPhotoModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded w-full justify-center transition-all bg-white"
                style={{ color: "#4a90d9", border: "1px solid #4a90d9" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#4a90d9"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#fff"; (e.currentTarget as HTMLElement).style.color = "#4a90d9"; }}>
                <CameraIcon />
                {photos.length > 0 ? `Edit Photos (${photos.length})` : "Add/Edit Photos"}
              </button>
            </div>

            {/* Desktop Info */}
            <div className="flex-1 min-w-0 hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{displayName}</h1>
              <p className="text-sm text-gray-500 mb-3">Profile created for {createdFor}</p>
              <div className="space-y-1.5 text-sm text-gray-700 mb-4">
                <p>{heroSummaryLine}</p>
                <p>{religionStr}{casteStr !== NOT_SET ? `, ${casteStr}` : ""}</p>
                <p>{cityState}</p>
                <p>{educationStr}{occupationStr !== NOT_SET ? `, ${occupationStr}` : ""}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <PhoneIcon />
                  <span className="font-medium text-gray-800">{displayMobile}</span>
                  <span className="text-gray-400">(</span>
                  <span className="flex items-center gap-1 text-green-600 font-semibold text-xs"><CheckIcon /> Verified</span>
                  <span className="text-gray-400">)</span>
                  <button onClick={() => setShowMobileModal(true)}
                    className="text-xs font-semibold ml-1 px-2 py-0.5 rounded border transition-all"
                    style={{ color: "#4a90d9", borderColor: "#4a90d9" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#4a90d9"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#4a90d9"; }}>
                    <span className="flex items-center gap-1"><EditIcon /> Edit Mobile No</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Profile Preview */}
            <div className="shrink-0 text-center hidden sm:block">
              <p className="text-xs text-gray-500 mb-2 leading-snug text-center">How your profile looks<br />to others</p>
              <button onClick={() => router.push(`/edit-profile/${profileId}`)}
                className="flex items-center gap-2 border-2 text-sm font-semibold px-4 py-2 rounded transition-all"
                style={{ borderColor: "#c0174c", color: "#c0174c" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#c0174c"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#fff"; (e.currentTarget as HTMLElement).style.color = "#c0174c"; }}>
                <EyeIcon /> Profile Preview
              </button>
            </div>
          </div>
        </div>

        {/* ── Academic Details Banner ── */}
        {showAcademicInput && (
          <div className="rounded-lg p-4 sm:p-5" style={{ backgroundColor: "#c0174c" }}>
            <p className="text-white font-semibold text-sm sm:text-base mb-3">Share your academic details for better match search.</p>
            <input type="text" placeholder="Enter Here" value={academicInput} onChange={e => setAcademicInput(e.target.value)}
              className="w-full sm:w-72 px-3 py-2 rounded text-sm border-0 focus:outline-none mb-3 block"
              style={{ backgroundColor: "rgba(255,255,255,0.95)" }} />
            <div className="flex gap-3">
              <button onClick={() => setShowAcademicInput(false)} className="text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-white/10 transition-colors">Skip</button>
              <button className="text-white text-sm font-bold px-5 py-1.5 rounded transition-all" style={{ backgroundColor: "#e67e22" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#ca6f1e"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e67e22"; }}>Submit</button>
            </div>
          </div>
        )}

        <h2 className="text-lg sm:text-xl font-bold pt-1 sm:pt-2" style={{ color: "#c0174c" }}>Personal Information</h2>

        <SectionCard title="In my own words" onEdit={() => open("about")}>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{profile?.bio || NOT_SET}</p>
        </SectionCard>

        <SectionCard title="Basic Details" onEdit={() => open("basic")}>
          <TwoColDetails rows={[
            [
              { label: "Profile created for", value: createdFor },
              { label: "Body Type",           value: friendly(profile?.bodyType) },
              { label: "Physical Status",     value: friendly(profile?.physicalStatus) },
              { label: "Weight",              value: fmtWeight(profile?.weightKg) },
              { label: "Marital Status",      value: friendly(profile?.maritalStatus) },
              { label: "Drinking Habits",     value: friendly(profile?.drinking) },
            ],
            [
              { label: "Name",           value: displayName },
              { label: "Age",            value: ageStr },
              { label: "Height",         value: heightStr },
              { label: "Mother Tongue",  value: friendly(profile?.motherTongue) },
              { label: "Eating Habits",  value: friendly(profile?.diet) },
              { label: "Smoking Habits", value: friendly(profile?.smoking) },
            ],
          ]} />
        </SectionCard>

        <SectionCard title="Religion Information" onEdit={() => open("religion")}>
          {/* 1 col on mobile, 2 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <DetailRow label="Religion"          value={religionStr} />
              <DetailRow label="Caste / Sub Caste" value={[casteStr !== NOT_SET ? casteStr : "", friendly(profile?.subcaste) !== NOT_SET ? friendly(profile?.subcaste) : ""].filter(Boolean).join(" - ") || NOT_SET} />
              <DetailRow label="Gothram"           value={NOT_SET} />
              <DetailRow label="Star / Raasi"      value={NOT_SET} />
              <DetailRow label="Suddha Jadhagam"   value={friendly(profile?.shudhajathakam)} />
            </div>
            <div>
              <DetailRow label="Time of Birth"  value="Add Time"  isLink />
              <DetailRow label="Place of Birth" value="Add place" isLink />
            </div>
          </div>
        </SectionCard>

        <SectionCard title={`${isGroom ? "Groom" : "Bride"}'s Location`} onEdit={() => open("location")}>
          <TwoColDetails rows={[
            [
              { label: "Country",          value: profile?.country || NOT_SET },
              { label: "State",            value: profile?.state || NOT_SET },
              { label: "Pincode",          value: profile?.pincode || NOT_SET },
            ],
            [
              { label: "City",        value: profile?.city || NOT_SET },
              { label: "Citizenship", value: profile?.country || NOT_SET },
            ],
          ]} />
        </SectionCard>

        <SectionCard title="Professional Information" onEdit={() => open("professional")}>
          <DetailRow label="Education"             value={educationStr} />
          <DetailRow label="College / Institution" value={profile?.collegeUniversity || NOT_SET} />
          <DetailRow label="Employed in"           value={friendly(profile?.employedIn)} />
          <DetailRow label="Occupation"            value={occupationStr} />
          <DetailRow label="Annual Income"         value={fmtIncome(profile?.annualIncome)} />
        </SectionCard>

        <SectionCard title="Family Details" onEdit={() => open("family")}>
          <TwoColDetails rows={[
            [
              { label: "Family Type",     value: friendly(profile?.familyType) },
              { label: "Family Status",   value: friendly(profile?.familyStatus) },
              { label: "No of Sister(s)", value: profile?.noOfSisters != null ? String(profile.noOfSisters) : NOT_SET },
            ],
            [
              { label: "Father's Occupation", value: friendly(profile?.fatherOccupation) },
              { label: "Mother's Occupation", value: friendly(profile?.motherOccupation) },
              { label: "No of Brother(s)",    value: profile?.noOfBrothers != null ? String(profile.noOfBrothers) : NOT_SET },
            ],
          ]} />
        </SectionCard>

        <SectionCard title="About My Family" editLabel="Add" onEdit={() => showToast("About My Family editing is coming soon.")}>
          <p className="text-xs sm:text-sm text-gray-400 italic">Not Specified</p>
        </SectionCard>

        <SectionCard title="Hobbies and Interests" onEdit={() => open("hobbies")}>
          <DetailRow label="Hobbies & Interests"  value="Acting, Adventure sports" />
          <DetailRow label="Music"                value="Classical, Devotional" />
          <DetailRow label="Movies and TV Shows"  value="Action, Anime, Classics, Comedy" />
          <DetailRow label="Sports and Fitness"   value="American Football, Bowling" />
          <DetailRow label="Food"                 value="Arabic" />
          <DetailRow label="Spoken Languages"     value="English, Malayalam" />
        </SectionCard>

        {/* ── Partner Preferences ── */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-700 font-medium">Edit your partner preferences to get relevant matches.</p>
          <button className="text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-sm sm:shrink-0 w-full sm:w-auto text-center"
            style={{ backgroundColor: "#e67e22" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#ca6f1e"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e67e22"; }}>
            Edit Preferences
          </button>
        </div>

      </div>

      <PhotoUploadModal isOpen={showPhotoModal} onClose={() => setShowPhotoModal(false)} photos={photos} onPhotosChange={setPhotos} />

      <EditMobileModal isOpen={showMobileModal} onClose={() => setShowMobileModal(false)} currentNumber={displayMobile}
        onSave={num => { setMobileNumber(num); setShowMobileModal(false); }} />

      <SlideModal isOpen={openModal === "about"}        onClose={close} onSave={handleSave} saving={saving} title="Edit — In My Own Words">
        {openModal === "about" && <AboutMyselfForm profile={profile} onChange={setDraft} />}
      </SlideModal>
      <SlideModal isOpen={openModal === "basic"}        onClose={close} onSave={handleSave} saving={saving} title="Edit — Basic Details">
        {openModal === "basic" && <BasicDetailsForm profile={profile} onChange={setDraft} />}
      </SlideModal>
      <SlideModal isOpen={openModal === "religion"}     onClose={close} onSave={handleSave} saving={saving} title="Edit — Religion Information">
        {openModal === "religion" && <ReligionForm profile={profile} onChange={setDraft} />}
      </SlideModal>
      <SlideModal isOpen={openModal === "location"}     onClose={close} onSave={handleSave} saving={saving} title="Edit — Location">
        {openModal === "location" && <LocationForm profile={profile} onChange={setDraft} />}
      </SlideModal>
      <SlideModal isOpen={openModal === "professional"} onClose={close} onSave={handleSave} saving={saving} title="Edit — Professional Information">
        {openModal === "professional" && <ProfessionalForm profile={profile} onChange={setDraft} />}
      </SlideModal>
      <SlideModal isOpen={openModal === "family"}       onClose={close} onSave={handleSave} saving={saving} title="Edit — Family Details">
        {openModal === "family" && <FamilyForm profile={profile} onChange={setDraft} />}
      </SlideModal>
      <SlideModal isOpen={openModal === "hobbies"}      onClose={close} title="Edit — Hobbies & Interests" width="max-w-lg">
        {openModal === "hobbies" && <HobbiesForm />}
      </SlideModal>
    </div>
  );
}
