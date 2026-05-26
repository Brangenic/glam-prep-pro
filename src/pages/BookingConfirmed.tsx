import { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";

const BookingConfirmed = () => {
  const [params] = useSearchParams();

  const { total, id, currency } = useMemo(() => {
    const totalRaw = params.get("total") ?? params.get("value") ?? "";
    const parsed = Number.parseFloat(totalRaw);
    return {
      total: Number.isFinite(parsed) ? parsed : undefined,
      id: params.get("id") ?? params.get("transaction_id") ?? undefined,
      currency: (params.get("currency") || "USD").toUpperCase(),
    };
  }, [params]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag === "undefined") return;
    const payload: Record<string, unknown> = {
      send_to: "AW-10894663311/esrcCKj357McEI-9_coo",
      currency,
    };
    if (typeof total === "number") payload.value = total;
    if (id) payload.transaction_id = id;
    window.gtag("event", "conversion", payload);

    try {
      window.fbq?.("track", "Purchase", {
        value: total ?? 0,
        currency,
        ...(id ? { order_id: id } : {}),
      });
    } catch {
      /* noop */
    }
  }, [total, id, currency]);

  return (
    <main className="min-h-[100svh] flex items-center justify-center px-6 py-24 bg-background text-foreground">
      <div className="max-w-xl text-center">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-4">Booking Confirmed</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Thank you — your <span className="text-gradient-primary italic">Glam Slot</span> is locked in.
        </h1>
        <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
          A confirmation has been sent to your email. We'll be in touch with arrival details ahead of your Carnival morning.
        </p>
        {(id || typeof total === "number") && (
          <div className="font-body text-sm text-muted-foreground mb-8 space-y-1">
            {id && <div>Reference: <span className="text-foreground font-medium">{id}</span></div>}
            {typeof total === "number" && (
              <div>
                Total: <span className="text-foreground font-medium">{currency} {total.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default BookingConfirmed;