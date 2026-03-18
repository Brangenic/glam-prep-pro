import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import amazonLogo from "@/assets/amazon-logo.svg";
import { supabase } from "@/integrations/supabase/client";

const AMAZON_STORE_URL = "https://www.amazon.com/shop/carnivalglamhub?ccs_id=7e98f14b-a852-49d9-a50d-4fb90fee34c8";
const PREVIEW_ITEMS_PER_CATEGORY = 4;

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
const isDirectAmazonProductUrl = (value: string) => /amazon\.com\/.+\/(dp|gp\/product)\//i.test(value);

const AmazonStore = () => {
  const [products, setProducts] = useState<SyncedProduct[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      const { data } = await supabase
        .from("amazon_products")
        .select("external_id, title, price_text, image_url, product_url, category")
        .order("category", { ascending: true })
        .order("synced_at", { ascending: false });

      if (!isMounted || !data?.length) return;
      setProducts(data as SyncedProduct[]);
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const { categorySections, hasDirectProducts } = useMemo(() => {
    const validCategorizedProducts = products.filter((product) =>
      isValidCategory(normalizeCategory(product.category)),
    );

    const directProductRows = validCategorizedProducts.filter((product) =>
      isDirectAmazonProductUrl(product.product_url),
    );

    const sourceRows = directProductRows.length > 0 ? directProductRows : validCategorizedProducts;
    const grouped = new Map<string, SyncedProduct[]>();

    sourceRows.forEach((product) => {
      const category = normalizeCategory(product.category);
      const existing = grouped.get(category) ?? [];
      if (existing.some((item) => item.external_id === product.external_id)) return;
      existing.push(product);
      grouped.set(category, existing);
    });

    return {
      hasDirectProducts: directProductRows.length > 0,
      categorySections: Array.from(grouped.entries())
        .map(([category, items]) => ({
          category,
          items,
          previewItems: items.slice(0, PREVIEW_ITEMS_PER_CATEGORY),
        }))
        .sort((a, b) => a.category.localeCompare(b.category)),
    };
  }, [products]);

  const totalPreviewProducts = useMemo(
    () => categorySections.reduce((sum, section) => sum + section.previewItems.length, 0),
    [categorySections],
  );

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
                See a few featured picks from each category here, then open the full Amazon store to browse everything.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="font-body text-sm text-muted-foreground">
                  Showing <span className="text-foreground font-semibold">{totalPreviewProducts}</span> featured products across{" "}
                  <span className="text-foreground font-semibold">{categorySections.length}</span> categories
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={AMAZON_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                  >
                    View More in Full Store
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

            {categorySections.length ? (
              <div className="space-y-10 sm:space-y-12">
                {categorySections.map(({ category, items, previewItems }) => {
                  const sectionId = `category-${category.toLowerCase().replace(/\s+/g, "-")}`;

                  return (
                    <section key={category} aria-labelledby={sectionId} className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                        <div>
                          <h2 id={sectionId} className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                            {category}
                          </h2>
                          <p className="font-body text-sm text-muted-foreground mt-1">
                            Showing {previewItems.length} of {items.length} products
                          </p>
                        </div>
                        <a
                          href={AMAZON_STORE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 font-body text-sm font-semibold text-primary transition-all hover:bg-primary/10"
                        >
                          View more
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {previewItems.map((product) => (
                          <article key={product.external_id} className="rounded-2xl border border-border bg-background overflow-hidden">
                            <div className="px-3 pt-3">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.title}
                                  className="w-full aspect-[4/3] object-cover rounded-xl border border-border"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full aspect-[4/3] rounded-xl border border-border bg-muted" aria-hidden="true" />
                              )}
                            </div>

                            <div className="p-4 sm:p-5">
                              <h3 className="font-body text-sm font-semibold text-foreground mb-2 line-clamp-2 min-h-[2.6rem]">
                                {product.title}
                              </h3>
                              <p className="font-body text-sm text-muted-foreground">
                                {product.price_text || "Available in full store"}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="font-body text-sm text-muted-foreground">
                  Products are updating right now. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default AmazonStore;
