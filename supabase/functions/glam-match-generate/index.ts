import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  IMAGE_MODEL,
  IMAGE_QUALITY,
  MAX_IMAGES_PER_LEAD,
  OPENAI_BASE,
  PREVIEWS_BUCKET,
  TEXT_MODEL,
  UPLOADS_BUCKET,
  corsHeaders,
  json,
  logEvent,
  parseJsonReply,
  requireOpenAiKey,
} from "../_shared/glamMatch.ts";

const LOOK_BRIEF = `You are Angel Cumberbatch, Quality Control Director at Carnival Glam Hub, briefing a top-tier Carnival makeup artist. Every look must be genuinely beautiful, flattering and professionally blended, not literal or garish.
COSTUME palette (hex): primary {primary}, secondary {secondary}, accent {accent}, metallic {metallic}, gem {gem}. Mood: {mood}. Intensity: {intensity}.
SKIN: {skin_tone}, {undertone} undertone. {depth_notes}
SELECTED_STYLES: {styles}.
RULES FOR BEAUTY: use the dominant costume colour as the HERO on the eye, but blend it with complementary, skin-flattering tones (warm bronzes, soft neutrals, a smoked outer corner) for DIMENSION. Never a flat block of one colour. Soft gradients, blended edges, luminous glowy skin, a glam editorial finish that a discerning masquerader would love. Flatter deep skin with rich pigment over a base.
Produce FOUR looks (Soft Glam, Cut Crease, Smokey Eyes, Bold Glitter Eyes), selected styles first, strongest costume match best_match true.
Return ONLY a JSON object {"looks":[ ... ]} where each element is {"look_type":"","look_name":"","eye_description":"","lid_colour":"","crease_colour":"","glitter":"","liner":"","lash":"","lip_colour":"","bronzing":"","gem_placement":"","hair":"","why_it_works":"","best_match":false}. British spelling, no hype.`;

const IMAGE_BRIEF = `Edit THIS photo of the woman. Keep her exact same face, identity, bone structure, eye shape, nose, lips and {skin_tone} {undertone} skin tone completely unchanged; it must still clearly be the same person. Do not beautify or replace her face, do not change her body or clothing, do not smooth skin to plastic.
Apply professional, editorial Carnival glam makeup to the standard of a top makeup artist: beautifully BLENDED with soft gradients and diffused edges, dimensional, luminous glowy skin, flattering and glamorous. NOT a flat block of a single colour, not harsh, not amateur.
Makeup: eyes {eye_description}; lids {lid_colour}; crease {crease_colour}; glitter {glitter}; liner {liner}; lashes {lash}; lip {lip_colour}; bronzing {bronzing}; gems {gem_placement}.
Keep the framing and pose of the original photo. Realistic result, no headpiece.
Colour reference (text only, do not add a costume): {primary}, {secondary}, {accent}, {metallic}, {gem}.`;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? "not specified");

type LookRow = Record<string, unknown> & { id?: string; preview_path?: string | null };

