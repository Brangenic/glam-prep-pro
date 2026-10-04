import { useState } from "react";
import brandLogo from "@/assets/gabby-glam-logo.png";
import PreferredSourcesButton from "@/components/PreferredSourcesButton";
import { getUpcomingDestinations } from "@/data/seasons";
import { openCookieSettings } from "@/components/CookieConsent";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  WHATSAPP_URL,
} from "@/lib/constants";

/*
 * Dense five column footer. Information architecture first, styling stays
 * on the existing cream, black and gold tokens.
 *
 * The destination column runs through getUpcomingDestinations under the
 * ONWARD DESTINATION RULE, so a wrapped Carnival never appears here. Never
 * hardcode a destination list in this file.
 */

const FOOTER_LABELS: Record<string, string> = {
  "trinidad-carnival-2027": "Trinidad Carnival 2027 Guide",
  "epic-cruise": "Epic Cruise",
};

const ATLANTA_ENQUIRY_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Hi Carnival Glam Hub, I would like to ask about Atlanta Carnival.",
)}`;

type FooterLink = { label: string; href: string; external?: boolean };

const SERVICES: FooterLink[] = [
  { label: "Carnival Makeup", href: "/services/carnival-makeup" },
  { label: "Carnival Hair", href: "/services/carnival-hair" },
  { label: "Carnival Photoshoots", href: "/services/carnival-photoshoot" },
  { label: "Getting Dressed", href: "/services/getting-dressed" },
  { label: "Carnival Shuttle", href: "/services/carnival-shuttle" },
];

const PLAN_AND_EXPLORE: FooterLink[] = [
  { label: "Blog", href: "/blogs" },
  { label: "FAQ", href: "/faq" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Press", href: "/press" },
  { label: "Book your Hilton slot", href: "/trinidad/book" },
  { label: "Booking Calculator", href: "/booking-calculator" },
  { label: "Amazon Store", href: "/amazon-store" },
];

// Become a Partner or Franchise is deliberately absent. No such page
// exists in the route table, and we never link a footer item at a 404.
const WORK_WITH_US: FooterLink[] = [
  { label: "Work at Glam Hub", href: "/joinourteam" },
  { label: "Rent a Station", href: "/station-rentals" },
];

type SocialLink = { label: string; href: string; path: string };

const SOCIALS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/carnivalglamhub",
    path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.37 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.22.6-.48 1-.9 1.4-.4.42-.8.68-1.4.9-.4.17-1 .37-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.22-1-.48-1.4-.9-.42-.4-.68-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.99-11.4a1.58 1.58 0 1 1-1.58-1.58 1.58 1.58 0 0 1 1.58 1.58Z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@carnivalglamhub",
    path: "M16.5 2h-3v13.1a2.6 2.6 0 1 1-2.1-2.55V9.4a5.9 5.9 0 1 0 5.1 5.85V8.9a6.6 6.6 0 0 0 3.9 1.26V7.1a3.7 3.7 0 0 1-3.9-3.6V2Z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@carnivalglamhub",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1Z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/carnivalglamhub",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/carnivalglamhub",
    path: "M12 2a10 10 0 0 0-3.65 19.31 9.6 9.6 0 0 1 .04-2.3c.12-.53.8-3.4.8-3.4a2.47 2.47 0 0 1-.2-1.02c0-.96.55-1.68 1.25-1.68.59 0 .87.44.87.97 0 .6-.38 1.48-.57 2.3a1 1 0 0 0 1.03 1.25c1.23 0 2.18-1.3 2.18-3.18a2.74 2.74 0 0 0-2.9-2.83 3 3 0 0 0-3.14 3.01 2.7 2.7 0 0 0 .52 1.58.2.2 0 0 1 .05.2c-.05.22-.17.7-.2.8-.03.13-.11.16-.25.1-.94-.44-1.53-1.82-1.53-2.93 0-2.38 1.73-4.57 5-4.57a4.44 4.44 0 0 1 4.66 4.37c0 2.6-1.64 4.7-3.92 4.7a2.02 2.02 0 0 1-1.73-.87l-.47 1.8a8.4 8.4 0 0 1-.95 2A10 10 0 1 0 12 2Z",
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    path: "M12 2a10 10 0 0 0-8.5 15.26L2 22l4.86-1.45A10 10 0 1 0 12 2Zm0 18.1a8.06 8.06 0 0 1-4.1-1.13l-.3-.18-2.9.86.87-2.83-.19-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-5.86c-.24-.13-1.44-.72-1.66-.8-.22-.08-.38-.12-.55.13-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.95-1.2 7.3 7.3 0 0 1-1.35-1.67c-.14-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.24-.41a.45.45 0 0 0-.02-.44c-.06-.12-.55-1.33-.76-1.82-.2-.47-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.72 2.72 0 0 0-.85 2.02 4.72 4.72 0 0 0 1 2.5 10.8 10.8 0 0 0 4.13 3.63c.58.25 1.03.4 1.38.51a3.3 3.3 0 0 0 1.52.1 2.5 2.5 0 0 0 1.62-1.15 2 2 0 0 0 .14-1.14c-.06-.1-.22-.16-.46-.28Z",
  },
];

const linkClass =
  "flex min-h-[44px] items-center font-body text-sm text-muted-foreground hover:text-primary transition-colors";

const FooterList = ({ links }: { links: FooterLink[] }) => (
  <ul>
    {links.map((l) => (
      <li key={l.href + l.label}>
        <a
          href={l.href}
          className={linkClass}
          {...(l.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {l.label}
        </a>
      </li>
    ))}
  </ul>
);

const SocialRow = () => (
  <div className="flex flex-wrap gap-2">
    {SOCIALS.map((s) => (
      <a
        key={s.label}
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Carnival Glam Hub on ${s.label}`}
        title={s.label}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path d={s.path} />
        </svg>
      </a>
    ))}
  </div>
);

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="font-body text-xs font-semibold mb-2 uppercase tracking-[0.15em] text-foreground/60">
    {children}
  </h4>
);

