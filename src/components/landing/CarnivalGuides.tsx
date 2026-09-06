import { Link } from "react-router-dom";
import {
  CARNIVAL_GUIDE_GROUPS,
  getGuidesForTerritory,
  guideHref,
  type CarnivalGuide,
} from "@/data/carnivalGuides";

// EDITORIAL, NOT AN OFFER. Guides are never season filtered. A guide to a
// Carnival that has passed is still useful reading and still ranks, so this
// block must never be run through getUpcomingDestinations. J'ouvert and Jab
// guides belong here for the same reason.

// The grid reflows to the number of guides it actually has. One card never
// sits in a four column row with three dead cells beside it, and a short
// list is centred in a narrower column instead.
const gridClass = (count: number) => {
  if (count <= 1) return "grid grid-cols-1 max-w-md mx-auto gap-3 sm:gap-4";
  if (count === 2)
    return "grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-3 sm:gap-4";
  return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4";
};

const GuideCard = ({ guide }: { guide: CarnivalGuide }) => (
  <li>
    <Link
      to={guideHref(guide)}
      className="flex h-full min-h-[44px] flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-primary hover:shadow-md transition-all"
    >
      <h4 className="font-display text-base sm:text-lg font-bold leading-snug mb-1.5">
        {guide.anchor}
      </h4>
      <p className="font-body text-sm text-muted-foreground leading-relaxed">
        {guide.blurb}
      </p>
    </Link>
  </li>
);

type Props = {
  /** Destination slug, renders only that territory's guides. */
  territory?: string;
  /** Territory name used in the heading, for example "Grenada". */
  territoryName?: string;
};

const CarnivalGuides = ({ territory, territoryName }: Props) => {
  if (territory) {
    const guides = getGuidesForTerritory(territory);
    if (guides.length === 0) return null;
    return (
      <section
        className="section-y border-t border-border"
        aria-labelledby="carnival-guides-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="mb-6 sm:mb-8">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
              Journal
            </p>
            <h2
              id="carnival-guides-heading"
              className="font-display text-2xl sm:text-3xl font-bold mb-2"
            >
              {territoryName ?? "Carnival"}{" "}
              <span className="italic text-gradient-primary">guides</span>
            </h2>
            <p className="font-body text-sm sm:text-base text-muted-foreground">
              Read before you travel, written by the team on the ground.
            </p>
          </div>
          <ul className={gridClass(guides.length)}>
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </ul>
          <div className="mt-6">
            <Link
              to="/blogs"
              className="inline-flex items-center min-h-[44px] font-body text-sm font-medium text-primary hover:underline"
            >
              See all Carnival guides →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="section-y border-t border-border"
      aria-labelledby="carnival-guides-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
            Journal
          </p>
          <h2
            id="carnival-guides-heading"
            className="font-display text-3xl sm:text-4xl font-bold mb-3"
          >
            Carnival <span className="italic text-gradient-primary">guides</span>
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
            Grouped by island and by question, so you can find the one you need.
          </p>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {CARNIVAL_GUIDE_GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-1">
                {group.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-4 sm:mb-5">
                {group.blurb}
              </p>
              <ul className={gridClass(group.guides.length)}>
                {group.guides.map((g) => (
                  <GuideCard key={`${group.id}-${g.slug}`} guide={g} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blogs"
            className="inline-flex items-center min-h-[44px] font-body text-sm font-medium text-primary hover:underline"
          >
            See all Carnival guides →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CarnivalGuides;
