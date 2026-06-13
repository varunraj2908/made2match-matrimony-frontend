"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "male",
    agreeTerms: false,
    newsletter: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  type Field = keyof typeof form;
  type TextField = {
    [K in Field]: (typeof form)[K] extends string ? K : never;
  }[Field];

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.agreeTerms) e.agreeTerms = "You must agree to terms";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    router.push("/verify-otp?email=" + encodeURIComponent(form.email));
  };

  const InputField = ({
    label,
    field,
    type = "text",
    placeholder = "",
  }: {
    label: string;
    field: TextField;
    type?: string;
    placeholder?: string;
  }) => (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={set(field)}
        placeholder={placeholder}
        className="w-full border-b-2 border-gray-200 py-2 text-sm text-gray-800 bg-transparent outline-none transition-all placeholder-gray-300"
        style={{ borderBottomColor: errors[field] ? "#ef4444" : form[field] ? "#c0174c" : "#e5e7eb" }}
        onFocus={e => (e.target.style.borderBottomColor = "#c0174c")}
        onBlur={e => (e.target.style.borderBottomColor = form[field] ? "#c0174c" : errors[field] ? "#ef4444" : "#e5e7eb")}
      />
      {errors[field] && <p className="text-xs mt-0.5" style={{ color: "#ef4444" }}>{errors[field]}</p>}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #f9f0f3 0%, #fdf4ff 100%)" }}
    >
      <div
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: "2px solid #c0174c" }}
      >
        {/* Header */}
        <div
          className="px-8 py-5 text-center"
          style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}
        >
          <h1 className="text-xl font-black text-white tracking-widest uppercase">Registration Form</h1>
        </div>

        {/* Form Body */}
        <div className="px-8 py-7 space-y-5">

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-5">
            <InputField label="First Name" field="firstName" />
            <InputField label="Last Name" field="lastName" />
          </div>

          {/* Email */}
          <InputField label="Email" field="email" type="email" />

          {/* Phone */}
          <InputField label="Phone Number" field="phone" type="tel" />

          {/* Address */}
          <InputField label="Address" field="address" />

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-3 tracking-wide uppercase">Gender</label>
            <div className="flex items-center gap-8">
              {["male", "female"].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setForm((f) => ({ ...f, gender: g }))}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: form.gender === g ? "#c0174c" : "#d1d5db",
                      background: "white",
                    }}
                  >
                    {form.gender === g && (
                      <div className="w-3 h-3 rounded-full" style={{ background: "#c0174c" }} />
                    )}
                  </div>
                  <span className="text-sm font-medium capitalize" style={{ color: form.gender === g ? "#c0174c" : "#6b7280" }}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            {([
              { key: "agreeTerms", label: "I agree with Terms and conditions", required: true },
              { key: "newsletter", label: "I want to receive the newsletter", required: false },
            ] as { key: Field; label: string; required: boolean }[]).map(({ key, label, required }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                  style={{
                    borderColor: form[key] ? "#c0174c" : errors[key] ? "#ef4444" : "#d1d5db",
                    background: form[key] ? "#c0174c" : "white",
                  }}
                >
                  {form[key] && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600 leading-snug">
                  {label}
                  {required && <span style={{ color: "#c0174c" }}> *</span>}
                </span>
              </label>
            ))}
            {errors.agreeTerms && (
              <p className="text-xs pl-8" style={{ color: "#ef4444" }}>{errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90 hover:scale-105 active:scale-95 mt-2"
            style={{
              background: "linear-gradient(135deg, #c0174c, #8b0f38)",
              boxShadow: "0 6px 20px rgba(192,23,76,0.35)",
            }}
          >
            Register Now
          </button>

          {/* Login link */}
          <p className="text-center text-xs text-gray-400 pt-1">
            Already have an account?{" "}
            <a href="/login" className="font-bold underline" style={{ color: "#c0174c" }}>Login here</a>
          </p>

        </div>
      </div>
    </div>
  );
}