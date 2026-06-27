import { Link } from "react-router-dom";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

type ContextLink = { href: string; label: string };

// Slug-targeted contextual link sets so the CTA can point readers into the
// most relevant service or territory page based on which post they're on.
const SLUG_CONTEXT: Record<string, ContextLink[]> = {
  "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips": [
    { href: "/trinidad-carnival-2027", label: "Plan Trinidad Carnival 2027" },
    { href: "/services/carnival-makeup", label: "See Carnival makeup packages" },
  ],
  "what-is-jouvert-and-why-should-you-do-it-at-least-once": [
    { href: "/services/carnival-makeup", label: "Sweat-resistant J'ouvert makeup" },
    { href: "/trinidad-carnival-2027", label: "Trinidad Carnival 2027" },
  ],
  "10-tips-for-trinidad-carnival-jouvert": [
    { href: "/services/carnival-makeup", label: "Sweat-resistant J'ouvert makeup" },
    { href: "/trinidad-carnival-2027", label: "Trinidad Carnival 2027" },
  ],
  "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival": [
    { href: "/grenada", label: "Grenada Spicemas glam" },
    { href: "/services/carnival-makeup", label: "Carnival makeup packages" },
  ],
  "top-seven-best-carnival-hairstyles": [
    { href: "/services/carnival-hair", label: "Carnival hair styling" },
  ],
  "carnival-ponytails": [
    { href: "/services/carnival-hair", label: "Carnival hair styling" },
  ],
  "strut-or-struggle-the-ultimate-guide-to-carnival-shoes": [
    { href: "/services/getting-dressed", label: "Getting dressed service" },
  ],
  "what-shoes-to-wear-to-carnival": [
    { href: "/services/getting-dressed", label: "Getting dressed service" },
  ],
  "carnival-queen-rihannas-stunning-return-to-crop-over-2024": [
    { href: "/barbados", label: "Barbados Crop Over glam" },
    { href: "/services/carnival-makeup", label: "Celebrity-level Carnival makeup" },
  ],
  "chloe-bailey-saint-lucia-carnival": [
    { href: "/saint-lucia", label: "Saint Lucia Carnival glam" },
    { href: "/services/carnival-makeup", label: "Carnival makeup packages" },
  ],
  "winnie-harlow-jamaica-carnival": [
    { href: "/jamaica", label: "Jamaica Carnival glam" },
    { href: "/services/carnival-makeup", label: "Carnival makeup packages" },
  ],
};

const inferContext = (
  slug?: string,
  tags?: string[] | null,
  category?: string | null,
): ContextLink[] => {
  if (slug && SLUG_CONTEXT[slug]) return SLUG_CONTEXT[slug];
  const hay = [
    slug ?? "",
    (tags ?? []).join(" "),
    category ?? "",
  ]
    .join(" ")
    .toLowerCase();
  const out: ContextLink[] = [];
  const push = (l: ContextLink) => {
    if (!out.find((x) => x.href === l.href)) out.push(l);
  };
  if (/(hair|ponytail|braid|cornrow|wig)/.test(hay))
    push({ href: "/services/carnival-hair", label: "Carnival hair styling" });
  if (/(shoe|boot|footwear|getting dressed|costume fit)/.test(hay))
    push({ href: "/services/getting-dressed", label: "Getting dressed service" });
  if (/(photo|shoot|portrait|camera)/.test(hay))
    push({ href: "/services/carnival-photoshoot", label: "Carnival photoshoot" });
  if (/(jouvert|j'ouvert|jab|paint|mud|oil)/.test(hay))
    push({ href: "/services/carnival-makeup", label: "Sweat-resistant J'ouvert makeup" });
  if (/trinidad/.test(hay))
    push({ href: "/trinidad-carnival-2027", label: "Trinidad Carnival 2027" });
  if (/(barbados|crop over)/.test(hay)) push({ href: "/barbados", label: "Barbados Crop Over glam" });
  if (/(jamaica)/.test(hay)) push({ href: "/jamaica", label: "Jamaica Carnival glam" });
  if (/(grenada|spicemas)/.test(hay)) push({ href: "/grenada", label: "Grenada Spicemas glam" });
  if (/(saint lucia|st\.? lucia|lucia)/.test(hay))
    push({ href: "/saint-lucia", label: "Saint Lucia Carnival glam" });
  if (/(miami)/.test(hay)) push({ href: "/miami", label: "Miami Carnival glam" });
  if (/(antigua)/.test(hay)) push({ href: "/antigua", label: "Antigua Carnival glam" });
  // Default secondary link
  if (!out.length)
    push({ href: "/services/carnival-makeup", label: "See what's included" });
  return out.slice(0, 3);
};

type BlogCTAProps = {
  slug?: string;
  tags?: string[] | null;
  category?: string | null;
};

const BlogCTA = ({ slug, tags, category }: BlogCTAProps) => {
  const contextLinks = inferContext(slug, tags, category);
  return (
    <aside
      aria-label="Book Carnival Glam Hub"
      className="mt-16 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 sm:p-10 shadow-sm"
    >
      <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-foreground mb-4">
        Reading about Carnival is the easy part. Showing up flawless is ours.
      </h2>
      <p className="font-body text-base sm:text-lg text-foreground/80 leading-relaxed mb-6">
        Carnival Glam Hub handles your whole Carnival morning in one location:
        sweat-resistant makeup, hair, getting dressed, photos and shuttle.
        Slots sell out by territory, so secure yours early.
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-mcp-action="register-event"
          data-mcp-description="Register and pay a deposit for a Carnival Glam Hub event, by territory and date."
          onClick={() => {
            if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
              window.gtag("event", "conversion", {
                send_to: "AW-10894663311/zIoVCMj-iLAcEI-9_coo",
                value: 1.0,
                currency: "USD",
              });
            }
          }}
          className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 font-body text-base font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:shadow-primary/30 no-underline"
        >
          Register for your Carnival
        </a>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {contextLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="font-body text-sm font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
            >
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BlogCTA;