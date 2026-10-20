import Link from "next/link";

type RegistrationConsentProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  dark?: boolean;
};

export default function RegistrationConsent({
  checked,
  onChange,
  error,
  dark = false,
}: RegistrationConsentProps) {
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#c0174c]"
          aria-invalid={Boolean(error)}
          aria-label="Accept Terms and Conditions and Privacy Policy"
        />
        <span className={`text-xs leading-5 ${dark ? "text-white/80" : "text-gray-600"}`}>
          I agree to the{" "}
          <Link
            href="/terms-and-conditions"
            target="_blank"
            className={`font-semibold underline ${dark ? "text-[#E8C547]" : "text-[#c0174c]"}`}
          >
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            className={`font-semibold underline ${dark ? "text-[#E8C547]" : "text-[#c0174c]"}`}
          >
            Privacy Policy
          </Link>
          <span className="text-red-500"> *</span>
        </span>
      </div>
      {error && <p className={`mt-1 pl-6 text-xs ${dark ? "text-amber-200" : "text-red-500"}`}>{error}</p>}
    </div>
  );
}
