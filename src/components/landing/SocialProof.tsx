const stats = [
  { value: "15,000+", label: "Clients Served" },
  { value: "Trusted", label: "By Carnival Bands & Influencers" },
  { value: "Pro Artists", label: "Professional Glam Team" },
  { value: "Premium", label: "Carnival Morning Experience" },
];

const SocialProof = () => (
  <section className="border-y border-primary/10 bg-primary/[0.03]">
    <div className="container mx-auto px-4 sm:px-6 section-y-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x divide-primary/15">
        {stats.map((s) => (
          <div key={s.label} className="text-center px-2 sm:px-4">
            <span className="font-display font-bold text-xl sm:text-2xl text-primary italic">
              {s.value}
            </span>
            <p className="font-body text-[11px] sm:text-xs text-muted-foreground mt-1 sm:mt-1.5 uppercase tracking-[0.15em] font-medium">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;