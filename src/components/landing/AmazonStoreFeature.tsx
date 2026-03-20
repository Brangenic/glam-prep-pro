import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const AMAZON_STORE_URL = "https://www.amazon.com/shop/carnivalglamhub?ccs_id=7e98f14b-a852-49d9-a50d-4fb90fee34c8";

const highlights = [
  "Carnival essentials in one place",
  "Travel-friendly beauty picks",
  "Road-ready accessories and prep items",
];

type FeaturedProduct = {
  external_id: string;
  title: string;
  price_text: string | null;
  image_url: string | null;
  product_url: string;
};

const isDirectAmazonProductUrl = (value: string) => /amazon\.com\/.+\/(dp|gp\/product)\//i.test(value);
const getFeaturedProductHref = (productUrl: string) =>
  isDirectAmazonProductUrl(productUrl) ? productUrl : AMAZON_STORE_URL;

const AmazonStoreFeature = () => {
  const { ref, isVisible } = useScrollReveal();
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      const { data } = await supabase
        .from("amazon_products")
        .select("external_id, title, price_text, image_url, product_url")
        .order("synced_at", { ascending: false })
        .limit(3);

      if (!isMounted || !data?.length) return;
      setFeaturedProducts(data as FeaturedProduct[]);
    };

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="amazon-store" className="py-16 sm:py-24 lg:py-32 bg-card/50" aria-labelledby="amazon-store-heading">
      <div ref={ref} className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 lg:gap-12 items-stretch">
          <div
            className={`rounded-3xl border border-border bg-background p-6 sm:p-8 lg:p-10 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Carnival Amazon Store
            </p>
            <h2 id="amazon-store-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 sm:mb-6">
              Shop the <span className="italic text-gradient-primary">Prep List</span>
            </h2>
            <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mb-6 sm:mb-8">
              Explore our curated Amazon Store for carnival prep must-haves, glam tools, beauty favorites, travel basics, and extras that make the road easier.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-card px-4 py-4">
                  <p className="font-body text-sm text-foreground/85 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/amazon-store"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3.5 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                View Store Page
              </a>
              <a
                href={AMAZON_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3.5 font-body text-sm font-semibold text-primary transition-all hover:bg-primary/10"
              >
                Open Amazon Store
              </a>
            </div>
          </div>

          <div
            className={`rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 sm:p-8 lg:p-10 transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="rounded-[2rem] border border-border bg-card px-5 py-6 sm:px-6 sm:py-8 h-full flex flex-col justify-between">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.18em] text-secondary font-semibold mb-4">
                  Featured products
                </p>
                <div className="space-y-3 mb-6">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Top picks from the store.
                  </p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Three quick product links right from the homepage.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <a
                      key={product.external_id}
                      href={getFeaturedProductHref(product.product_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl bg-background px-3 py-3 border border-border transition-colors hover:border-primary/25"
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="h-14 w-14 shrink-0 rounded-lg object-cover border border-border"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-14 w-14 shrink-0 rounded-lg border border-border bg-muted" aria-hidden="true" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-body text-sm text-foreground line-clamp-2">{product.title}</p>
                        <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mt-1">
                          {product.price_text || "Shop"}
                        </p>
                      </div>
                    </a>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3 border border-border">
                      <span className="font-body text-sm text-foreground">Makeup favorites</span>
                      <span className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">Shop</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3 border border-border">
                      <span className="font-body text-sm text-foreground">Travel essentials</span>
                      <span className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">Shop</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3 border border-border">
                      <span className="font-body text-sm text-foreground">Carnival prep picks</span>
                      <span className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">Shop</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmazonStoreFeature;
