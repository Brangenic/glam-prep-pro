const stats = [
  { value: "13,000+", label: "Masqueraders Since 2017" },
  { value: "Trusted", label: "By Carnival Bands & Influencers" },
  { value: "Pro", label: "Professional Glam Artists" },
  { value: "Premium", label: "Carnival Morning Experience" },
];

const SocialProof = () => (
  <section className="border-y border-border bg-card/50">
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-border">
        {stats.map((s) => (
          <div key={s.label} className="text-center px-4">
            <span className="font-display font-extrabold text-xl text-primary">
              {s.value}
            </span>
            <p className="font-body text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
