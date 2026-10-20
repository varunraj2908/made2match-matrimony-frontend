import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Made2Match — Matrimony",
    short_name: "Made2Match",
    description:
      "Find your perfect life partner with Made2Match — verified profiles, smart matches and a trusted matrimony experience.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf5f5",
    theme_color: "#c0174c",
    categories: ["social", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
