"use client";

// Address shown on the map. Edit this to match the office location.
const MAP_QUERY = "Kochi, Kerala, India";

// Optional: set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to use the official
// Google Maps Embed API. Without a key we fall back to the keyless
// embed, which needs no setup and works out of the box.
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const mapSrc = API_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(
      MAP_QUERY
    )}`
  : `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

export default function LocationMap() {
  return (
    <section className="px-4 md:px-64 py-10 bg-[#fdf5f5]">
      <h2 className="text-[#c0174c] font-bold text-xl md:text-2xl text-center mb-6">
        Find Us Here
      </h2>

      <div className="overflow-hidden rounded-lg shadow-lg border border-[#c0174c]/20">
        <iframe
          title="Made2Match location"
          src={mapSrc}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
