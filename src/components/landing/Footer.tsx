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
    href: "https://www.youtube.com/@carnivalglamhub",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/carnivalglamhub",
  },
  {
    label: "WhatsApp Chat",
    href: "https://wa.link/k63ryp",
  },
  {
    label: "Carnival Amazon Store",
    href: "/amazon-store",
  },
];

const isExternalLink = (href: string) => href.startsWith("http");

const openExternalLink = (href: string) => {
  const newWindow = window.open(href, "_blank", "noopener,noreferrer");

  if (newWindow) {
    newWindow.opener = null;
  }
};

const Footer = () => (
  <footer id="contact" className="border-t border-border py-12 sm:py-16 pb-28 lg:pb-16">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 sm:col-span-1">
          <a href="/" className="inline-flex mb-4" aria-label="Carnival Glam Hub home">
            <img src={brandLogo} alt="Carnival Glam Hub logo" className="h-14 w-auto sm:h-16" loading="lazy" />
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
            <p>hello@carnivalglamhub.com</p>
            <p>+1 (876) 555-0123</p>
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
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-10 sm:mt-12 pt-6 sm:pt-8 text-center">
        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} Carnival Glam Hub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;