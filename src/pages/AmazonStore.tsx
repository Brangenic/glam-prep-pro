import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const AMAZON_STORE_URL = "https://www.amazon.com/shop/carnivalglamhub?ccs_id=7e98f14b-a852-49d9-a50d-4fb90fee34c8";

const categories = [
  "Carnival prep essentials",
  "Beauty and glam tools",
  "Travel and packing staples",
  "Road-day extras",
];

const AmazonStore = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-28 sm:pt-32">
      <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="amazon-store-page-heading">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
                Carnival Amazon Store
              </p>
              <h1 id="amazon-store-page-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 sm:mb-6">
                Shop our <span className="italic text-gradient-primary">favorite finds</span>
              </h1>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 sm:mb-10 max-w-2xl">
                We pulled together a dedicated store with beauty favorites, prep must-haves, travel helpers, and carnival extras so you can grab what you need faster.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {categories.map((category) => (
                  <div key={category} className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5 sm:py-5">
                    <p className="font-body text-sm text-foreground/85">{category}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={AMAZON_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3.5 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Open Amazon Store
                </a>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3.5 font-body text-sm font-semibold text-primary transition-all hover:bg-primary/10"
                >
                  Back to Home
                </a>
              </div>
            </div>

            <aside className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-secondary font-semibold mb-4">
                Why shop here
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="font-display text-lg font-bold mb-1">Curated picks</p>
                  <p className="font-body text-sm text-muted-foreground">Products selected around the carnival prep experience your clients actually need.</p>
                </div>
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="font-display text-lg font-bold mb-1">Quick shopping</p>
                  <p className="font-body text-sm text-muted-foreground">A single place to send people when they ask what to bring, wear, or pack.</p>
                </div>
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="font-display text-lg font-bold mb-1">Road-ready extras</p>
                  <p className="font-body text-sm text-muted-foreground">Perfect for beauty touch-ups, travel organization, and carnival morning convenience.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <StickyMobileCTA />
  </div>
);

export default AmazonStore;
