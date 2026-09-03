import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RelatedLinks from "@/components/RelatedLinks";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/constants";
import { STATION_SERVICE_TYPES } from "@/data/stationRentals";
import { getUpcomingDestinations } from "@/data/seasons";

const PAGE_TITLE = "Join Our Team | Carnival Glam Hub Careers";
const PAGE_DESCRIPTION =
  "Work Carnival mornings with Carnival Glam Hub. Makeup artists, hair stylists, photographers, dressers and front of house crew across the Caribbean and the diaspora.";
const CANONICAL = "https://www.carnivalglamhub.com/joinourteam";

/**
 * Roles are derived from the services the Hub actually runs, so this list
 * can never claim work we do not offer. Station service types come from
 * src/data/stationRentals.ts.
 */
const ROLES = [
  ...STATION_SERVICE_TYPES,
  "Photographers",
  "Costume dressers",
  "Front of house and check-in crew",
];

const STEPS = [
  {
    title: "Send your portfolio",
    body: "Message us on WhatsApp or email with your role, your territory and a link to your work. Instagram is fine.",
  },
  {
    title: "We review and shortlist",
    body: "Your work is reviewed against the standard we hold on Carnival morning: speed, hygiene and a finish that survives the road.",
  },
  {
    title: "Trial and briefing",
    body: "Shortlisted artists are briefed on the Hub schedule, the products we use and how the stations run.",
  },
  {
    title: "Work the season",
    body: "Confirmed crew are allocated to a territory and a Carnival day, and paid for the work they take on.",
  },
];

const JoinOurTeam = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (prev === null) tag?.remove();
        else tag?.setAttribute("content", prev);
      };
    };

    const restorers: Array<() => void> = [];
    restorers.push(setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:title"]', "property", "og:title", PAGE_TITLE));
    restorers.push(
      setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION),
    );
    restorers.push(setMeta('meta[property="og:url"]', "property", "og:url", CANONICAL));
    restorers.push(setMeta('meta[property="og:type"]', "property", "og:type", "website"));

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL);

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (previousCanonical !== null) canonical?.setAttribute("href", previousCanonical);
      else canonical?.remove();
    };
  }, []);

  const upcoming = getUpcomingDestinations();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="container mx-auto max-w-4xl px-4 sm:px-6">
          <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.28em] text-secondary">
            Careers
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Join the Carnival Glam Hub team
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
            Carnival Glam Hub has created paid Carnival season work for hundreds of Caribbean
            beauty professionals since 2017. Every Carnival morning we run a full lounge:
            makeup, hair, getting dressed, photos and the shuttle, all under one roof, and we
            build a local crew in every territory we open in.
          </p>
        </section>

        <section className="section-y container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Who we hire</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {ROLES.map((role) => (
              <li
                key={role}
                className="rounded-lg border border-border bg-card px-4 py-3 font-body text-sm sm:text-base"
              >
                {role}
              </li>
            ))}
          </ul>
          <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
            We hire in the territories we are working this season:{" "}
            {upcoming.map((d) => d.name).join(", ")}. If your Carnival is not on that list yet,
            send your portfolio anyway and we will keep it on file for the next season we open
            there.
          </p>
        </section>

        <section className="section-y-sm container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">What we look for</h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
            Carnival morning is not a salon day. Chairs run back to back from the early hours,
            every client leaves for the road, and the work has to hold through heat, sweat, paint
            and a full day of jumping. We look for artists who are fast without cutting corners,
            strictly hygienic with their kit, comfortable working to a schedule alongside a large
            team, and warm with clients who are nervous, jet lagged or running late.
          </p>
        </section>

        <section className="section-y-sm container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How to apply</h2>
          <ol className="mt-5 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="font-display text-lg font-bold text-primary">{i + 1}</span>
                <div>
                  <p className="font-display text-base font-bold sm:text-lg">{step.title}</p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 font-body text-sm font-semibold text-primary-foreground"
            >
              Apply on WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Join%20the%20team`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-6 font-body text-sm font-semibold"
            >
              Email {CONTACT_EMAIL}
            </a>
          </div>
        </section>

        <section className="section-y-sm container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Bringing your own clients instead
          </h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground sm:text-base">
            If you would rather work independently and keep your own bookings, you can rent a
            station inside the Hub instead of joining the crew. Rates, what is provided and which
            territories are open are all on the{" "}
            <Link to="/station-rentals" className="underline">
              station rentals page
            </Link>
            .
          </p>
        </section>

        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <RelatedLinks
            services={[
              { to: "/services/carnival-makeup", label: "Sweat-resistant Carnival makeup" },
              { to: "/services/carnival-hair", label: "Carnival hair and hairstyles" },
              { to: "/services/carnival-photoshoot", label: "Carnival photoshoot" },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinOurTeam;
