"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import SlideModal from "@/components/modals/SlideModal";

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

// ─── Modal Form Components ────────────────────────────────────────────────────
const FieldRow = ({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
    <input type={type} defaultValue={defaultValue} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all" />
  </div>
);
const SelectRow = ({ label, defaultValue, options }: { label: string; defaultValue?: string; options: string[] }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
    <select defaultValue={defaultValue} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all bg-white">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const BasicDetailsForm    = () => (<><SelectRow label="Profile Created For" defaultValue="My Self" options={["My Self","Son","Daughter","Brother","Sister","Friend"]} /><FieldRow label="Name" defaultValue="Varun" /><FieldRow label="Age" defaultValue="33" type="number" /><SelectRow label="Height" defaultValue="5 Ft 6 In / 168 Cms" options={["5 Ft 0 In","5 Ft 2 In","5 Ft 4 In","5 Ft 6 In / 168 Cms","5 Ft 8 In","6 Ft 0 In"]} /><SelectRow label="Mother Tongue" defaultValue="Malayalam" options={["Malayalam","Tamil","Hindi","Telugu","Kannada"]} /><SelectRow label="Marital Status" defaultValue="Never Married" options={["Never Married","Divorced","Widowed","Awaiting Divorce"]} /><SelectRow label="Body Type" defaultValue="Average" options={["Slim","Average","Athletic","Heavy"]} /><SelectRow label="Eating Habits" defaultValue="Non Vegetarian" options={["Vegetarian","Non Vegetarian","Vegan","Eggetarian"]} /><SelectRow label="Drinking Habits" defaultValue="Never drinks" options={["Never drinks","Occasionally","Regularly"]} /><SelectRow label="Smoking Habits" defaultValue="Never smokes" options={["Never smokes","Occasionally","Regularly"]} /><FieldRow label="Weight (Kgs)" defaultValue="75" type="number" /></>);
const ReligionForm        = () => (<><SelectRow label="Religion" defaultValue="Hindu" options={["Hindu","Muslim","Christian","Sikh","Jain","Buddhist"]} /><FieldRow label="Caste / Sub Caste" defaultValue="Ezhava" /><FieldRow label="Gothram" defaultValue="" /><SelectRow label="Star / Raasi" defaultValue="Aswathi" options={["Aswathi","Bharani","Karthika","Rohini","Makayiram","Thiruvathira"]} /><FieldRow label="Time of Birth" type="time" /><FieldRow label="Place of Birth" defaultValue="" /><SelectRow label="Suddha Jadhagam" defaultValue="Not Specified" options={["Not Specified","Yes","No"]} /></>);
const LocationForm        = () => (<><SelectRow label="Country" defaultValue="India" options={["India","USA","UK","Canada","Australia","UAE"]} /><SelectRow label="State" defaultValue="Kerala" options={["Kerala","Tamil Nadu","Karnataka","Maharashtra","Delhi"]} /><FieldRow label="City" defaultValue="Kalamassery" /><FieldRow label="Ancestral Origin" defaultValue="Palakkad" /><SelectRow label="Citizenship" defaultValue="India" options={["India","USA","UK","Canada","Australia"]} /></>);
const ProfessionalForm    = () => (<><SelectRow label="Education" defaultValue="B.Tech - Bachelor of Technology" options={["B.Tech - Bachelor of Technology","M.Tech","MBA","MBBS","B.Sc","M.Sc","PhD"]} /><FieldRow label="Education in Detail" defaultValue="" /><FieldRow label="College / Institution" defaultValue="Mannarkkad universal college" /><SelectRow label="Employed In" defaultValue="Private Sector" options={["Private Sector","Government","Business","Defence","Not Working"]} /><SelectRow label="Occupation" defaultValue="Software Professional" options={["Software Professional","Doctor","Engineer","Teacher","Lawyer","Accountant"]} /><FieldRow label="Occupation in Detail" defaultValue="" /><FieldRow label="Organization" defaultValue="Mykare Health Private limited" /><SelectRow label="Annual Income" defaultValue="Rs. 7 - 8 Lakhs" options={["Rs. 2 - 3 Lakhs","Rs. 4 - 5 Lakhs","Rs. 5 - 7 Lakhs","Rs. 7 - 8 Lakhs","Rs. 10 - 15 Lakhs","Rs. 15+ Lakhs"]} /></>);
const FamilyForm          = () => (<><SelectRow label="Family Values" defaultValue="Moderate" options={["Orthodox","Traditional","Moderate","Liberal"]} /><SelectRow label="Family Type" defaultValue="Nuclear" options={["Nuclear","Joint"]} /><SelectRow label="Family Status" defaultValue="Middle class" options={["Lower Middle Class","Middle class","Upper Middle Class","Rich","Affluent"]} /><SelectRow label="Father's Occupation" defaultValue="Employed" options={["Employed","Business","Retired","Passed Away","Not Employed"]} /><SelectRow label="Mother's Occupation" defaultValue="Homemaker" options={["Homemaker","Employed","Business","Retired","Passed Away"]} /><FieldRow label="No. of Brothers" defaultValue="1" type="number" /><FieldRow label="No. of Sisters" defaultValue="1" type="number" /><FieldRow label="Family Location" defaultValue="" /></>);
const HobbiesForm         = () => (<><div className="mb-4"><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Hobbies & Interests</label><div className="flex flex-wrap gap-2">{["Acting","Adventure sports","Gardening","Cooking","Reading","Travelling","Painting","Dancing"].map(h => (<button key={h} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${["Acting","Adventure sports"].includes(h) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>{h}</button>))}</div></div><div className="mb-4"><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Music</label><div className="flex flex-wrap gap-2">{["Classical","Devotional","Pop","Rock","Jazz","Folk"].map(m => (<button key={m} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${["Classical","Devotional"].includes(m) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>{m}</button>))}</div></div><div className="mb-4"><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Spoken Languages</label><div className="flex flex-wrap gap-2">{["English","Malayalam","Hindi","Tamil","Kannada"].map(l => (<button key={l} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${["English","Malayalam"].includes(l) ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>{l}</button>))}</div></div><FieldRow label="Sports & Fitness" defaultValue="American Football, Bowling" /><FieldRow label="Favourite Food" defaultValue="Arabic" /></>);
const AboutMyselfForm     = () => (<div className="mb-4"><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">About Yourself</label><textarea rows={6} defaultValue="I have a bachelor's degree and I am employed in the private sector as a software professional currently based in Palakkad. I belong to a middle-class, nuclear family with moderate values." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all resize-none" /></div>);

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

  const open  = (key: string) => setOpenModal(key);
  const close = () => setOpenModal(null);

  const primaryPhoto  = photos.find(p => p.isPrimary);
  const displayPhoto  = primaryPhoto?.url ?? "https://i.pravatar.cc/300?img=33";
  const displayMobile = mobileNumber.startsWith("+91-") ? `+91-${mobileNumber.slice(4)}` : mobileNumber;

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 px-3 sm:px-4">
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
                    <img src={displayPhoto} alt="Varun" className="w-full h-full object-cover object-top" onError={() => setImgFallback(true)} />
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
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">Varun</h1>
                  <button onClick={() => router.push(`/edit-profile/${profileId}`)}
                    className="flex items-center gap-1 border-2 text-xs font-semibold px-2.5 py-1.5 rounded shrink-0 transition-all"
                    style={{ borderColor: "#c0174c", color: "#c0174c" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#c0174c"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#c0174c"; }}>
                    <EyeIcon /> Preview
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">Profile created for My Self</p>
                <div className="space-y-0.5 text-xs text-gray-700">
                  <p>33 Yrs, 5 Ft 6 In / 168 Cms</p>
                  <p>Hindu, Ezhava (Caste No Bar)</p>
                  <p>Kalamassery, Kerala, India</p>
                  <p className="text-[11px] text-gray-500">B.Tech, Software Professional</p>
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
                  <img src={displayPhoto} alt="Varun" className="w-full h-full object-cover object-top" onError={() => setImgFallback(true)} />
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
              <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Varun</h1>
              <p className="text-sm text-gray-500 mb-3">Profile created for My Self</p>
              <div className="space-y-1.5 text-sm text-gray-700 mb-4">
                <p>33 Yrs, 5 Ft 6 In / 168 Cms</p>
                <p>Hindu, Ezhava (Caste No Bar)</p>
                <p>Kalamassery, Kerala, India</p>
                <p>B.Tech - Bachelor of Technology, Software Professional</p>
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
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">I have a bachelor's degree and I am employed in the private sector as a software professional currently based in Palakkad. I belong to a middle-class, nuclear family with moderate values.</p>
        </SectionCard>

        <SectionCard title="Basic Details" onEdit={() => open("basic")}>
          <TwoColDetails rows={[
            [
              { label: "Profile created for", value: "My Self" },
              { label: "Body Type",           value: "Average" },
              { label: "Physical Status",     value: "Normal" },
              { label: "Weight",              value: "75 Kgs / 165 lbs" },
              { label: "Marital Status",      value: "Never Married" },
              { label: "Drinking Habits",     value: "Never drinks" },
            ],
            [
              { label: "Name",           value: "Varun" },
              { label: "Age",            value: "33 Years" },
              { label: "Height",         value: "5 Ft 6 In / 168 Cms" },
              { label: "Mother Tongue",  value: "Malayalam" },
              { label: "Eating Habits",  value: "Non Vegetarian" },
              { label: "Smoking Habits", value: "Never smokes" },
            ],
          ]} />
        </SectionCard>

        <SectionCard title="Religion Information" onEdit={() => open("religion")}>
          {/* 1 col on mobile, 2 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <DetailRow label="Religion"          value="Hindu" />
              <DetailRow label="Caste / Sub Caste" value="Ezhava (Caste No Bar) - Ezhava" />
              <DetailRow label="Gothram"           value="-" />
              <DetailRow label="Star / Raasi"      value="Aswathi" />
              <DetailRow label="Suddha Jadhagam"   value="Not Specified" />
            </div>
            <div>
              <DetailRow label="Time of Birth"  value="Add Time"  isLink />
              <DetailRow label="Place of Birth" value="Add place" isLink />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Groom's Location" onEdit={() => open("location")}>
          <TwoColDetails rows={[
            [
              { label: "Country",          value: "India" },
              { label: "State",            value: "Kerala" },
              { label: "Ancestral Origin", value: "palakkad" },
            ],
            [
              { label: "City",        value: "Kalamassery" },
              { label: "Citizenship", value: "India" },
            ],
          ]} />
        </SectionCard>

        <SectionCard title="Professional Information" onEdit={() => open("professional")}>
          <DetailRow label="Education"             value="B.Tech - Bachelor of Technology" />
          <DetailRow label="Education in Detail"   value="Not Specified" />
          <DetailRow label="College / Institution" value="Mannarkkad universal college" />
          <DetailRow label="Employed in"           value="Private Sector" />
          <DetailRow label="Occupation"            value="Software Professional" />
          <DetailRow label="Occupation in Detail"  value="Not Specified" />
          <DetailRow label="Organization"          value="Mykare Health Private limited" />
          <DetailRow label="Annual Income"         value="Rs. 7 - 8 Lakhs" />
        </SectionCard>

        <SectionCard title="Family Details" onEdit={() => open("family")}>
          <TwoColDetails rows={[
            [
              { label: "Family Values",   value: "Moderate" },
              { label: "Family Type",     value: "Nuclear" },
              { label: "Family Status",   value: "Middle class" },
              { label: "No of Sister(s)", value: "1 / 1 Married" },
            ],
            [
              { label: "Father's Occupation", value: "Employed" },
              { label: "Mother's Occupation", value: "Homemaker" },
              { label: "No of Brother(s)",    value: "1 / 1 Married" },
              { label: "Family Location",     value: "Not Specified" },
            ],
          ]} />
        </SectionCard>

        <SectionCard title="About My Family" editLabel="Add" onEdit={() => open("aboutFamily")}>
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

      <SlideModal isOpen={openModal === "about"}        onClose={close} title="Edit — In My Own Words"><AboutMyselfForm /></SlideModal>
      <SlideModal isOpen={openModal === "basic"}        onClose={close} title="Edit — Basic Details"><BasicDetailsForm /></SlideModal>
      <SlideModal isOpen={openModal === "religion"}     onClose={close} title="Edit — Religion Information"><ReligionForm /></SlideModal>
      <SlideModal isOpen={openModal === "location"}     onClose={close} title="Edit — Location"><LocationForm /></SlideModal>
      <SlideModal isOpen={openModal === "professional"} onClose={close} title="Edit — Professional Information"><ProfessionalForm /></SlideModal>
      <SlideModal isOpen={openModal === "family"}       onClose={close} title="Edit — Family Details"><FamilyForm /></SlideModal>
      <SlideModal isOpen={openModal === "aboutFamily"}  onClose={close} title="Add — About My Family" width="max-w-md"><AboutMyselfForm /></SlideModal>
      <SlideModal isOpen={openModal === "hobbies"}      onClose={close} title="Edit — Hobbies & Interests" width="max-w-lg"><HobbiesForm /></SlideModal>
    </div>
  );
}
