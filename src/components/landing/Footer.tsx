import brandLogo from "@/assets/gabby-glam-logo.png";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/carnivalglamhub",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/carnivalglamhub",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@carnivalglamhub",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@carnivalglamhub/shorts",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/carnivalglamhub",
  },
  {
    label: "WhatsApp Chat",
    href: "https://wa.me/18765090997?text=Hi%20Carnival%20Glam%20Hub",
  },
  {
    label: "Carnival Amazon Store",
    href: "/amazon-store",
  },
];

const isExternalLink = (href: string) => href.startsWith("http");

const openExternalLink = (href: string) => {
  const topWindow = window.top;

  if (topWindow && topWindow !== window) {
    topWindow.location.href = href;
    return;
  }

  const newWindow = window.open(href, "_blank", "noopener,noreferrer");

  if (newWindow) {
    newWindow.opener = null;
    return;
  }

  window.location.href = href;
};

const Footer = () => (
  <footer id="contact" className="border-t border-border py-12 sm:py-16 pb-28 lg:pb-16">
    <div className="container mx-auto px-4 sm:px-6">
      {/* Hub sitemap — every primary route is reachable from the footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-border">
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Services
          </h4>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li><a href="/services/carnival-makeup" className="hover:text-primary transition-colors">Carnival makeup</a></li>
            <li><a href="/services/carnival-hair" className="hover:text-primary transition-colors">Carnival hair</a></li>
            <li><a href="/services/carnival-photoshoot" className="hover:text-primary transition-colors">Carnival photoshoot</a></li>
            <li><a href="/services/getting-dressed" className="hover:text-primary transition-colors">Getting dressed</a></li>
            <li><a href="/services/carnival-shuttle" className="hover:text-primary transition-colors">Carnival shuttle</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Destinations
          </h4>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li><a href="/trinidad" className="hover:text-primary transition-colors">Trinidad Carnival</a></li>
            <li><a href="/trinidad-carnival-2027" className="hover:text-primary transition-colors">Trinidad Carnival 2027</a></li>
            <li><a href="/jamaica" className="hover:text-primary transition-colors">Jamaica Carnival</a></li>
            <li><a href="/barbados" className="hover:text-primary transition-colors">Barbados Crop Over</a></li>
            <li><a href="/grenada" className="hover:text-primary transition-colors">Grenada Spicemas</a></li>
            <li><a href="/saint-lucia" className="hover:text-primary transition-colors">Saint Lucia Carnival</a></li>
            <li><a href="/antigua" className="hover:text-primary transition-colors">Antigua Carnival</a></li>
            <li><a href="/miami" className="hover:text-primary transition-colors">Miami Carnival</a></li>
            <li><a href="/toronto" className="hover:text-primary transition-colors">Toronto Caribana</a></li>
            <li><a href="/guyana" className="hover:text-primary transition-colors">Guyana Carnival</a></li>
            <li><a href="/epic-cruise" className="hover:text-primary transition-colors">Epic Cruise</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Explore
          </h4>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="/blogs" className="hover:text-primary transition-colors">Journal</a></li>
            <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="/reviews" className="hover:text-primary transition-colors">Reviews</a></li>
            <li><a href="/amazon-store" className="hover:text-primary transition-colors">Amazon Store</a></li>
            <li><a href="/booking-calculator" className="hover:text-primary transition-colors">Booking Calculator</a></li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 sm:col-span-1">
          <a href="/" className="inline-flex mb-4" aria-label="Carnival Glam Hub home">
            <img src={brandLogo} alt="Carnival Glam Hub" className="h-14 w-auto sm:h-16" loading="lazy" />
          </a>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Premium carnival morning preparation since 2017.
          </p>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Contact
          </h4>
          <div className="space-y-2 font-body text-sm text-muted-foreground">
            <p>Bookings@carnivalglamhub.com</p>
            <p>8765090997</p>
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Follow
          </h4>
          <div className="space-y-2">
            {socialLinks.map((link) =>
              isExternalLink(link.href) ? (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => openExternalLink(link.href)}
                  className="block font-body text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {link.label} →
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="block font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label} →
                </a>
              ),
            )}
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Legal
          </h4>
          <div className="space-y-2 font-body text-sm text-muted-foreground">
            <p className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</p>
            <p className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfatcdkmAEaPDXcB1XY-GYASAtqZpYCjH3Q97sZOhm0CkujYg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-primary transition-colors"
            >
              Work at Glam Hub
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-10 sm:mt-12 pt-6 sm:pt-8 text-center">
        <p className="font-body text-xs text-muted-foreground mb-3">
          <a
            href="https://www.google.com/preferences/source?q=https://www.carnivalglamhub.com"
            target="_blank"
            rel="noopener"
            className="hover:text-primary transition-colors"
          >
            Follow us on Google — add Carnival Glam Hub as a preferred source →
          </a>
        </p>
        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} Carnival Glam Hub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;