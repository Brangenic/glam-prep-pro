import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE = "Carnival Glam Hub Reviews | Real Client Carnival Glam Testimonials";
const PAGE_DESCRIPTION =
  "Read real reviews from Carnival Glam Hub clients. Authentic testimonials from women who booked carnival makeup and glam services for Miami, Toronto, Barbados, and the Caribbean.";

type RealReview = {
  name: string;
  photo: string;
  stars: number;
  text: string;
  location: string;
};

const realReviews: RealReview[] = [
  {
    name: "Melissa Chung",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocKAgKeQo-0x3xSi6D_Q4esEipUJOjxQ73dDG9zOWWXpEWvB8Q=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "Carnival Glam Hub was everything! I loved being able to get my makeup, hair, and photoshoot all in one place, so easy and stress-free. The dressing room assistants were a huge help! My makeup lasted all day, even through the heat and nonstop dancing. Such an amazing experience! Thanks, Glam Hub team!",
    location: "Jamaica",
  },
  {
    name: "Shadae Henry",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocJsQUz7R5d4eoB2NlNs5v7r9dxI566i0FNXXp2tSqtvPcIqFA=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "I've been going to Carnival Glam Hub since 2022 and I'll be back again for 2025! It's the place to be for your hair, makeup and photoshoot needs. It's like your own personal glam squad right before you touch on the road!",
    location: "Jamaica",
  },
  {
    name: "Antoinette Dixon",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjXm9-L-TadspKdG6eTmup06BHI16fquw0dtUTmIUuW8UAhln3eO7g=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "I've been to Carnival Glam Hub since 2021 and their service is always amazing. I got my hair and makeup done in one place and not to mention enjoying the mimosas and breakfast they had available. It's a really great premium experience for all carnival masqueraders.",
    location: "Jamaica",
  },
  {
    name: "Snowwhite Hogie",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjVO2OxItMqgN50il_nXYb7l4X3lz3ax6WjquqhSe7nOr87GmCc=w72-h72-p-rp-mo-ba2-br100",
    stars: 5,
    text: "I love Carnival Glam Hub — 10/10 Experience! Absolutely loved the service! The makeup was flawless, transportation was smooth and stress-free, and the photoshoot captured the vibes perfectly.",
    location: "Jamaica",
  },
  {
    name: "Daydrie Burke",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjVRrmOcPDgq-svpGkUFxDJTB4Au-TWGn8L31WweiUVtoQMpVGRm2w=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "When it comes to Glam Hub, consider it your one stop shop for getting ready for the road on carnival day! From getting your hair and fabulous makeup done by the best in the business to having help putting on your costume.",
    location: "Jamaica",
  },
  {
    name: "Krystal Angelique",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjX6BQh4kA2G3At2XOveoQfHd4r4-QVxBleNql5IgnAwu6nRAiis=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "Glam Hub is what we always needed and every year it evolves. A place with everything! Thoughtfully curated, from welcome refreshments, to snacks, makeup, hair, help with costumes, photo shoots and so much more.",
    location: "Jamaica",
  },
  {
    name: "Mala Morrison",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjUDR28GEwMrbthygeQ_9csH8O3HIZhyhovD9ypnLbsV16lziYKacA=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "Carnival Glam Hub is my choice for a one stop hassle-free carnival glam experience.",
    location: "Jamaica",
  },
  {
    name: "Marissa Williams",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjXtQ_DxGGcUOAvjVpmH2BYfofQj_M9z68j7PCOgAkDDQ4Utk2s=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "If you were at Jamaica carnival this year you know the heat was on another level and my makeup held up through sweat and bottles of water being spritzed on it. I was truly amazed by the talent and quality of makeup I received.",
    location: "Jamaica",
  },
  {
    name: "Ashley Trini S",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjWoM8cTsPE2l8KK5vjYg5zbqjJv7v8RqsinZQLFs-hWwjtFEFVFDA=w72-h72-p-rp-mo-ba4-br100",
    stars: 5,
    text: "5 stars across the board for the experience! I chose Carnival Glam Hub for Carnival Monday and went with a different service on Tuesday. I completely prefer Glam Hub and will be using them for both days next year.",
    location: "Trinidad",
  },
  {
    name: "Kerra Denel",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjXDGXza3lSHsqgrXp55mDKOmlc2Zx0i-JI6qmoKCTYvpv1gJ-5d=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "I had the most amazing experience at Carnival Glam Hub! From start to finish, everything was seamless. My appointment started right on time (which is everything during Carnival season!), and the entire process was professional and organized.",
    location: "Trinidad",
  },
];

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
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (prev === null) tag?.remove();
        else tag?.setAttribute("content", prev);
      };
    };

    const restoreDesc = setMeta("description", PAGE_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      restoreDesc();
    };
  }, []);

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