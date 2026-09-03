import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ── Tool definitions ──────────────────────────────────────────────────────

const tools = [
  {
    type: "function",
    function: {
      name: "update_site_config",
      description:
        "Update a site configuration value. Valid keys: hero_headline, hero_subtitle, hero_subtext, hero_cta_text, cta_headline, cta_description, cta_button_text, announcement_banner",
      parameters: {
        type: "object",
        properties: {
          key: {
            type: "string",
            enum: [
              "hero_headline",
              "hero_subtitle",
              "hero_subtext",
              "hero_cta_text",
              "cta_headline",
              "cta_description",
              "cta_button_text",
              "announcement_banner",
            ],
          },
          value: { type: "string" },
        },
        required: ["key", "value"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_content",
      description:
        "Generate AI marketing content for a territory and channel. Returns the generated draft.",
      parameters: {
        type: "object",
        properties: {
          territory_slug: {
            type: "string",
            description: "Territory slug, or 'all' for all territories",
          },
          channel: {
            type: "string",
            enum: ["instagram", "whatsapp", "facebook", "twitter", "blog", "email"],
          },
          count: { type: "number", description: "Number of posts to generate (1-5)" },
        },
        required: ["territory_slug", "channel"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "publish_content",
      description: "Publish a draft content item by its ID.",
      parameters: {
        type: "object",
        properties: {
          content_id: { type: "string", description: "UUID of the content to publish" },
        },
        required: ["content_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "query_data",
      description:
        "Query site data. Supports: review_count, content_stats, territories, recent_drafts, site_config",
      parameters: {
        type: "object",
        properties: {
          query_type: {
            type: "string",
            enum: ["review_count", "content_stats", "territories", "recent_drafts", "site_config"],
          },
        },
        required: ["query_type"],
        additionalProperties: false,
      },
    },
  },
];

// ── Tool execution ────────────────────────────────────────────────────────

async function executeTool(
  name: string,
  args: Record<string, unknown>,
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<string> {
  switch (name) {
    case "update_site_config": {
      const { key, value } = args as { key: string; value: string };
      const { error } = await supabase
        .from("site_config")
        .upsert({ key, value, updated_at: new Date().toISOString(), updated_by: userId }, { onConflict: "key" });
      if (error) return `Error updating ${key}: ${error.message}`;
      return `Successfully updated "${key}" to "${value}". The change is live on the website now.`;
    }

    case "generate_content": {
      const { territory_slug, channel, count } = args as {
        territory_slug: string;
        channel: string;
        count?: number;
      };
      const genUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-content`;
      const resp = await fetch(genUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({
          territory_slug: territory_slug === "all" ? undefined : territory_slug,
          channel,
          count: Math.min(count ?? 1, 5),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) return `Error generating content: ${JSON.stringify(data)}`;
      const summary = data.results
        ?.map((r: any) => `${r.territory}: ${r.generated} draft(s) created`)
        .join("; ");
      return `Content generated: ${summary}. You can review them in the Content tab.`;
    }

    case "publish_content": {
      const { content_id } = args as { content_id: string };
      const { error } = await supabase
        .from("generated_content")
        .update({ status: "published" })
        .eq("id", content_id);
      if (error) return `Error publishing: ${error.message}`;
      return `Content ${content_id} has been published and is now live.`;
    }

    case "query_data": {
      const { query_type } = args as { query_type: string };

      if (query_type === "review_count") {
        const { count } = await supabase
          .from("google_reviews")
          .select("*", { count: "exact", head: true });
        const { count: fiveStar } = await supabase
          .from("google_reviews")
          .select("*", { count: "exact", head: true })
          .eq("rating", 5);
        return `Total reviews: ${count ?? 0}. Five-star reviews: ${fiveStar ?? 0}.`;
      }

      if (query_type === "content_stats") {
        const { count: total } = await supabase
          .from("generated_content")
          .select("*", { count: "exact", head: true });
        const { count: drafts } = await supabase
          .from("generated_content")
          .select("*", { count: "exact", head: true })
          .eq("status", "draft");
        const { count: published } = await supabase
          .from("generated_content")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");
        return `Content stats, Total: ${total ?? 0}, Drafts: ${drafts ?? 0}, Published: ${published ?? 0}.`;
      }

      if (query_type === "territories") {
        const { data } = await supabase
          .from("territories")
          .select("name, country, slug, event_dates, active")
          .order("name");
        return `Territories:\n${(data ?? []).map((t: any) => `• ${t.name} (${t.country}), ${t.active ? "Active" : "Inactive"}${t.event_dates ? `, dates: ${t.event_dates}` : ""}`).join("\n")}`;
      }

      if (query_type === "recent_drafts") {
        const { data } = await supabase
          .from("generated_content")
          .select("id, title, channel, created_at, territories(name)")
          .eq("status", "draft")
          .order("created_at", { ascending: false })
          .limit(10);
        if (!data?.length) return "No draft content found.";
        return `Recent drafts:\n${data.map((d: any) => `• [${d.id.slice(0, 8)}] ${d.territories?.name ?? "General"}, ${d.channel}: "${d.title ?? "(no title)"}"`).join("\n")}`;
      }

      if (query_type === "site_config") {
        const { data } = await supabase.from("site_config").select("key, value");
        return `Current site config:\n${(data ?? []).map((c: any) => `• ${c.key}: "${c.value}"`).join("\n")}`;
      }

      return `Unknown query type: ${query_type}`;
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

// ── System prompt ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Carnival Glam Hub Admin Assistant. You help the admin manage the website through conversation.

You have these tools:
1. **update_site_config**, Change website text (hero headlines, CTAs, announcements)
2. **generate_content**, Create AI marketing content for social media channels
3. **publish_content**, Publish draft content (you need the content ID)
4. **query_data**, Look up stats (reviews, content, territories, current site config)

Guidelines:
- Always confirm what you did after using a tool
- For site config changes, show the old and new value when possible (use query_data first)
- Be concise and professional
- If asked to do something you can't, explain what you CAN do
- Available territories: Trinidad, Jamaica, Barbados, Grenada, Miami, St. Lucia, Antigua, Bahamas, USVI, Atlanta
- Available channels: instagram, whatsapp, facebook, twitter, blog, email
- Site config keys: hero_headline, hero_subtitle, hero_subtext, hero_cta_text, cta_headline, cta_description, cta_button_text, announcement_banner`;

// ── Main handler ──────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer "))
      return json({ error: "Unauthorized" }, 401);

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const userId = claimsData.claims.sub as string;

    // Check admin role
    const { data: roleData } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    if (!roleData?.length) return json({ error: "Admin access required" }, 403);

    const { messages } = await req.json();

    // Call AI with tools
    let aiMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];
    let finalResponse = "";
    const maxIterations = 5; // prevent infinite tool loops

    for (let i = 0; i < maxIterations; i++) {
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: aiMessages,
          tools,
          tool_choice: "auto",
        }),
      });

      if (!aiResp.ok) {
        if (aiResp.status === 429) return json({ error: "Rate limit exceeded. Please try again in a moment." }, 429);
        if (aiResp.status === 402) return json({ error: "AI credits exhausted. Add funds in Settings > Workspace > Usage." }, 402);
        const t = await aiResp.text();
        console.error("AI error:", aiResp.status, t);
        return json({ error: "AI gateway error" }, 500);
      }

      const data = await aiResp.json();
      const choice = data.choices?.[0];
      const msg = choice?.message;

      if (!msg) break;

      aiMessages.push(msg);

      // If the model wants to call tools
      if (msg.tool_calls?.length) {
        for (const tc of msg.tool_calls) {
          const args = JSON.parse(tc.function.arguments);
          const result = await executeTool(tc.function.name, args, serviceClient, userId);
          aiMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: result,
          });
        }
        continue; // let the model respond with tool results
      }

      // No tool calls, we have the final text
      finalResponse = msg.content ?? "";
      break;
    }

    return json({ response: finalResponse });
  } catch (e) {
    console.error("admin-chat error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
