import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import brandLogo from "@/assets/gabby-glam-logo.png";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const links: NavItem[] = [
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "Carnival Makeup", href: "/services/carnival-makeup" },
      { label: "Carnival Hair", href: "/services/carnival-hair" },
      { label: "Getting Dressed", href: "/services/getting-dressed" },
      { label: "Carnival Photoshoot", href: "/services/carnival-photoshoot" },
      { label: "Carnival Shuttle", href: "/services/carnival-shuttle" },
    ],
  },
  { label: "Destinations", href: "#destinations" },
  { label: "Trinidad 2027", href: "/trinidad-carnival-2027" },
  { label: "Quote", href: "/booking-calculator" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blogs" },
  {
    label: "More",
    href: "#",
    children: [
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "/reviews" },
      { label: "Amazon Store", href: "/amazon-store" },
      { label: "Station Rentals", href: "/station-rentals" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getLinkHref = (href: string) => {
    if (href.startsWith("#")) {
      return isHome ? href : `/${href}`;
    }

    return href;
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-background/50" : "bg-transparent"}`}
    >
      <nav aria-label="Primary" className="container mx-auto px-6 flex items-center justify-between min-h-20 py-3">
        <a href={isHome ? "#hero" : "/"} className="inline-flex items-center" aria-label="Carnival Glam Hub — Home">
          <img src={brandLogo} alt="Carnival Glam Hub" width={1318} height={1225} className="h-12 w-auto sm:h-14 lg:h-16" />
        </a>
        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) =>
            l.children ? (
              <div key={l.label} className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all">
                  <div className="min-w-[200px] bg-background/98 backdrop-blur-md border border-border rounded-xl shadow-xl py-2">
                    {l.children.map((c) => (
                      <a
                        key={c.href}
                        href={getLinkHref(c.href)}
                        className="block px-4 py-2 font-body text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={l.href}
                href={getLinkHref(l.href)}
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ),
          )}
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
            className="bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Book Now
          </a>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border px-6 py-6 space-y-4">
          {links.map((l) =>
            l.children ? (
              <div key={l.label} className="space-y-2">
                <div className="font-body text-xs uppercase tracking-widest text-primary/80 font-semibold pt-2">
                  {l.label}
                </div>
                {l.children.map((c) => (
                  <a
                    key={c.href}
                    href={getLinkHref(c.href)}
                    onClick={() => setOpen(false)}
                    className="block pl-3 font-body text-base text-muted-foreground hover:text-primary transition-colors"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            ) : (
              <a
                key={l.href}
                href={getLinkHref(l.href)}
                onClick={() => setOpen(false)}
                className="block font-body text-base text-muted-foreground hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ),
          )}
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
              setOpen(false);
            }}
            className="block text-center bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-3 rounded-full"
          >
            Book Now
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;