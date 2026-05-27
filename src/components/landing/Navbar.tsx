import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import brandLogo from "@/assets/gabby-glam-logo.png";

const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

const links = [
  { label: "Services", href: "#services" },
  { label: "Makeup", href: "/services/carnival-makeup" },
  { label: "Photoshoot", href: "/services/carnival-photoshoot" },
  { label: "Destinations", href: "#destinations" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Amazon Store", href: "/amazon-store" },
  { label: "Blog", href: "/blogs" },
  { label: "FAQ", href: "#faq" },
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-background/50" : "bg-transparent"}`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 flex items-center justify-between min-h-24 py-4">
        <a href={isHome ? "#hero" : "/"} className="inline-flex items-center" aria-label="Carnival Glam Hub — Home">
          <img src={brandLogo} alt="Carnival Glam Hub" className="h-16 w-auto sm:h-20 lg:h-24" />
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={getLinkHref(l.href)}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
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
      </div>
      {open && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border px-6 py-6 space-y-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={getLinkHref(l.href)}
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
    </nav>
  );
};

export default Navbar;