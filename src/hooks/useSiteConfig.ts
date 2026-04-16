import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DEFAULTS: Record<string, string> = {
  hero_headline: "Your Carnival Morning Starts Here",
  hero_subtitle:
    "Luxury glam, costume dressing, and concierge-style preparation for masqueraders who want to hit the road looking flawless.",
  hero_subtext:
    "From makeup to final touches — we handle everything so you can focus on the experience.",
  hero_cta_text: "Book Your Carnival Glam",
  cta_headline: "Secure Your Carnival Glam Slot",
  cta_description:
    "Carnival morning appointments are limited and typically sell out early. Reserve your spot now to ensure a smooth, stress-free start to your Carnival day.",
  cta_button_text: "Book Your Glam Appointment",
  announcement_banner: "",
};

export function useSiteConfig() {
  const { data, isLoading } = useQuery({
    queryKey: ["site_config"],
    queryFn: async () => {
      const { data } = await supabase.from("site_config").select("key, value");
      const map: Record<string, string> = { ...DEFAULTS };
      for (const row of data ?? []) {
        map[row.key] = row.value;
      }
      return map;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const get = (key: string) => data?.[key] ?? DEFAULTS[key] ?? "";

  return { config: data ?? DEFAULTS, get, isLoading };
}
