// Stripe webhook for the Glam Hub AI booking app.
// Events: checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.expired.
import Stripe from "npm:stripe@17.7.0";
import { markPaidFromSession, sendBookingEmails, serviceClient } from "../_shared/glamHubFulfil.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "sk_unset", { httpClient: Stripe.createFetchHttpClient() });
const crypto = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) { console.error("STRIPE_WEBHOOK_SECRET missing, rejecting"); return new Response("Not configured", { status: 400 }); }
  const sig = req.headers.get("Stripe-Signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig ?? "", secret, 300, crypto);
  } catch (e) {
    console.error("Bad signature", (e as Error).message);
    return new Response("Bad signature", { status: 400 });
  }
  const db = serviceClient();
  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const id = await markPaidFromSession(db, event.data.object as never);
      if (id) console.log("emails", id, await sendBookingEmails(db, id));
    } else if (event.type === "checkout.session.expired") {
      const s = event.data.object as Stripe.Checkout.Session;
      await db.from("ai_bookings").update({ status: "expired" }).eq("stripe_checkout_session_id", s.id).eq("status", "pending_payment");
    }
  } catch (e) {
    console.error("Webhook handling failed", (e as Error).message);
    return new Response("Error", { status: 500 });
  }
  return Response.json({ received: true });
});
