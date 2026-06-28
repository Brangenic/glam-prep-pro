import { useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  vertical?: boolean;
  className?: string;
}

const YouTubeEmbed = ({ videoId, title, vertical = false, className = "" }: YouTubeEmbedProps) => {
  const [loaded, setLoaded] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const wrapper = vertical
    ? "relative w-full max-w-[360px] mx-auto rounded-xl overflow-hidden shadow-md bg-black"
    : "relative w-full rounded-xl overflow-hidden shadow-md bg-black";
  const ratio = vertical ? "aspect-[9/16]" : "aspect-video";

  return (
    <div className={`${wrapper} ${className}`}>
      <div className={ratio}>
        {loaded ? (
          <iframe
            src={src}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 w-full h-full"
          >
            <img
              src={thumb}
              alt={title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default YouTubeEmbed;