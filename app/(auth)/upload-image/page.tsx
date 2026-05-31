// app/(auth)/onboarding/add-photo/page.tsx
"use client";

import { useRef, useState, type ChangeEvent, type JSX } from "react";
import { useRouter } from "next/navigation";
import { uploadProfilePhoto } from "@/services/profileService";

export default function AddPhotoPage(): JSX.Element {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const openPicker = (): void => {
    inputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image must be smaller than 5 MB.");
      return;
    }

    setErrorMsg("");
    setPickedFile(file);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = async (): Promise<void> => {
    if (!pickedFile) return;
    setUploading(true);
    setErrorMsg("");
    try {
      await uploadProfilePhoto(pickedFile);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("profile:updated"));
      }
      router.push("/hobbies-interests");
    } catch (ex: any) {
      setErrorMsg(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not upload photo. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const benefits = [
    {
      title: "90%",
      sub: "Members prefer profiles with photos",
    },
    {
      title: "10×",
      sub: "More responses with a photo",
    },
  ];

  const points = [
    "Build instant trust",
    "More profile views",
    "Higher response rate",
  ];

  return (
    <div className="min-h-screen  px-4 py-5" style={{
          background:
            "linear-gradient(160deg, #fff8f0 0%, #fff0f5 40%, #fdf4ff 100%)",
        }}>
      <div className="max-w-5xl mx-auto mt-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl border border-[#efc6d5] bg-white flex items-center justify-center text-[#d4145a] text-sm">
              +
            </div>

            <h1 className="text-lg font-black text-[#111827]">
              Add your photo
            </h1>
          </div>

          <button
            onClick={() => router.push("/hobbies-interests")}
            className="px-4 py-2 rounded-full border border-[#e7ccd7] cursor-pointer bg-white text-xs font-semibold text-[#c0174c]"
          >
            Skip for now ›
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 ">

          {/* Left Card */}
          <div className="rounded-[28px] w-120 border border-[#efc6d5] bg-white p-5 shadow-sm">

            <div
              onClick={openPicker}
              className="w-full h-75 py-5 rounded-3xl border-2 border-dashed border-[#efb2c8] bg-[#fff7fa] cursor-pointer flex flex-col items-center justify-center relative overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#f6c8a6]" />
                    <div className="absolute top-0 left-0 w-24 h-12 rounded-t-full bg-[#8c0036]" />
                  </div>

                  <div className="w-36 h-20 rounded-t-[50px] bg-[#d4145a]" />

                  <p className="mt-4 text-[#d4145a] text-base font-black">
                    Tap to upload photo
                  </p>

                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Clear front-facing photo works best
                  </p>

                  <div className="flex gap-2 mt-4">
                    {["JPG", "PNG", "WEBP"].map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-full text-[10px] font-bold border border-[#efc6d5] text-[#d4145a] bg-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-[#d4145a] text-sm font-bold">
                  Uploading...
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onFileChange}
            />

            <button
              onClick={openPicker}
              className="w-full mt-4 bg-[#b10846] py-3 rounded-2xl border border-gray-300 text-base font-bold text-white"
            >
              Upload photo
            </button>

            <button
              onClick={openPicker}
              className="w-full mt-3 py-3 rounded-2xl border border-gray-300 bg-[#fff5f8] text-base font-bold text-[#111827]"
            >
              Choose from gallery
            </button>

            {preview && (
              <button
                onClick={handleContinue}
                disabled={uploading}
                className="w-full mt-4 py-3.5 rounded-2xl text-white text-base font-black shadow-lg disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg,#d4145a 0%, #b10846 45%, #8c0036 100%)",
                }}
              >
                {uploading ? "Uploading..." : "Continue →"}
              </button>
            )}

            {errorMsg && (
              <p className="mt-3 text-xs text-red-500 text-center">{errorMsg}</p>
            )}
          </div>

          {/* Right Card */}
          <div className="rounded-[28px] w-120 border border-[#efc6d5] bg-white p-10 shadow-sm">

            <h2 className="text-xl font-black text-[#111827] leading-tight">
              Add a photo for
             
              better responses
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-[#fbf1f5] p-4 text-center"
                >
                  <p className="text-2xl font-black text-[#d4145a]">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-snug">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#f2d6df] my-5" />

            <p className="text-xs font-black tracking-wide text-[#d4145a] mb-4">
              WHY IT MATTERS
            </p>

            <div className="space-y-4">
              {points.map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#d4145a] text-white flex items-center justify-center font-black text-sm">
                    ✓
                  </div>

                  <div>
                    <p className="font-black text-[#111827] text-base">
                      {item}
                    </p>

                    <p className="text-xs text-gray-500">
                      Better visibility and stronger profile trust.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 rounded-2xl bg-[#fff5f8] border-l-4 border-[#d4145a] px-4 py-3">
              <p className="text-[#b10846] font-bold text-xs">
                Your photo is private — only visible to members you connect with.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}