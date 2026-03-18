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

const normalizeCategory = (value: string | null) => value?.trim() || "";
const isValidCategory = (value: string) => value !== "" && value.toLowerCase() !== "n/a";

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

  const categorySections = useMemo(() => {
    const grouped = new Map<string, SyncedProduct[]>();

    products.forEach((product) => {
      const category = normalizeCategory(product.category);
      if (!isValidCategory(category)) return;

      const existing = grouped.get(category) ?? [];
      existing.push(product);
      grouped.set(category, existing);
    });

    return Array.from(grouped.entries())
      .map(([category, items]) => ({ category, items }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [products]);

  const totalProducts = useMemo(
    () => categorySections.reduce((sum, section) => sum + section.items.length, 0),
    [categorySections],
  );
...
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="font-body text-sm text-muted-foreground">
                  Showing <span className="text-foreground font-semibold">{totalProducts}</span> products in{" "}
                  <span className="text-foreground font-semibold">{categorySections.length}</span> categories
                </p>
...
            <div className="space-y-10 sm:space-y-12">
              {categorySections.map(({ category, items }) => (
                <section key={category} aria-labelledby={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 id={`category-${category.toLowerCase().replace(/\s+/g, "-")}`} className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                      {category}
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground">
                      {items.length} products
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {items.map((product) => (
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
                          <h3 className="font-body text-sm font-semibold text-foreground mb-2 line-clamp-2 min-h-[2.6rem]">{product.title}</h3>
                          <p className="font-body text-sm text-muted-foreground mb-4">{product.price_text || "View on Amazon"}</p>
                          <a
                            href={product.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-full border border-primary/30 px-4 py-2.5 font-body text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                          >
                            View products
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
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
