import { Link } from "react-router-dom";
import { getSeasonNotice } from "@/data/blogSeasonNotices";

/**
 * Quiet inline callout pointing readers of an older season's guide at the
 * current season. Copy and the slug map live in src/data/blogSeasonNotices.ts.
 * Renders nothing for posts with no notice.
 */
const SeasonNotice = ({ slug }: { slug: string | undefined }) => {
  const parts = getSeasonNotice(slug);
  if (!parts) return null;
  return (
    <aside
      aria-label="Current season"
      className="not-prose mb-10 rounded-r-lg border-l-2 border-primary bg-primary/5 px-5 py-4 font-body text-sm leading-relaxed text-foreground/80"
    >
      <p>
        {parts.map((part, i) =>
          typeof part === "string" ? (
            <span key={i}>{part}</span>
          ) : (
            <Link
              key={i}
              to={part.href}
              className="font-semibold text-foreground underline decoration-primary/50 underline-offset-2 hover:decoration-primary"
            >
              {part.text}
            </Link>
          ),
        )}
      </p>
    </aside>
  );
};

export default SeasonNotice;
