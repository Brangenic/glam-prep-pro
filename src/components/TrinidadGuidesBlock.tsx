import { Link } from "react-router-dom";

const LINKS: { href: string; title: string }[] = [
  {
    href: "/blogs/trinidad-carnival-2027-first-time-masquerader-guide",
    title: "Trinidad Carnival 2027: First-Time Masquerader Guide",
  },
  {
    href: "/blogs/dont-make-these-5-rookie-mistakes-trinidad-carnival-2027",
    title: "Don't Make These 5 Rookie Mistakes: Trinidad Carnival 2027",
  },
  {
    href: "/blogs/10-tips-for-trinidad-carnival-jouvert",
    title: "10 Tips for Trinidad Carnival J'ouvert",
  },
  {
    href: "/blogs/what-shoes-to-wear-for-trinidad-carnival-monday-tuesday-no-not-heels",
    title: "What Shoes to Wear for Trinidad Carnival",
  },
  {
    href: "/blogs/how-to-put-on-your-carnival-wire-bra",
    title: "How to Put On Your Carnival Wire Bra",
  },
  {
    href: "/blogs/is-trinidad-carnival-safe",
    title: "Is Trinidad Carnival Safe?",
  },
];

const TrinidadGuidesBlock = () => (
  <section
    className="container mx-auto px-4 sm:px-6 max-w-3xl"
    aria-labelledby="plan-trinidad-heading"
  >
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2
        id="plan-trinidad-heading"
        className="font-display text-2xl sm:text-3xl font-bold mb-2"
      >
        Plan your <span className="italic text-gradient-primary">Trinidad Carnival</span>
      </h2>
      <p className="font-body text-sm sm:text-base text-muted-foreground mb-6">
        Practical guides from the Carnival Glam Hub journal.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 list-disc pl-5">
        {LINKS.map((l) => (
          <li key={l.href} className="font-body text-base">
            <Link
              to={l.href}
              className="text-primary underline underline-offset-2 decoration-primary/30 hover:decoration-primary"
            >
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default TrinidadGuidesBlock;