import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deels — челленджи и короткие видео",
    short_name: "Deels",
    description: "Создавайте челленджи, снимайте видео, голосуйте и поддерживайте добрые дела.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6b2bc1",
    lang: "ru",
    orientation: "portrait",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}