async function briefLooks(apiKey: string, prompt: string) {
  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: TEXT_MODEL,
      // JSON mode guarantees a parseable object. parseJsonReply stays as the safety net.
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(() => "")}`);
  const data = await res.json();
  const parsed = parseJsonReply<{ looks?: Record<string, unknown>[] }>(
    data?.choices?.[0]?.message?.content ?? "",
  );
  if (!parsed?.looks?.length) throw new Error("Look brief did not return looks");
  return parsed.looks;
}

/**
 * Posts the image edit request. We are not certain gpt-image-2 accepts
 * input_fidelity on the edits endpoint, so if the API returns a 400 naming an
 * unrecognised or unsupported parameter we strip that parameter and retry once.
 * The shape that succeeded is logged so we learn the answer from the first real run.
 *
 * MODEL FALLBACK RUNG, TEMPORARY UNTIL 1 DECEMBER 2026.
 * If the error names the model itself, or reports the endpoint or model as
 * unsupported or not found, we retry once on gpt-image-1 at the same quality and
 * log fallback_model: "gpt-image-1" to glam_match_events. gpt-image-1 retires on
 * 1 December 2026, so this rung must be removed by then. The log line is how we
 * find out whether we still need it: if no event ever carries fallback_model,
 * gpt-image-2 is doing edits fine and the rung can go early.
 */
const isModelOrEndpointFailure = (text: string) => {
  const lower = text.toLowerCase();
  return (
    lower.includes(IMAGE_MODEL.toLowerCase()) ||
    lower.includes("unsupported") ||
    lower.includes("not supported") ||
    lower.includes("not found") ||
    lower.includes("does not exist") ||
    lower.includes("unknown model") ||
    lower.includes("invalid model")
  );
};

const FALLBACK_IMAGE_MODEL = "gpt-image-1";

async function editImage(
  apiKey: string,
  prompt: string,
  selfie: Blob,
  quality: string,
): Promise<{
  base64: string;
  shape: string;
  strippedParam: string | null;
  fallbackModel: string | null;
}> {
  const optional: Record<string, string> = {
    size: "1024x1024",
    input_fidelity: "high",
    quality,
  };

  const attempt = async (params: Record<string, string>, model = IMAGE_MODEL) => {
    const form = new FormData();
    form.append("model", model);
    form.append("prompt", prompt);
    form.append("image", selfie, "selfie.jpg");
    for (const [key, value] of Object.entries(params)) form.append(key, value);

    const res = await fetch(`${OPENAI_BASE}/images/edits`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  };

  const readImage = (text: string) => {
    const base64 = JSON.parse(text)?.data?.[0]?.b64_json;
    if (!base64) throw new Error("Image response carried no image data");
    return base64 as string;
  };

  const first = await attempt(optional);
  if (first.ok) {
    return {
      base64: readImage(first.text),
      shape: Object.keys(optional).join("+"),
      strippedParam: null,
      fallbackModel: null,
    };
  }

  if (first.status === 400) {
    const offender = Object.keys(optional).find((key) => first.text.includes(key));
    if (offender) {
      const retryParams = { ...optional };
      delete retryParams[offender];
      const second = await attempt(retryParams);
      if (second.ok) {
        return {
          base64: readImage(second.text),
          shape: Object.keys(retryParams).join("+"),
          strippedParam: offender,
          fallbackModel: null,
        };
      }
      if (isModelOrEndpointFailure(second.text)) {
        const third = await attempt(retryParams, FALLBACK_IMAGE_MODEL);
        if (third.ok) {
          return {
            base64: readImage(third.text),
            shape: Object.keys(retryParams).join("+"),
            strippedParam: offender,
            fallbackModel: FALLBACK_IMAGE_MODEL,
          };
        }
        throw new Error(`${third.status} ${third.text}`);
      }
      throw new Error(`${second.status} ${second.text}`);
    }
  }

  if (isModelOrEndpointFailure(first.text)) {
    const fallback = await attempt(optional, FALLBACK_IMAGE_MODEL);
    if (fallback.ok) {
      return {
        base64: readImage(fallback.text),
        shape: Object.keys(optional).join("+"),
        strippedParam: null,
        fallbackModel: FALLBACK_IMAGE_MODEL,
      };
    }
    const stripped = { ...optional };
    delete stripped.input_fidelity;
    const fallbackStripped = await attempt(stripped, FALLBACK_IMAGE_MODEL);
    if (fallbackStripped.ok) {
      return {
        base64: readImage(fallbackStripped.text),
        shape: Object.keys(stripped).join("+"),
        strippedParam: "input_fidelity",
        fallbackModel: FALLBACK_IMAGE_MODEL,
      };
    }
    throw new Error(`${fallbackStripped.status} ${fallbackStripped.text}`);
  }



  throw new Error(`${first.status} ${first.text}`);
}

const decodeBase64 = (base64: string) =>
  Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));

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
    const lookId = typeof body?.look_id === "string" ? body.look_id : null;
    const styles: string[] = Array.isArray(body?.styles)
      ? body.styles.filter((s: unknown) => typeof s === "string")
      : [];
    const regenerate = body?.regenerate === true;

    if (!leadId) return json({ ok: false, message: "A lead_id is required." }, 400);

    const apiKey = requireOpenAiKey();

    const { data: analysis, error: analysisError } = await supabase
      .from("glam_match_analysis")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (analysisError) throw analysisError;
    if (!analysis) {
      return json({ ok: false, message: "We need to read your photos before creating your looks." }, 400);
    }

    const palette = {
      primary: analysis.primary_colour ?? "not specified",
      secondary: analysis.secondary_colour ?? "not specified",
      accent: analysis.accent_colour ?? "not specified",
      metallic: analysis.metallic_colour ?? "not specified",
      gem: analysis.gem_tone ?? "not specified",
      mood: analysis.mood ?? "not specified",
      intensity: analysis.intensity ?? "not specified",
      skin_tone: analysis.skin_tone ?? "not specified",
      undertone: analysis.undertone ?? "not specified",
      depth_notes: analysis.depth_notes ?? "",
    };

    // Cost control, not a UX preference: every image costs real money.
    const imageAllowed = async () => {
      const { count } = await supabase
        .from("glam_match_events")
        .select("id", { count: "exact", head: true })
        .eq("lead_id", leadId)
        .eq("event", "generate.image_created");
      return (count ?? 0) < MAX_IMAGES_PER_LEAD;
    };

    const renderImage = async (look: LookRow) => {
      if (!(await imageAllowed())) return { capped: true as const };

      const { data: upload } = await supabase
        .from("glam_match_uploads")
        .select("selfie_path")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!upload?.selfie_path) throw new Error("Selfie is no longer available");

      const { data: file, error: downloadError } = await supabase.storage
        .from(UPLOADS_BUCKET)
        .download(upload.selfie_path);
      if (downloadError || !file) throw downloadError ?? new Error("Could not read the selfie");

      const prompt = fill(IMAGE_BRIEF, {
        ...palette,
        eye_description: String(look.eye_description ?? ""),
        lid_colour: String(look.lid_colour ?? ""),
        crease_colour: String(look.crease_colour ?? ""),
        glitter: String(look.glitter ?? ""),
        liner: String(look.liner ?? ""),
        lash: String(look.lash ?? ""),
        lip_colour: String(look.lip_colour ?? ""),
        bronzing: String(look.bronzing ?? ""),
        gem_placement: String(look.gem_placement ?? ""),
      });

      const result = await editImage(
        apiKey,
        prompt,
        file,
        regenerate ? "high" : IMAGE_QUALITY,
      );

      const previewPath = `${leadId}/${look.id}.png`;
      const { error: uploadError } = await supabase.storage
        .from(PREVIEWS_BUCKET)
        .upload(previewPath, decodeBase64(result.base64), {
          contentType: "image/png",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      await supabase.from("glam_match_looks").update({ preview_path: previewPath }).eq("id", look.id);

      await logEvent(supabase, leadId, "generate.image_created", {
        look_id: look.id,
        model: IMAGE_MODEL,
        quality: regenerate ? "high" : IMAGE_QUALITY,
        request_shape: result.shape,
        stripped_param: result.strippedParam,
      });

      const { data: signed } = await supabase.storage
        .from(PREVIEWS_BUCKET)
        .createSignedUrl(previewPath, 3600);

      return { capped: false as const, preview_url: signed?.signedUrl ?? null };
    };

    // Single-look path.
    if (lookId) {
      const { data: look, error: lookError } = await supabase
        .from("glam_match_looks")
        .select("*")
        .eq("id", lookId)
        .eq("lead_id", leadId)
        .maybeSingle();
      if (lookError) throw lookError;
      if (!look) return json({ ok: false, message: "We could not find that look." }, 404);

      if (look.preview_path && !regenerate) {
        const { data: signed } = await supabase.storage
          .from(PREVIEWS_BUCKET)
          .createSignedUrl(look.preview_path, 3600);
        return json({ ok: true, look: { ...look, preview_path: undefined }, preview_url: signed?.signedUrl ?? null });
      }

      const rendered = await renderImage(look);
      if (rendered.capped) {
        return json({
          ok: false,
          capped: true,
          message: "You have created the maximum number of previews for this session. Message our team and we will take it from here.",
        });
      }

      return json({ ok: true, look: { ...look, preview_path: undefined }, preview_url: rendered.preview_url });
    }

    // Four-look path.
    const brief = fill(LOOK_BRIEF, {
      ...palette,
      styles: styles.length ? styles.join(", ") : "no preference",
    });
    const looks = await briefLooks(apiKey, brief);

    const rows = looks.slice(0, 4).map((look, index) => ({
      lead_id: leadId,
      look_type: (look.look_type as string) ?? null,
      look_name: (look.look_name as string) ?? null,
      eye_description: (look.eye_description as string) ?? null,
      lid_colour: (look.lid_colour as string) ?? null,
      crease_colour: (look.crease_colour as string) ?? null,
      glitter: (look.glitter as string) ?? null,
      liner: (look.liner as string) ?? null,
      lash: (look.lash as string) ?? null,
      lip_colour: (look.lip_colour as string) ?? null,
      bronzing: (look.bronzing as string) ?? null,
      gem_placement: (look.gem_placement as string) ?? null,
      hair: (look.hair as string) ?? null,
      why_it_works: (look.why_it_works as string) ?? null,
      best_match: look.best_match === true || (index === 0 && !looks.some((l) => l.best_match === true)),
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("glam_match_looks")
      .insert(rows)
      .select("*");
    if (insertError) throw insertError;

    const best = inserted.find((look) => look.best_match) ?? inserted[0];
    let previewUrl: string | null = null;
    let capped = false;

    try {
      const rendered = await renderImage(best);
      if (rendered.capped) capped = true;
      else previewUrl = rendered.preview_url ?? null;
    } catch (error) {
      await logEvent(supabase, leadId, "generate.image_failed", { message: String(error) });
    }

    await logEvent(supabase, leadId, "generate.looks_created", { count: inserted.length });

    return json({
      ok: true,
      capped,
      looks: inserted.map((look) => ({
        ...look,
        preview_path: undefined,
        preview_url: look.id === best.id ? previewUrl : null,
      })),
      best_match_id: best.id,
    });
  } catch (error) {
    console.error("glam-match-generate error", error);
    await logEvent(supabase, leadId, "generate.error", { message: String(error) });
    return json({ ok: false, message: "We could not create your looks. Please try again." }, 500);
  }
});
