import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Glam Bot, the friendly AI concierge for Carnival Glam Hub — a premium carnival makeup and glam service with 15,000+ clients served since 2017. Founded by Gabby Glam, a celebrity MUA.

KEY FACTS:
- Band-neutral: we serve masqueraders from ALL bands
- Destinations: Jamaica, St. Lucia, Antigua, Grenada, Barbados, Trinidad, Tobago, Miami, Atlanta, Toronto
- Services: Full glam makeup, pre-game lounge, dressing assistants, on-site seamstresses, garden photography, bag storage, shuttle services, bronzing (skin evening & tan line removal)
- Booking: Direct customers to book at https://carnivalglamhub.masos.app/events
- Contact: Bookings@carnivalglamhub.com or WhatsApp/Phone: +1 876-509-0997
- Website: https://www.carnivalglamhub.com
- Amazon Store: carnival-ready products at https://www.carnivalglamhub.com/amazon-store

GUIDELINES:
- Be warm, enthusiastic, and knowledgeable about carnival culture
- Keep answers concise (under 150 words unless detailed info is requested)
- Always suggest booking when someone asks about availability or pricing
- If you don't know specific pricing, direct them to book or contact via WhatsApp
- Use emojis sparingly but appropriately ✨💄🎭
- Never make up services or destinations not listed above`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
