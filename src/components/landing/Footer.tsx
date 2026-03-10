const Footer = () => (
  <footer id="contact" className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-lg font-bold mb-4">
            Carnival Glam Hub
          </h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Premium carnival morning preparation since 2017.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wider">
            Contact
          </h4>
          <div className="space-y-2 font-body text-sm text-muted-foreground">
            <p>hello@carnivalglamhub.com</p>
            <p>+1 (876) 555-0123</p>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wider">
            Follow
          </h4>
          <a
            href="https://instagram.com/carnivalglamhub"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
            Instagram →
          </a>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wider">
            Legal
          </h4>
          <div className="space-y-2 font-body text-sm text-muted-foreground">
            <p className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</p>
            <p className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-10 pt-6 text-center">
        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} Carnival Glam Hub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
