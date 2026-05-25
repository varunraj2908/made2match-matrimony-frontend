import { useState } from "react";

export default function SearchSection() {
  const [searchType, setSearchType] = useState("Bride");
  const [profileId, setProfileId] = useState("");

  return (
    <section
      className="
        hidden md:flex
    items-stretch
    gap-0
    pl-6
        py-0 md:py-5
      "
      style={{ overflow: "hidden" }}
    >
      {/* Search By Id */}
      <div className="w-full md:w-50">
        <div
          className="
            flex flex-col gap-2 items-start
            w-full md:w-45
          "
        >
          <span className="text-gray-800 font-semibold text-sm">
            Search By Id
          </span>

          <input
            type="text"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            placeholder="Enter Profile ID"
            className="
              border border-gray-300 rounded
              px-3 py-2
              text-gray-700 text-sm
              w-full md:w-44
              focus:outline-none
            "
          />

          <button
            className="
              bg-[#b01545] hover:bg-[#8e1039]
              text-white font-semibold
              py-2
              rounded text-sm
              transition
              w-full md:w-44
            "
          >
            Search By Id
          </button>
        </div>
      </div>

      {/* Search Partner */}
      <div
        className="
          flex-1
          flex flex-col justify-center
          py-5 px-4 md:px-8
          rounded-xl md:rounded-none
        "
        style={{
          background: "#b01545",
        }}
      >
        <h3 className="text-white font-bold text-sm mb-3">
          Search Your Partner
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-white rounded px-3 py-2 text-gray-700 text-sm focus:outline-none"
          >
            <option>Bride</option>
            <option>Groom</option>
          </select>

          <select className="bg-white rounded px-3 py-2 text-gray-700 text-sm focus:outline-none">
            <option>20</option>
            {Array.from({ length: 40 }, (_, i) => (
              <option key={i}>{18 + i}</option>
            ))}
          </select>

          <select className="bg-white rounded px-3 py-2 text-gray-700 text-sm focus:outline-none">
            <option>18</option>
            {Array.from({ length: 40 }, (_, i) => (
              <option key={i}>{18 + i}</option>
            ))}
          </select>

          <select className="bg-white rounded px-3 py-2 text-gray-700 text-sm focus:outline-none">
            <option>Any</option>
            <option>Hindu</option>
            <option>Muslim</option>
            <option>Christian</option>
          </select>

          <select className="bg-white rounded px-3 py-2 text-gray-700 text-sm focus:outline-none">
            <option>Any</option>
            <option>Brahmin</option>
            <option>Kshatriya</option>
          </select>

          <div className="flex flex-col gap-2 items-start md:items-end">
            <label className="flex items-center gap-1.5 text-white text-xs cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="accent-white"
              />
              With photo
            </label>

            <button
              className="
                bg-[#7a1030] hover:bg-[#6e1430]
                text-white font-semibold
                py-2 px-5
                rounded text-sm
                transition
                w-full
              "
            >
              Search Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}