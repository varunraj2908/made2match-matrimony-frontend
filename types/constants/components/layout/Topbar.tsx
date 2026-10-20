export default function Topbar() {
  return (
    <div className="w-full bg-[#c0174c] text-white text-sm">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-5">
        <div className="font-semibold tracking-wide text-[18px]">
          Made2Match
        </div>

        <div className="flex items-center gap-2">
          <span>Need Help?</span>
          <a
            href="tel:+917909227177"
            className="font-bold hover:text-yellow-300 transition"
          >
            Call +91 7909227177
          </a>
        </div>
      </div>
    </div>
  );
}