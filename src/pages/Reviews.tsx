import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { featuredReviews, type ReviewItem } from "@/components/landing/reviewsData";
import { supabase } from "@/integrations/supabase/client";

const googleProfiles = [
  {
    location: "Jamaica",
    rating: 4.8,
    count: 18,
    url: "https://www.google.com/maps/place/Carnival+GLAM+HUB+Jamaica",
  },
  {
    location: "Trinidad",
    rating: 4.8,
    count: 24,
    url: "https://www.google.com/maps/search/Carnival+Glam+Hub+Trinidad+Port+of+Spain",
  },
  {
    location: "Saint Lucia",
    rating: 5.0,
    count: 1,
    url: "https://www.google.com/maps/search/Carnival+Glam+Hub+Saint+Lucia",
  },
];

type SyncedReview = {
  author_name: string | null;
  location: string | null;
  quote: string;
  rating: number | null;
  review_date: string | null;
};

type DisplayReview = ReviewItem & {
  rating?: number;
};

const Reviews = () => {
  const [syncedReviews, setSyncedReviews] = useState<DisplayReview[]>([]);

  useEffect(() => {
    let isMounted = true;

    const syncAndLoadReviews = async () => {
      void supabase.functions.invoke("sync-public-content", {
        body: { source: "google_reviews" },
      });

      const { data } = await supabase
        .from("google_reviews")
        .select("author_name, location, quote, rating, review_date")
        .order("synced_at", { ascending: false });

      if (!isMounted || !data?.length) return;

      const mapped = (data as SyncedReview[]).map((review) => ({
        quote: review.quote,
        name: review.author_name || "Google Reviewer",
        detail: review.review_date || "Google review",
        location: review.location || "Carnival Glam Hub",
        rating: review.rating ?? 5,
      }));

      setSyncedReviews(mapped);
    };

    syncAndLoadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const reviewsToRender = useMemo(
    () => (syncedReviews.length > 0 ? syncedReviews : featuredReviews),
    [syncedReviews],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <section className="pt-4 pb-8 sm:pb-12" aria-labelledby="google-ratings-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-8 sm:mb-10">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
                Google Business Profiles
              </p>
              <h2 id="google-ratings-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
                Rated <span className="italic text-gradient-primary">4.8 stars</span> across the Caribbean
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {googleProfiles.map((p) => (
                <a
                  key={p.location}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-border bg-card p-6 sm:p-7 text-center transition hover:border-primary hover:shadow-lg"
                >
                  <p className="font-display text-lg sm:text-xl font-semibold mb-2">{p.location}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="font-display text-3xl sm:text-4xl font-bold text-gradient-primary">{p.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-center gap-0.5 mb-3" aria-label={`${p.rating} stars`}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.round(p.rating) ? "text-primary" : "text-muted"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {p.count} {p.count === 1 ? "review" : "reviews"} on Google
                  </p>
                  <p className="font-body text-xs text-secondary mt-3 group-hover:underline">View on Google →</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="reviews-page-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-10 sm:mb-14">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
                Reviews
              </p>
              <h1 id="reviews-page-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
                Real Love from <span className="italic text-gradient-primary">Carnival Mornings</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {reviewsToRender.map((review) => {
                const rating = "rating" in review && typeof review.rating === "number" ? review.rating : 5;

                return (
                  <article key={`${review.name}-${review.quote.slice(0, 24)}`} className="relative rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground">{review.name}</p>
                        <p className="font-body text-xs text-muted-foreground">{review.location}</p>
                      </div>
                      <span className="font-body text-[11px] uppercase tracking-[0.16em] text-secondary font-semibold">
                        {review.detail}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-4" aria-label={`${rating} star review`}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-primary" : "text-muted"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="font-body text-sm sm:text-[15px] leading-relaxed text-foreground/85">
                      “{review.quote}”
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-24" aria-labelledby="leave-review-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
                Loved your Glam Hub experience?
              </p>
              <h2 id="leave-review-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Leave us a <span className="italic text-gradient-primary">Google Review</span>
              </h2>
              <p className="font-body text-sm sm:text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your words help future carnival beauties find us. Share your experience on the location you visited.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                {googleProfiles.map((p) => (
                  <a
                    key={p.location}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-3 font-body text-sm font-semibold hover:opacity-90 transition"
                  >
                    Review {p.location}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Reviews;