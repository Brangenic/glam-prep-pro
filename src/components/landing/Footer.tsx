import brandLogo from "@/assets/gabby-glam-logo.png";
import PreferredSourcesButton from "@/components/PreferredSourcesButton";
import { getUpcomingDestinations } from "@/data/seasons";
import { WHATSAPP_URL } from "@/lib/constants";

// The footer destination list shows upcoming Carnivals only. A season that
// has passed never appears as an onward option. Both Trinidad pages stay
// listed here because the footer doubles as the site map.
const FOOTER_LABELS: Record<string, string> = {
  "trinidad-carnival-2027": "Trinidad Carnival 2027 guide",
  "epic-cruise": "Epic Cruise",
};

const ATLANTA_ENQUIRY_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Hi Carnival Glam Hub, I would like to ask about Atlanta Carnival.",
)}`;
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

const Footer = () => {
  const footerDestinations = getUpcomingDestinations(undefined, undefined, {
    dedupeTrinidad: false,
  });

  return (
  <footer id="contact" className="border-t border-border section-y pb-28 lg:pb-16">
    <div className="container mx-auto px-4 sm:px-6">
      {/* Hub sitemap — every primary route is reachable from the footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-border">
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Services
          </h4>
          <ul className="space-y-0 font-body text-sm text-muted-foreground">
            <li><a href="/services/carnival-makeup" className="block py-3 leading-5 hover:text-primary transition-colors">Carnival makeup</a></li>
            <li><a href="/services/carnival-hair" className="block py-3 leading-5 hover:text-primary transition-colors">Carnival hair</a></li>
            <li><a href="/services/carnival-photoshoot" className="block py-3 leading-5 hover:text-primary transition-colors">Carnival photoshoot</a></li>
            <li><a href="/services/getting-dressed" className="block py-3 leading-5 hover:text-primary transition-colors">Getting dressed</a></li>
            <li><a href="/services/carnival-shuttle" className="block py-3 leading-5 hover:text-primary transition-colors">Carnival shuttle</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Destinations
          </h4>
          <ul className="space-y-0 font-body text-sm text-muted-foreground">
            {footerDestinations.map((d) => (
              <li key={d.slug}>
                <a href={d.path} className="block py-3 leading-5 hover:text-primary transition-colors">
                  {FOOTER_LABELS[d.slug] ?? d.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href={ATLANTA_ENQUIRY_URL}
                target="_blank"
                rel="noopener"
                className="block py-3 leading-5 hover:text-primary transition-colors"
              >
                Ask about Atlanta
              </a>
            </li>
          </ul>

          <p className="mt-4 font-body text-sm text-muted-foreground leading-relaxed">
            Full Service Glam Hubs: Jamaica, Trinidad, Miami. All other territories are Glam Hub Lite.
          </p>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Explore
          </h4>
          <ul className="space-y-0 font-body text-sm text-muted-foreground">
            <li><a href="/" className="block py-3 leading-5 hover:text-primary transition-colors">Home</a></li>
            <li><a href="/blogs" className="block py-3 leading-5 hover:text-primary transition-colors">Journal</a></li>
            <li><a href="/about" className="block py-3 leading-5 hover:text-primary transition-colors">About</a></li>
            <li><a href="/faq" className="block py-3 leading-5 hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="/press" className="block py-3 leading-5 hover:text-primary transition-colors">Press</a></li>
            <li><a href="/reviews" className="block py-3 leading-5 hover:text-primary transition-colors">Reviews</a></li>
            <li><a href="/amazon-store" className="block py-3 leading-5 hover:text-primary transition-colors">Amazon Store</a></li>
            <li><a href="/booking-calculator" className="block py-3 leading-5 hover:text-primary transition-colors">Booking Calculator</a></li>
            <li><a href="/station-rentals" className="block py-3 leading-5 hover:text-primary transition-colors">Station rentals for artists</a></li>
            <li><a href="/policies" className="block py-3 leading-5 hover:text-primary transition-colors">Terms and Policies</a></li>

          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 sm:col-span-1">
          <a href="/" className="inline-flex mb-4" aria-label="Carnival Glam Hub home">
            <img src={brandLogo} alt="Carnival Glam Hub" width={1318} height={1225} className="h-14 w-auto sm:h-16" loading="lazy" />
          </a>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Premium carnival morning preparation since 2017.
          </p>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Contact
          </h4>
          <div className="space-y-0 font-body text-sm text-muted-foreground">
            <p>Bookings@carnivalglamhub.com</p>
            <p>8765090997</p>
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-foreground/60">
            Follow
          </h4>
          <div>
            {socialLinks.map((link) =>
              isExternalLink(link.href) ? (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => openExternalLink(link.href)}
                  className="block w-full py-3 leading-5 font-body text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {link.label} →
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-3 leading-5 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
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
          <div className="space-y-0 font-body text-sm text-muted-foreground">
            <a href="/policies#terms" className="block py-3 leading-5 hover:text-primary transition-colors">Terms of Service</a>
            <a href="/policies#refunds" className="block py-3 leading-5 hover:text-primary transition-colors">Refund Policy</a>
            <a href="/policies#privacy" className="block py-3 leading-5 hover:text-primary transition-colors">Privacy Policy</a>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfatcdkmAEaPDXcB1XY-GYASAtqZpYCjH3Q97sZOhm0CkujYg/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 leading-5 hover:text-primary transition-colors"
            >
              Work at Glam Hub
            </a>
          </div>
          <div className="mt-6">
            <PreferredSourcesButton />
          </div>
        </div>

      </div>
      <div className="border-t border-border mt-10 sm:mt-12 pt-6 sm:pt-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          © {new Date().getFullYear()} Carnival Glam Hub. All rights reserved.
        </p>
      </div>
    </div>
    </footer>
  );
};

export default Footer;