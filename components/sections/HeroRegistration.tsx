"use client";

import Image from "next/image";
import { useState } from "react";

import { useRegister } from "@/hooks/useRegister";

import { registerSchema, RegisterRequest } from "@/schemas/authSchema";

import { useRouter } from "next/navigation";

export default function HeroRegistration() {
  const router = useRouter();

  const { mutate, isPending, isError, error, isSuccess } = useRegister();

  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setValidationErrors({
      ...validationErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        errors[fieldName] = issue.message;
      });

      setValidationErrors(errors);
      return;
    }

    mutate(formData, {
      onSuccess: (res: any) => {
        const tokens = res?.data;
        if (tokens?.accessToken) {
          localStorage.setItem("token", tokens.accessToken);
          if (tokens.refreshToken) {
            localStorage.setItem("refreshToken", tokens.refreshToken);
          }
        }
        router.push("/onboarding/basic-details");
      },
    });
  };

  return (
    <section
      className="
        relative 
        flex 
        flex-col 
        lg:flex-row 
        items-stretch
        bg-white
        lg:bg-transparent
      "
      style={{
        background:
          "linear-gradient(135deg, #8b1a3a 0%, #c0174c 60%, #d4185a 100%)",
      }}
    >
      {/* MOBILE WHITE BACKGROUND */}
      <div className="absolute inset-0 bg-white lg:hidden"></div>

      {/* LEFT IMAGE */}
     {/* LEFT IMAGE */}
<div className="relative w-full lg:w-[50%] overflow-hidden flex justify-center items-end pt-6 lg:pt-0">
  <Image
    src="/Newlywed South Asian couple in traditional attire.png"
    alt="Couple"
    width={500}
    height={500}
    className="object-contain w-65 sm:w-85 lg:w-auto mt-0 lg:mt-3.5"
  />

  {/* MOBILE BOTTOM BLEND */}
  <div
    className="
      absolute 
      bottom-0 
      left-0 
      w-full 
      h-20 
      lg:hidden
      pointer-events-none
    "
    style={{
      background:
        "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 100%)",
    }}
  />
</div>
      {/* RIGHT FORM */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-8 lg:px-10 lg:py-8">
        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-[#c0174c] lg:text-white text-2xl font-bold tracking-wide">
            Find Your Perfect Match
          </h2>

          <p className="text-gray-500 lg:text-white/60 text-xs mt-1">
            Create your free profile in seconds
          </p>
        </div>

        {/* CARD */}
        {/* CARD */}
        <div
          className="
    w-full 
    max-w-sm 
    rounded-2xl 
    p-6 
    flex 
    flex-col 
    gap-4
  "
          style={{
            background:
              typeof window !== "undefined" && window.innerWidth < 1024
                ? "#a01040"
                : "rgba(255,255,255,0.08)",

            backdropFilter:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? "blur(16px)"
                : "none",

            border:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? "1px solid rgba(255,255,255,0.18)"
                : "1px solid rgba(255,255,255,0.12)",

            boxShadow:
              typeof window !== "undefined" && window.innerWidth >= 1024
                ? "0 8px 32px rgba(0,0,0,0.2)"
                : "0 4px 18px rgba(0,0,0,0.15)",
          }}
        >
          {/* FULL NAME */}
          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.fullName && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.email && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* MOBILE NUMBER */}
          <div>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.mobileNumber && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.mobileNumber}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                text-sm 
                outline-none
                text-gray-800
                lg:text-white
                placeholder-gray-400
                lg:placeholder-white/50
              "
              style={{
                background:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "rgba(255,255,255,0.12)"
                    : "#f9fafb",
                border:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid #e5e7eb",
              }}
            />

            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.02] active:scale-95 mt-1 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #e05a1a, #cebd05)",
              boxShadow: "0 4px 18px rgba(224,90,26,0.5)",
            }}
          >
            {isPending ? "Registering..." : "Join Now For Free 🎉"}
          </button>

          {/* SUCCESS */}
          {isSuccess && (
            <p className="text-green-500 text-sm text-center">
              Registration successful!
            </p>
          )}

          {/* API ERROR */}
          {isError && (
            <p className="text-red-500 text-sm text-center">
              {(error as any)?.response?.data?.message || "Registration failed"}
            </p>
          )}

          {/* LOGIN */}
          <p className="text-center text-gray-500 lg:text-white/40 text-xs">
            Already registered?{" "}
            <a
              href="/login"
              className="text-[#c0174c] lg:text-white/80 underline font-medium hover:text-[#a01040] lg:hover:text-white transition"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