/** Mobile accordion. Collapsed by default, every one of them. */
const Accordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-body text-sm font-semibold uppercase tracking-[0.15em] text-foreground/80"
      >
        {title}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
};

const Footer = () => {
  const footerDestinations = getUpcomingDestinations(undefined, undefined, {
    dedupeTrinidad: false,
  });

  const destinationLinks: FooterLink[] = [
    ...footerDestinations.map((d) => ({
      label: FOOTER_LABELS[d.slug] ?? d.name,
      href: d.path,
    })),
    { label: "Ask about Atlanta", href: ATLANTA_ENQUIRY_URL, external: true },
    { label: "View All Destinations", href: "/#destinations" },
  ];

  const brand = (
    <div>
      <a href="/" className="inline-flex mb-2" aria-label="Carnival Glam Hub home">
        <img
          src={brandLogo}
          alt="Carnival Glam Hub"
          width={1318}
          height={1225}
          className="h-10 w-auto"
          loading="lazy"
        />
      </a>
      <p className="font-heading text-base text-foreground">Carnival morning, handled.</p>
      <p className="font-body text-sm text-muted-foreground leading-snug mt-1">
        Makeup, hair, photos, getting dressed and more across the Carnival circuit.
      </p>
      <div className="mt-2 font-body text-sm">
        <a href={`mailto:${CONTACT_EMAIL}`} className="flex min-h-[44px] items-center text-muted-foreground hover:text-primary transition-colors break-all">
          {CONTACT_EMAIL}
        </a>
        <a href={CONTACT_PHONE_HREF} className="flex min-h-[44px] items-center text-muted-foreground hover:text-primary transition-colors">
          {CONTACT_PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );

  return (
    <footer id="contact" className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 section-y-sm pb-56 lg:pb-8">
        {/* Desktop and tablet: five dense columns beside the brand block */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6">
          <div className="lg:col-span-1 md:col-span-3">{brand}</div>
          <div>
            <ColumnHeading>Services</ColumnHeading>
            <FooterList links={SERVICES} />
          </div>
          <div>
            <ColumnHeading>Destinations</ColumnHeading>
            <FooterList links={destinationLinks} />
          </div>
          <div>
            <ColumnHeading>Plan &amp; Explore</ColumnHeading>
            <FooterList links={PLAN_AND_EXPLORE} />
          </div>
          <div>
            <ColumnHeading>Work With Us</ColumnHeading>
            <FooterList links={WORK_WITH_US} />
          </div>
          <div>
            <ColumnHeading>Connect</ColumnHeading>
            <SocialRow />
          </div>
        </div>

        {/* Mobile: compact brand, then collapsed accordions */}
        <div className="md:hidden">
          {brand}
          <div className="mt-3 border-t border-border">
            <Accordion title="Services">
              <FooterList links={SERVICES} />
            </Accordion>
            <Accordion title="Destinations">
              <FooterList links={destinationLinks} />
            </Accordion>
            <Accordion title="Plan &amp; Explore">
              <FooterList links={PLAN_AND_EXPLORE} />
            </Accordion>
            <Accordion title="Work With Us">
              <FooterList links={WORK_WITH_US} />
            </Accordion>
            <Accordion title="Connect">
              <SocialRow />
            </Accordion>
          </div>
        </div>

        {/* Utility row, one compact line that wraps naturally */}
        <div className="mt-4 border-t border-border pt-3">
          {/* Left inset keeps the utility row clear of the fixed Ask JADE launcher. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm text-muted-foreground pl-0 lg:pl-44">
            <span>© {new Date().getFullYear()} Carnival Glam Hub</span>
            <span aria-hidden="true">·</span>
            <a href="/policies#terms" className="inline-flex min-h-[44px] items-center hover:text-primary transition-colors">Terms</a>
            <span aria-hidden="true">·</span>
            <a href="/policies#privacy" className="inline-flex min-h-[44px] items-center hover:text-primary transition-colors">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="/policies#refunds" className="inline-flex min-h-[44px] items-center hover:text-primary transition-colors">Refund Policy</a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={openCookieSettings}
              className="inline-flex min-h-[44px] items-center hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Cookie settings
            </button>

            <span aria-hidden="true">·</span>
            <PreferredSourcesButton compact />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
