import { Link, useLocation } from "react-router-dom";
import { isUpcomingDestination } from "@/data/seasons";

type LinkRef = { to: string; label: string };

type Props = {
  services?: LinkRef[];
  destinations?: LinkRef[];
  guides?: LinkRef[];
};

const ALL_SERVICES: Record<string, LinkRef> = {
  "/services/carnival-makeup": { to: "/services/carnival-makeup", label: "Sweat-resistant Carnival makeup" },
  "/services/carnival-hair": { to: "/services/carnival-hair", label: "Carnival hair and hairstyles" },
  "/services/carnival-photoshoot": { to: "/services/carnival-photoshoot", label: "Carnival photoshoot" },
  "/services/getting-dressed": { to: "/services/getting-dressed", label: "Costume getting-dressed help" },
  "/services/carnival-shuttle": { to: "/services/carnival-shuttle", label: "Carnival shuttle service" },
};

const SERVICE_DEFAULTS: Record<string, { destinations: LinkRef[]; guides: LinkRef[] }> = {
  "/services/carnival-makeup": {
    destinations: [
      { to: "/trinidad", label: "Trinidad Carnival makeup" },
      { to: "/jamaica", label: "Jamaica Carnival makeup" },
      { to: "/barbados", label: "Barbados Crop Over makeup" },
    ],
    guides: [
      { to: "/blogs/is-professional-carnival-makeup-worth-it", label: "Is professional Carnival makeup worth it?" },
      { to: "/blogs/how-far-in-advance-to-book-carnival-makeup", label: "How far in advance should I book?" },
    ],
  },
  "/services/carnival-hair": {
    destinations: [
      { to: "/trinidad", label: "Trinidad Carnival hair" },
      { to: "/jamaica", label: "Jamaica Carnival hair" },
      { to: "/miami", label: "Miami Carnival hair" },
    ],
    guides: [
      { to: "/blogs/top-seven-best-carnival-hairstyles", label: "Top seven Carnival hairstyles" },
      { to: "/blogs/carnival-ponytails-bald-spots-what-no-one-tells-you", label: "Carnival ponytails that hold" },
    ],
  },
  "/services/carnival-photoshoot": {
    destinations: [
      { to: "/trinidad-carnival-2027", label: "Trinidad Carnival 2027 photoshoot" },
      { to: "/jamaica", label: "Jamaica Carnival photoshoot" },
    ],
    guides: [
      { to: "/blogs/trinidad-carnival-vs-jamaica-carnival", label: "Trinidad vs Jamaica Carnival guide" },
    ],
  },
  "/services/getting-dressed": {
    destinations: [
      { to: "/trinidad", label: "Trinidad Carnival dressing" },
      { to: "/grenada", label: "Grenada Spicemas dressing" },
    ],
    guides: [
      { to: "/blogs/strut-or-struggle-the-ultimate-guide-to-carnival-shoes", label: "Strut or struggle: Carnival shoes" },
      { to: "/blogs/what-shoes-to-wear-for-trinidad-carnival-monday-tuesday-no-not-heels", label: "What shoes to wear to Carnival" },
    ],
  },
  "/services/carnival-shuttle": {
    destinations: [
      { to: "/trinidad-carnival-2027", label: "Trinidad Carnival 2027 shuttle" },
      { to: "/trinidad", label: "Trinidad Carnival hub" },
    ],
    guides: [
      { to: "/blogs/trinidad-carnival-vs-jamaica-carnival", label: "Trinidad vs Jamaica Carnival guide" },
    ],
  },
};

const DESTINATION_SLUGS = new Set([
  "jamaica",
  "saint-lucia",
  "antigua",
  "grenada",
  "barbados",
  "miami",
  "toronto",
  "trinidad",
  "guyana",
  "epic-cruise",
  "trinidad-carnival-2027",
]);

const DEST_LABEL: Record<string, string> = {
  jamaica: "Jamaica Carnival",
  "saint-lucia": "Saint Lucia Carnival",
  antigua: "Antigua Carnival",
  grenada: "Grenada Spicemas",
  barbados: "Barbados Crop Over",
  miami: "Miami Carnival",
  toronto: "Toronto Caribana",
  trinidad: "Trinidad Carnival",
  guyana: "Guyana Carnival",
  "epic-cruise": "Epic Cruise, Trinidad Carnival",
  "trinidad-carnival-2027": "Trinidad Carnival 2027",
};

