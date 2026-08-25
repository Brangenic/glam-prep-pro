import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import amazonLogo from "@/assets/amazon-logo.svg";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AMAZON_STORE_URL } from "@/lib/constants";

type StoreItem = {
  external_id: string;
  title: string;
  image_url: string | null;
  product_url: string;
};

const AmazonStore = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { data } = await supabase
        .from("amazon_products")
        .select("external_id, title, image_url, product_url")
        .order("synced_at", { ascending: false });

      if (isMounted) {
        setItems((data as StoreItem[]) ?? []);
        setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Carnival Glam Hub Amazon Storefront",
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        // Amazon affiliate items: price is set by Amazon and changes,
        // so we do NOT emit Product+Offer markup (invalid Offer without a
        // real `price` is worse for SEO than none). Ship a plain
        // ItemList of links instead — Rich Results-valid and honest.
        url: item.product_url,
        name: item.title,
        image: item.image_url ?? undefined,
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "amazon-store-itemlist-jsonld";
    script.textContent = JSON.stringify(itemListSchema);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section
          className="py-14 sm:py-18 lg:py-20"
          aria-labelledby="amazon-store-page-heading"
        >
          <div ref={ref} className="container mx-auto px-4 sm:px-6 max-w-6xl">
            {/* Header */}
            <header
              className={`mb-10 sm:mb-14 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <img
                  src={amazonLogo}
                  alt="Amazon logo"
                  width={603}
                  height={182}
                  className="h-5 w-auto opacity-70"
                  loading="lazy"
                />
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium">
                  Carnival Glam Hub Storefront
                </p>
              </div>

              <h1
                id="amazon-store-page-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-4 sm:mb-5"
              >
                Carnival Must-Haves &{" "}
                <span className="italic text-gradient-primary">
                  Road Ready Gear
                </span>
              </h1>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Browse our curated Amazon collections — tap any category to
                explore all the items inside.
              </p>
            </header>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card animate-pulse"
                  >
                    <div className="aspect-square bg-muted rounded-t-2xl" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <p className="font-body text-muted-foreground">
                  Products are loading. Check back shortly!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {items.map((item, i) => (
                  <a
                    key={item.external_id}
                    href={item.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 active:scale-[0.98] ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                    style={{
                      transitionDuration: "600ms",
                      transitionDelay: isVisible
                        ? `${200 + i * 80}ms`
                        : "0ms",
                    }}
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          width={800}
                          height={800}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-muted"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="p-5">
                      <h2 className="font-display text-lg font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                        {item.title}
                      </h2>
                      <p className="font-body text-sm text-muted-foreground">
                        Shop collection →
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div
              className={`mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
            >
              <a
                href={AMAZON_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
              >
                Browse Full Amazon Store
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-primary/30 px-7 py-3.5 font-body text-sm font-semibold text-primary transition-all hover:bg-primary/10 active:scale-[0.97]"
              >
                Back to Home
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default AmazonStore;
