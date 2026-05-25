export default function BrowseBySection() {
  return (
    <section className="bg-white border-t border-gray-200 px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-5 md:gap-8">
        
        {/* LEFT TITLE */}
        <div className="shrink-0 md:w-36">
          <p className="text-xs md:text-sm font-extrabold text-gray-800 uppercase leading-tight tracking-wide">
            Browse
            <br />
            Matrimonial
            <br />
            Profiles By
          </p>
        </div>

        {/* LINKS */}
        <div className="flex-1 flex flex-col gap-3 text-xs text-gray-600">
          
          {/* Mother Tongue */}
          <div className="flex flex-wrap gap-x-1 gap-y-1 leading-6">
            {[
              "Mother tongue",
              "Tamil",
              "Gujarati",
              "Kannada",
              "Telugu",
              "Devi",
              "Punjabi",
              "Marathi",
              "Bengali",
              "Sindhi",
              "Malayalam",
              "Urdu",
            ].map((item, i, arr) => (
              <span key={item}>
                <a
                  href="#"
                  className="hover:text-[#c0174c] hover:underline"
                >
                  {item}
                </a>

                {i < arr.length - 1 && (
                  <span className="text-gray-300 mx-0.5">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Community */}
          <div className="flex flex-wrap gap-x-1 gap-y-1 leading-6">
            {[
              "Community",
              "Agarwal",
              "Brahmin",
              "Punjabi",
              "Rajput",
              "Goswami",
            ].map((item, i, arr) => (
              <span key={item}>
                <a
                  href="#"
                  className="hover:text-[#c0174c] hover:underline"
                >
                  {item}
                </a>

                {i < arr.length - 1 && (
                  <span className="text-gray-300 mx-0.5">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Religion */}
          <div className="flex flex-wrap gap-x-1 gap-y-1 leading-6">
            {[
              "Religion",
              "Hindu",
              "Sikh",
              "Muslim",
              "Christian",
              "Jain",
            ].map((item, i, arr) => (
              <span key={item}>
                <a
                  href="#"
                  className="hover:text-[#c0174c] hover:underline"
                >
                  {item}
                </a>

                {i < arr.length - 1 && (
                  <span className="text-gray-300 mx-0.5">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* MORE */}
        <div className="shrink-0 self-start md:self-auto">
          <a
            href="#"
            className="text-xs font-semibold text-gray-700 hover:text-[#c0174c]"
          >
            More
          </a>
        </div>
      </div>
    </section>
  );
}