const DEST_NEIGHBOURS: Record<string, string[]> = {
  jamaica: ["trinidad", "miami", "barbados"],
  "saint-lucia": ["trinidad", "barbados", "grenada"],
  antigua: ["barbados", "saint-lucia", "trinidad"],
  grenada: ["trinidad", "saint-lucia", "barbados"],
  barbados: ["trinidad", "grenada", "saint-lucia"],
  miami: ["jamaica", "trinidad", "toronto"],
  toronto: ["miami", "jamaica", "trinidad"],
  trinidad: ["trinidad-carnival-2027", "jamaica", "barbados"],
  guyana: ["trinidad", "barbados"],
  "epic-cruise": ["trinidad-carnival-2027", "trinidad"],
  "trinidad-carnival-2027": ["trinidad", "epic-cruise", "jamaica"],
};

const DEST_GUIDES: Record<string, LinkRef[]> = {
  trinidad: [
    { to: "/blogs/trinidad-carnival-vs-jamaica-carnival", label: "Trinidad vs Jamaica Carnival" },
  ],
  "trinidad-carnival-2027": [
    { to: "/blogs/trinidad-carnival-vs-jamaica-carnival", label: "Trinidad vs Jamaica Carnival" },
  ],
  jamaica: [
    { to: "/blogs/trinidad-carnival-vs-jamaica-carnival", label: "Trinidad vs Jamaica Carnival" },
  ],
  grenada: [
    { to: "/blogs/jab-jab-101-what-you-really-need-to-know-about-grenada-carnival", label: "Jab Jab 101" },
  ],
};

function deriveFromPath(pathname: string): Props | null {
  // Service pages
  if (pathname.startsWith("/services/")) {
    const current = pathname.replace(/\/$/, "");
    const services = Object.keys(ALL_SERVICES)
      .filter((k) => k !== current)
      .map((k) => ALL_SERVICES[k]);
    const meta = SERVICE_DEFAULTS[current];
    return {
      services,
      destinations: (meta?.destinations ?? []).filter((d) =>
        isUpcomingDestination(d.to.replace(/^\//, "")),
      ),
      guides: meta?.guides ?? [],
    };
  }
  // Destination pages
  const slug = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (DESTINATION_SLUGS.has(slug)) {
    const services = Object.values(ALL_SERVICES);
    // Neighbour logic is unchanged, but a Carnival that has passed is
    // never offered as an onward destination.
    const neighbours = (DEST_NEIGHBOURS[slug] ?? [])
      .filter((s) => isUpcomingDestination(s))
      .map((s) => ({
        to: `/${s}`,
        label: DEST_LABEL[s] ?? s,
      }));
    return {
      services,
      destinations: neighbours,
      guides: DEST_GUIDES[slug] ?? [],
    };
  }

  return null;
}

const Column = ({ title, items }: { title: string; items: LinkRef[] }) => {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="font-body text-xs font-semibold mb-3 uppercase tracking-[0.15em] text-foreground/60">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="font-body text-sm text-foreground/80 hover:text-primary underline-offset-2 hover:underline transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * True when RelatedLinks would render something for this path. Callers use it
 * so they never wrap the component in a padded container that would otherwise
 * render as an empty block of dead space.
 */
export function hasRelatedLinks(pathname: string): boolean {
  const derived = deriveFromPath(pathname);
  if (!derived) return false;
  return Boolean(
    derived.services?.length || derived.destinations?.length || derived.guides?.length,
  );
}

const RelatedLinks = (props: Props) => {
  const { pathname } = useLocation();
  const derived = !props.services && !props.destinations && !props.guides
    ? deriveFromPath(pathname)
    : null;
  const services = props.services ?? derived?.services ?? [];
  const destinations = props.destinations ?? derived?.destinations ?? [];
  const guides = props.guides ?? derived?.guides ?? [];

  if (!services.length && !destinations.length && !guides.length) return null;


  return (
    <section
      aria-label="Related links"
      className="mt-16 pt-10 border-t border-border"
      data-related-links
    >
      <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">
        Keep exploring
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <Column title="Services" items={services} />
        <Column title="Destinations" items={destinations} />
        <Column title="Guides" items={guides} />
      </div>
    </section>
  );
};

export default RelatedLinks;