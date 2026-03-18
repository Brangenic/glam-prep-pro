import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import amazonLogo from "@/assets/amazon-logo.svg";
import { supabase } from "@/integrations/supabase/client";

const AMAZON_STORE_URL = "https://www.amazon.com/shop/carnivalglamhub?ccs_id=7e98f14b-a852-49d9-a50d-4fb90fee34c8";

const categories = [
  "Carnival prep essentials",
  "Beauty and glam tools",
  "Travel and packing staples",
  "Road-day extras",
];

type SyncedProduct = {
  external_id: string;
  title: string;
  price_text: string | null;
  image_url: string | null;
  product_url: string;
  category: string | null;
};

const AmazonStore = () => {
  const [products, setProducts] = useState<SyncedProduct[]>([]);

  useEffect(() => {
    let isMounted = true;

    const syncAndLoadProducts = async () => {
      await supabase.functions.invoke("sync-public-content", {
        body: { source: "amazon_store" },
      }).catch(() => null);

      const { data } = await supabase
        .from("amazon_products")
        .select("external_id, title, price_text, image_url, product_url, category")
        .order("synced_at", { ascending: false });

      if (!isMounted || !data?.length) return;
      setProducts(data as SyncedProduct[]);
    };

    syncAndLoadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedProducts = useMemo(() => products.slice(0, 24), [products]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="amazon-store-page-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img src={amazonLogo} alt="Amazon logo" className="h-5 w-auto" loading="lazy" />
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium">
                    Carnival Amazon Store
                  </p>
                </div>

                <h1 id="amazon-store-page-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 sm:mb-6">
                  Shop our <span className="italic text-gradient-primary">favorite finds</span>
                </h1>
                <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 sm:mb-10 max-w-2xl">
                  We sync product picks from our storefront daily, so you can browse current prep must-haves, glam tools, and travel extras in one place.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                  {categories.map((category) => (
                    <div key={category} className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5 sm:py-5">
                      <p className="font-body text-sm text-foreground/85">{category}</p>
                    </div>
                  ))}
                </div>

                {groupedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
                    {groupedProducts.map((product) => (
                      <article key={product.external_id} className="rounded-2xl border border-border bg-card p-4">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full aspect-[4/3] object-cover rounded-xl border border-border mb-3"
                            loading="lazy"
                          />
                        ) : null}
                        <p className="font-body text-sm font-semibold text-foreground mb-1 line-clamp-2">{product.title}</p>
                        {product.price_text ? (
                          <p className="font-body text-xs text-muted-foreground mb-3">{product.price_text}</p>
                        ) : null}
                        <a
                          href={product.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-primary/30 px-4 py-2 font-body text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                        >
                          View product
                        </a>
                      </article>
                    ))}
                  </div>
                )}

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
                    <p className="font-display text-lg font-bold mb-1">Daily synced products</p>
                    <p className="font-body text-sm text-muted-foreground">New or updated storefront products are pulled automatically every 24 hours.</p>
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
};

export default AmazonStore;
