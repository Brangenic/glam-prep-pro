import { FULL_SERVICE_SLUGS, LITE_SLUGS } from "@/data/hubTiers";
import { FACES_FORMATTED, STATS_STARTED_YEAR, STATS_HEADLINE } from "@/data/glamHubStats";

/**
 * Territory count is derived from the tier model so it can never go
 * stale. Full Service hubs plus Glam Hub Lite territories. Partnerships
 * such as Epic Cruise are not hubs, so they are deliberately excluded.
 */
const TERRITORY_COUNT = FULL_SERVICE_SLUGS.length + LITE_SLUGS.length;

const stats = [
  { value: `${FACES_FORMATTED}+`, label: `Faces Since ${STATS_STARTED_YEAR}` },
  { value: "2017", label: "Serving Carnival Since" },
  { value: String(TERRITORY_COUNT), label: "Territories" },
  { value: "Band Neutral", label: "Every Band, Every Section" },
];

const SocialProof = () => (
  <section className="border-y border-primary/10 bg-primary/[0.03]">
    <div className="container mx-auto px-4 sm:px-6 section-y-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x divide-primary/15">
        {stats.map((s) => (
          <div key={s.label} className="text-center px-2 sm:px-4">
            <span className="font-display font-bold text-xl sm:text-2xl text-primary italic">
              {s.value}
            </span>
            <p className="font-body text-[11px] sm:text-xs text-muted-foreground mt-1 sm:mt-1.5 uppercase tracking-[0.15em] font-medium">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <p className="font-body text-sm text-muted-foreground text-center mt-6">{STATS_HEADLINE}</p>
    </div>
  </section>
);

export default SocialProof;
