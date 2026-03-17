const Footer = () => (
  <footer id="contact" className="border-t border-border py-12 sm:py-16 pb-28 lg:pb-16">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 sm:col-span-1">
          <h3 className="font-display text-xl font-bold mb-4">
            <span className="text-primary italic">Carnival</span>{" "}
            <span className="text-foreground">Glam Hub</span>
          </h3>
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
          <a
            href="https://instagram.com/carnivalglamhub"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Instagram →
          </a>
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