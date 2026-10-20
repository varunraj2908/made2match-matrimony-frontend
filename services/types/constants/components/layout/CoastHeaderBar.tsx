type TabType = "Regular" | "Prime";

export default function CoastHeaderBar({
  activeTab,
  setActiveTab,
}: {
  activeTab?: TabType;
  setActiveTab?: (tab: TabType) => void;
}) {
  const currentTab = activeTab ?? "Regular";

  return (
    <div className="relative hidden lg:flex items-center justify-center pt-7 lg:pt-10">
      
      {/* Horizontal Line */}
      <div className="absolute w-[77%] h-px bg-gray-300"></div>

      {/* Buttons */}
      <div className="flex gap-1  z-10">
        {(["Regular", "Prime"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab?.(tab)}
            className={`px-8 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
              currentTab === tab
                ? "border-[gray] text-white shadow-sm bg-[#b22234]"
                : "border-gray-300 text-gray-500 bg-white hover:border-[#b22234] hover:text-[#b22234]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}