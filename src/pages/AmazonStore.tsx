import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import amazonLogo from "@/assets/amazon-logo.svg";
import { supabase } from "@/integrations/supabase/client";

const AMAZON_STORE_URL = "https://www.amazon.com/shop/carnivalglamhub?ccs_id=7e98f14b-a852-49d9-a50d-4fb90fee34c8";

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
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let isMounted = true;

    const syncAndLoadProducts = async () => {
      void supabase.functions.invoke("sync-public-content", {
        body: { source: "amazon_store" },
      });

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

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(products.map((item) => item.category).filter(Boolean))) as string[];
    return ["All", ...dynamic];
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="py-14 sm:py-18 lg:py-20" aria-labelledby="amazon-store-page-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <header className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10">
              <div className="flex items-center gap-3 mb-4">
                <img src={amazonLogo} alt="Amazon logo" className="h-6 w-auto" loading="lazy" />
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium">
                  Carnival Amazon Store
                </p>
              </div>

              <h1 id="amazon-store-page-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-5">
                Shop the <span className="italic text-gradient-primary">Glam Hub Storefront</span>
              </h1>
              <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-6 sm:mb-7">
                Browse synced products from all available Carnival Glam Hub Amazon lists — refreshed daily for prep essentials, beauty tools, travel gear, and road-day extras.
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                {categories.map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full border px-4 py-2 font-body text-xs sm:text-sm font-semibold transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/30"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="font-body text-sm text-muted-foreground">
                  Showing <span className="text-foreground font-semibold">{visibleProducts.length}</span> products
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={AMAZON_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    Open Full Amazon Store
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3 font-body text-sm font-semibold text-primary transition-all hover:bg-primary/10"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {visibleProducts.map((product) => (
                <article key={product.external_id} className="rounded-2xl border border-border bg-card overflow-hidden group">
                  <div className="px-3 pt-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full aspect-[4/3] object-cover rounded-xl border border-border transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] rounded-xl border border-border bg-muted" aria-hidden="true" />
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    {product.category ? (
                      <p className="font-body text-[11px] uppercase tracking-[0.14em] text-secondary mb-2">{product.category}</p>
                    ) : null}
                    <h2 className="font-body text-sm font-semibold text-foreground mb-2 line-clamp-2 min-h-[2.6rem]">{product.title}</h2>
                    <p className="font-body text-sm text-muted-foreground mb-4">{product.price_text || "View on Amazon"}</p>
                    <a
                      href={product.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full border border-primary/30 px-4 py-2.5 font-body text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                    >
                      View product
                    </a>
                  </div>
                </article>
              ))}
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
