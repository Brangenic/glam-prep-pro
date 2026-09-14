import { Link } from "react-router-dom";
import { PRESS_OUTLETS } from "@/data/pressCoverage";

export { PRESS_OUTLETS };

/**
 * Outlet names are set in type, never as logos. We hold no licence for
 * any publisher's trade mark, and the favicon service we used to pull
 * them from was a third-party request on every page load.
 */
const PublicationLink = ({
  name,
  anchorId,
  compact = false,
}: {
  name: string;
  anchorId: string;
  compact?: boolean;
}) => {
  const labelClass = `font-display tracking-wide text-foreground/80 group-hover:text-primary transition-colors ${
    compact ? "text-sm" : "text-base sm:text-lg"
  }`;

  return (
    <Link
      to={anchorId ? `/press#story-${anchorId}` : "/press"}
      aria-label={`Read our coverage in ${name}`}
      className="group flex items-center justify-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 ease-out"
    >
      <span className={labelClass}>{name}</span>
    </Link>
  );
};

interface PressBarProps {
  /** Hide the heading and tighten spacing (used on inner pages). */
  compact?: boolean;
}

const PressBar = ({ compact = false }: PressBarProps) => (
  <section
    aria-label="Featured in"
    className={`border-y border-primary/10 bg-primary/[0.02] ${compact ? "section-y-sm" : "section-y"}`}
  >
    <div className="container mx-auto px-4 sm:px-6">
      {!compact && (
        <div className="text-center mb-8 sm:mb-10">
          <p className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-primary/70 font-semibold mb-2">
            As Featured In
          </p>
          <p className="font-display italic text-lg sm:text-xl text-foreground/70">
            Our work has been covered by
          </p>
        </div>
      )}
      {compact && (
        <p className="text-center font-body text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-primary/70 font-semibold mb-4">
          As Featured In
        </p>
      )}
      <div
        className={`flex flex-wrap items-center justify-center ${
          compact ? "gap-x-8 gap-y-4" : "gap-x-10 sm:gap-x-14 gap-y-6"
        }`}
      >
        {PRESS_OUTLETS.map((o) => (
          <PublicationLink
            key={o.name}
            name={o.name}
            domain={o.domain}
            anchorId={o.anchorId}
            compact={compact}
          />
        ))}
      </div>
      {!compact && (
        <div className="text-center mt-8">
          <Link
            to="/press"
            className="font-body text-sm text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
          >
            See all coverage →
          </Link>
        </div>
      )}
    </div>
  </section>
);

export default PressBar;
