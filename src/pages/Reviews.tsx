import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PressBar from "@/components/landing/PressBar";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE = "Carnival Glam Hub Reviews | Real Client Carnival Makeup Testimonials";
const PAGE_DESCRIPTION =
  "Read real reviews from Carnival Glam Hub clients. Authentic testimonials from women who booked carnival makeup and glam services for Miami, Toronto, Barbados, and the Caribbean.";

type RealReview = {
  name: string;
  photo?: string;
  stars: number;
  text: string;
};

const realReviews: RealReview[] = [
  {
    name: "Ashley Trini S",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjWoM8cTsPE2l8KK5vjYg5zbqjJv7v8RqsinZQLFs-hWwjtFEFVFDA=w72-h72-p-rp-mo-ba4-br100",
    stars: 5,
    text: "5 stars across the board for the experience! I chose Carnival Glam Hub for Carnival Monday and went with a different service on Tuesday. I completely prefer Glam hub and will be using them for both days next year 2027 Carnival.",
  },
  {
    name: "Kerra Denel",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjXDGXza3lSHsqgrXp55mDKOmlc2Zx0i-JI6qmoKCTYvpv1gJ-5d=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "I had the most amazing experience at Carnival Glam Hub! From start to finish, everything was seamless. My appointment started right on time (which is everything during Carnival season!), and the entire process was professional, organized, and genuinely made me feel special.",
  },
  {
    name: "Emma Aqui",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjW4m7n-dRXDTcqpxcIjDydx2AfVanNfD8M8ZdZnzEhGYhN4r7Q=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "My experience with Carnival Glam Hub was nothing short of exceptional. From their professionalism to the quality of hair, makeup, and bronzing services, everything exceeded my expectations. They truly delivered everything I was looking for and more.",
  },
  {
    name: "Jodi Henriques",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjUjlg68wXx_qhfMyDHCk7FqVTmch_EMfU65b2IVktFrfp1pusv-=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "My make up was beautiful, Gabby selected colours that not only looked good with my costume but complimented my skin tone. I also did the photo package and what a relief to get the pics out the way so I can get on. I'll definitely be booking again!",
  },
  {
    name: "Mala Morrison",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjUDR28GEwMrbthygeQ_9csH8O3HIZhyhovD9ypnLbsV16lziYKacA=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "I've been a Glam Girl since the inception of Glam Hub. I've used their Full Glam services in three countries. They make it so easy for me to simply show up in my house dress and come out feeling like a Carnival Queen.",
  },
  {
    name: "Nicholas Dodd",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocL_UgSw__k3h-zT2gamTXmkd78Tyk8uRyhpz6-OtSQAlc8Png=w72-h72-p-rp-mo-br100",
    stars: 5,
    text: "Glamhub is a heaven sent spot for carnival goers. They have a barber there where I can get my hair trimmed/shaped up for the road and they also have breakfast, complimentary drinks all while I'm waiting for my gf to get her hair and makeup done there too.",
  },
  {
    name: "Marissa Hanson",
    stars: 5,
    text: "I would recommend the Glam Hub for absolutely EVERYONE prepping for carnival! From hair to makeup to photoshoot, it is always a 5 star experience. If you enjoy being treated like a princess, this is the place to get ready for carnival.",
  },
  {
    name: "Michaela Excell",
    stars: 5,
    text: "I had an amazing experience at Carnival GlamHub! The makeup was flawless, and the team made sure I looked stunning for the occasion. The photos they took were professional and captured every detail perfectly. The staff was incredibly warm, attentive, and professional.",
  },
];

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

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

const Reviews = () => {
  const ORG_ID = "https://www.carnivalglamhub.com/#organization";
  const ORG_REF = { "@type": "BeautySalon", "@id": ORG_ID, name: "Carnival Glam Hub" };

  // AggregateRating (matches the sitewide Organization 4.8/43) plus
  // each visible Google review as an individual schema.org Review,
  // all itemReviewed against the existing Organization @id so no
  // duplicate Organization node is emitted.
  const aggregateRatingJsonLd = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: ORG_REF,
    ratingValue: "4.8",
    reviewCount: String(googleProfiles.reduce((n, p) => n + p.count, 0)),
    bestRating: "5",
  };

  const reviewListJsonLd = realReviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: ORG_REF,
    author: { "@type": "Person", name: r.name },
    reviewBody: r.text,
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.stars,
      bestRating: "5",
    },
  }));

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
      />
      {reviewListJsonLd.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <PressBar compact />
        <section className="pt-4 pb-8 sm:pb-12" aria-labelledby="google-ratings-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-8 sm:mb-10">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
                Client Reviews
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
              {realReviews.map((review) => {
                const rating = review.stars;
                return (
                  <article key={`${review.name}-${review.text.slice(0, 24)}`} className="relative rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-5">
                      {review.photo ? (
                        <img
                          src={review.photo}
                          alt={`${review.name} Google profile photo`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-full object-cover border border-primary/30 flex-shrink-0"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="h-12 w-12 rounded-full flex items-center justify-center border border-primary/30 bg-primary/10 text-primary font-display text-sm font-semibold flex-shrink-0"
                        >
                          {getInitials(review.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground truncate">{review.name}</p>
                        <p className="font-body text-xs text-muted-foreground">Verified Google review</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-4" aria-label={`${rating} star review`}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-primary" : "text-muted"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="font-body text-sm sm:text-[15px] leading-relaxed text-foreground/85">
                      “{review.text}”
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