import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  OPENAI_BASE,
  TEXT_MODEL,
  UPLOADS_BUCKET,
  corsHeaders,
  json,
  logEvent,
  parseJsonReply,
  requireOpenAiKey,
} from "../_shared/glamMatch.ts";

const COSTUME_PROMPT = `You are a Carnival costume colour analyst. Look ONLY at the costume worn by the person: the feathers, wings, backpack, bra/bikini, straps, body jewellery, headpiece and gems. IGNORE the background, sky, clouds, water, floor, shoes and the person's skin entirely.
First decide the ONE dominant colour that covers most of the costume (name it plainly, e.g. royal blue). That is primary_colour. Then give the next most present colour as secondary, and a real accent. metallic_colour is any gold/silver/bronze hardware or glitter. gem_crystal_tone is the colour of the crystals/rhinestones.
Do NOT invent colours that are not clearly on the costume. If the costume is mostly blue, primary MUST be blue.
Return ONLY valid JSON: {"primary_colour":{"name":"","hex":""},"secondary_colour":{"name":"","hex":""},"accent_colour":{"name":"","hex":""},"metallic_colour":{"name":"","hex":""},"gem_crystal_tone":{"name":"","hex":""},"overall_mood":"","intensity":"soft|medium|bold","makeup_direction":[],"confidence":"high|medium|low","notes":""}. No prose.`;

const SELFIE_PROMPT = `You are a makeup-styling assistant reading a photo only to estimate flattering makeup shades. This is a consenting user requesting a makeup preview of herself. Do not identify who the person is. Return ONLY valid JSON: {"skin_tone":"fair|light|medium|medium-deep|deep|rich-deep","undertone":"warm|cool|neutral|olive","depth_notes":"","lighting_quality":"good|mixed|poor","caution":""}. Styling facts only.`;

type ColourField = { name?: string; hex?: string };

async function visionPass(apiKey: string, prompt: string, imageUrl: string) {
  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: TEXT_MODEL,
      // JSON mode guarantees a parseable object. parseJsonReply stays as the safety net.
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text().catch(() => "")}`);
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";
  const parsed = parseJsonReply<Record<string, unknown>>(raw);
  if (!parsed) throw new Error("Model reply was not valid JSON");
  return parsed;
}

const colourName = (value: unknown) => {
  const field = value as ColourField | undefined;
  if (!field) return null;
  const name = typeof field.name === "string" ? field.name.trim() : "";
  const hex = typeof field.hex === "string" ? field.hex.trim() : "";
  if (name && hex) return `${name} (${hex})`;
  return name || hex || null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, message: "Method not allowed" }, 405);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let leadId: string | null = null;

  try {
    const body = await req.json().catch(() => ({}));
    leadId = typeof body?.lead_id === "string" ? body.lead_id : null;
    if (!leadId) return json({ ok: false, message: "A lead_id is required." }, 400);

    const apiKey = requireOpenAiKey();

    const { data: upload, error: uploadError } = await supabase
      .from("glam_match_uploads")
      .select("costume_path, selfie_path")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (uploadError) throw uploadError;
    if (!upload) {
      return json({ ok: false, message: "We could not find your photos. Please upload them again." }, 404);
    }

    const [costumeSigned, selfieSigned] = await Promise.all([
      supabase.storage.from(UPLOADS_BUCKET).createSignedUrl(upload.costume_path, 300),
      supabase.storage.from(UPLOADS_BUCKET).createSignedUrl(upload.selfie_path, 300),
    ]);

    let costume: Record<string, unknown> | null = null;
    let selfie: Record<string, unknown> | null = null;

    if (costumeSigned.data?.signedUrl) {
      try {
        costume = await visionPass(apiKey, COSTUME_PROMPT, costumeSigned.data.signedUrl);
      } catch (error) {
        await logEvent(supabase, leadId, "analyze.costume_failed", { message: String(error) });
      }
    } else {
      await logEvent(supabase, leadId, "analyze.costume_failed", { message: "No signed URL" });
    }

    if (selfieSigned.data?.signedUrl) {
      try {
        selfie = await visionPass(apiKey, SELFIE_PROMPT, selfieSigned.data.signedUrl);
      } catch (error) {
        await logEvent(supabase, leadId, "analyze.selfie_failed", { message: String(error) });
      }
    } else {
      await logEvent(supabase, leadId, "analyze.selfie_failed", { message: "No signed URL" });
    }

    if (!costume && !selfie) {
      return json({
        ok: false,
        message: "We could not read your photos this time. Please try two clearer, brighter photos.",
      }, 502);
    }

    // We never fabricate a palette. If the costume read failed the confidence is low
    // and the page tells her so.
    const confidence = costume
      ? (typeof costume.confidence === "string" ? costume.confidence : "medium")
      : "low";

    const notesParts: string[] = [];
    if (typeof costume?.notes === "string" && costume.notes) notesParts.push(costume.notes);
    if (!costume) notesParts.push("We could not read the costume photo, so the colours below are not a confirmed reading.");
    if (!selfie) notesParts.push("We could not read the selfie, so the shade guidance is general rather than personal.");

    const row = {
      lead_id: leadId,
      skin_tone: (selfie?.skin_tone as string) ?? null,
      undertone: (selfie?.undertone as string) ?? null,
      depth_notes: (selfie?.depth_notes as string) ?? null,
      primary_colour: colourName(costume?.primary_colour),
      secondary_colour: colourName(costume?.secondary_colour),
      accent_colour: colourName(costume?.accent_colour),
      metallic_colour: colourName(costume?.metallic_colour),
      gem_tone: colourName(costume?.gem_crystal_tone),
      mood: (costume?.overall_mood as string) ?? null,
      intensity: (costume?.intensity as string) ?? null,
      direction: (costume?.makeup_direction as unknown) ?? null,
      confidence,
      notes: notesParts.join(" ") || null,
    };

    const { data: analysis, error: insertError } = await supabase
      .from("glam_match_analysis")
      .insert(row)
      .select("*")
      .single();

    if (insertError) throw insertError;

    await logEvent(supabase, leadId, "analyze.completed", {
      costume_ok: Boolean(costume),
      selfie_ok: Boolean(selfie),
      confidence,
    });

    return json({
      ok: true,
      analysis,
      costume_read: Boolean(costume),
      selfie_read: Boolean(selfie),
      confidence,
    });
  } catch (error) {
    console.error("glam-match-analyze error", error);
    await logEvent(supabase, leadId, "analyze.error", { message: String(error) });
    return json({ ok: false, message: "We could not analyse your photos. Please try again." }, 500);
  }
});
