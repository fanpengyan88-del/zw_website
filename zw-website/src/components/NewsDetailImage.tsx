"use client";

const FALLBACK_COVER = "/media/news/default-news-cover.png";

export function NewsDetailImage({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <img
      src={src || FALLBACK_COVER}
      alt={src ? alt : ""}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (event.currentTarget.src.endsWith(FALLBACK_COVER)) return;
        event.currentTarget.src = FALLBACK_COVER;
        event.currentTarget.alt = "";
      }}
    />
  );
}
