import { useState, useEffect } from "react";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

const links = [
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-background/50" : "bg-transparent"}`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-18 py-4">
        <a href="#hero" className="font-display text-xl font-bold tracking-tight" aria-label="Carnival Glam Hub — Home">
          <span className="text-primary italic">Carnival</span>{" "}
          <span className="text-foreground">Glam Hub</span>
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
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
      </div>
      {open && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border px-6 py-6 space-y-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block font-body text-base text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block text-center bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-3 rounded-full"
          >
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;