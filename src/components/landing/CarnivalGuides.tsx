import { Link } from "react-router-dom";

const GUIDES: { href: string; title: string; blurb: string }[] = [
  {
    href: "/blogs/trinidad-carnival-2027-first-time-masquerader-guide",
    title: "Trinidad Carnival 2027: First-Time Masquerader Guide",
    blurb: "Dates, bands, hotels, budgets and Carnival-morning planning.",
  },
  {
    href: "/blogs/is-professional-carnival-makeup-worth-it",
    title: "Is Professional Carnival Makeup Worth It?",
    blurb: "What you are really paying for, and when it pays off.",
  },
  {
    href: "/blogs/top-seven-best-carnival-hairstyles",
    title: "Top Seven Best Carnival Hairstyles",
    blurb: "Headpiece-ready looks that hold through the road.",
  },
  {
    href: "/blogs/what-is-jouvert-and-why-should-you-do-it-at-least-once",
    title: "What is J'ouvert?",
    blurb: "Why every Carnival chaser should do J'ouvert at least once.",
  },
  {
    href: "/blogs/ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips",
    title: "Ultimate Guide to Trinidad Carnival 2026",
    blurb: "Mas bands, dates and insider tips for first-timers and veterans.",
  },
];

const CarnivalGuides = () => (
  <section className="py-16 sm:py-24 border-t border-border" aria-labelledby="carnival-guides-heading">
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
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
          Plan smarter with the guides our masqueraders read most.
        </p>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {GUIDES.map((g) => (
          <li key={g.href}>
            <Link
              to={g.href}
              className="block h-full rounded-2xl border border-border bg-card p-5 sm:p-6 hover:border-primary hover:shadow-md transition-all"
            >
              <h3 className="font-display text-lg font-bold mb-2 leading-snug">
                {g.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {g.blurb}
              </p>
              <span className="font-body text-xs uppercase tracking-[0.15em] text-primary mt-3 inline-block">
                Read the guide →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="text-center mt-10">
        <Link
          to="/blogs"
          className="font-body text-sm font-medium text-primary hover:underline"
        >
          See all Carnival guides →
        </Link>
      </div>
    </div>
  </section>
);

export default CarnivalGuides;