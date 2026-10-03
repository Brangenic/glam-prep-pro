export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_booking_slot_holds: {
        Row: {
          booking_id: string
          slot_id: string
        }
        Insert: {
          booking_id: string
          slot_id: string
        }
        Update: {
          booking_id?: string
          slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_booking_slot_holds_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "ai_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_booking_slot_holds_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "ai_booking_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_booking_slots: {
        Row: {
          capacity: number
          event_date: string
          event_day: string
          id: string
          slot_time: string
        }
        Insert: {
          capacity?: number
          event_date: string
          event_day: string
          id?: string
          slot_time: string
        }
        Update: {
          capacity?: number
          event_date?: string
          event_day?: string
          id?: string
          slot_time?: string
        }
        Relationships: []
      }
      ai_bookings: {
        Row: {
          amount_usd: number
          created_at: string | null
          day_key: string
          email: string
          first_name: string
          hold_expires_at: string
          id: string
          last_name: string
          notification_sent_at: string | null
          paid_at: string | null
          phone: string
          product_id: string
          product_label: string
          receipt_sent_at: string | null
          reference: string
          refund_amount_cents: number | null
          refund_notified_cents: number | null
          refunded_at: string | null
          source: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          terms_accepted_at: string
        }
        Insert: {
          amount_usd: number
          created_at?: string | null
          day_key: string
          email: string
          first_name: string
          hold_expires_at: string
          id?: string
          last_name: string
          notification_sent_at?: string | null
          paid_at?: string | null
          phone: string
          product_id: string
          product_label: string
          receipt_sent_at?: string | null
          reference: string
          refund_amount_cents?: number | null
          refund_notified_cents?: number | null
          refunded_at?: string | null
          source?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          terms_accepted_at: string
        }
        Update: {
          amount_usd?: number
          created_at?: string | null
          day_key?: string
          email?: string
          first_name?: string
          hold_expires_at?: string
          id?: string
          last_name?: string
          notification_sent_at?: string | null
          paid_at?: string | null
          phone?: string
          product_id?: string
          product_label?: string
          receipt_sent_at?: string | null
          reference?: string
          refund_amount_cents?: number | null
          refund_notified_cents?: number | null
          refunded_at?: string | null
          source?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          terms_accepted_at?: string
        }
        Relationships: []
      }
      amazon_products: {
        Row: {
          category: string | null
          created_at: string
          external_id: string
          id: string
          image_url: string | null
          price_text: string | null
          product_url: string
          raw_payload: Json | null
          source_image_url: string | null
          synced_at: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          external_id: string
          id?: string
          image_url?: string | null
          price_text?: string | null
          product_url: string
          raw_payload?: Json | null
          source_image_url?: string | null
          synced_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          external_id?: string
          id?: string
          image_url?: string | null
          price_text?: string | null
          product_url?: string
          raw_payload?: Json | null
          source_image_url?: string | null
          synced_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          external_id: string
          id: string
          image_url: string | null
          image_url_legacy: string | null
          meta_description: string | null
          post_url: string
          published_date: string | null
          raw_payload: Json | null
          read_time: string | null
          slug: string | null
          source: string
          synced_at: string
          title: string
          updated_at: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          external_id: string
          id?: string
          image_url?: string | null
          image_url_legacy?: string | null
          meta_description?: string | null
          post_url: string
          published_date?: string | null
          raw_payload?: Json | null
          read_time?: string | null
          slug?: string | null
          source?: string
          synced_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          external_id?: string
          id?: string
          image_url?: string | null
          image_url_legacy?: string | null
          meta_description?: string | null
          post_url?: string
          published_date?: string | null
          raw_payload?: Json | null
          read_time?: string | null
          slug?: string | null
          source?: string
          synced_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          ai_model: string | null
          auto_publish: boolean
          body: string
          channel: string
          content_type: string
          created_at: string
          hashtags: string[] | null
          id: string
          source_data: Json | null
          status: string
          territory_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          ai_model?: string | null
          auto_publish?: boolean
          body: string
          channel?: string
          content_type?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          source_data?: Json | null
          status?: string
          territory_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          ai_model?: string | null
          auto_publish?: boolean
          body?: string
          channel?: string
          content_type?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          source_data?: Json | null
          status?: string
          territory_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_content_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      glam_match_analysis: {
        Row: {
          accent_colour: string | null
          confidence: string | null
          created_at: string
          depth_notes: string | null
          direction: Json | null
          gem_tone: string | null
          id: string
          intensity: string | null
          lead_id: string | null
          metallic_colour: string | null
          mood: string | null
          notes: string | null
          primary_colour: string | null
          secondary_colour: string | null
          skin_tone: string | null
          undertone: string | null
        }
        Insert: {
          accent_colour?: string | null
          confidence?: string | null
          created_at?: string
          depth_notes?: string | null
          direction?: Json | null
          gem_tone?: string | null
          id?: string
          intensity?: string | null
          lead_id?: string | null
          metallic_colour?: string | null
          mood?: string | null
          notes?: string | null
          primary_colour?: string | null
          secondary_colour?: string | null
          skin_tone?: string | null
          undertone?: string | null
        }
        Update: {
          accent_colour?: string | null
          confidence?: string | null
          created_at?: string
          depth_notes?: string | null
          direction?: Json | null
          gem_tone?: string | null
          id?: string
          intensity?: string | null
          lead_id?: string | null
          metallic_colour?: string | null
          mood?: string | null
          notes?: string | null
          primary_colour?: string | null
          secondary_colour?: string | null
          skin_tone?: string | null
          undertone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "glam_match_analysis_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "glam_match_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      glam_match_events: {
        Row: {
          created_at: string
          detail: Json | null
          event: string | null
          id: string
          lead_id: string | null
        }
        Insert: {
          created_at?: string
          detail?: Json | null
          event?: string | null
          id?: string
          lead_id?: string | null
        }
        Update: {
          created_at?: string
          detail?: Json | null
          event?: string | null
          id?: string
          lead_id?: string | null
        }
        Relationships: []
      }
      glam_match_leads: {
        Row: {
          consent_at: string
          created_at: string
          destination_slug: string | null
          email: string | null
          expires_at: string
          id: string
          ip_hash: string | null
          marketing_opt_in: boolean
          placement: string | null
          whatsapp: string | null
        }
        Insert: {
          consent_at: string
          created_at?: string
          destination_slug?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          ip_hash?: string | null
          marketing_opt_in?: boolean
          placement?: string | null
          whatsapp?: string | null
        }
        Update: {
          consent_at?: string
          created_at?: string
          destination_slug?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          ip_hash?: string | null
          marketing_opt_in?: boolean
          placement?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      glam_match_looks: {
        Row: {
          best_match: boolean
          bronzing: string | null
          crease_colour: string | null
          created_at: string
          eye_description: string | null
          gem_placement: string | null
          glitter: string | null
          hair: string | null
          id: string
          lash: string | null
          lead_id: string | null
          lid_colour: string | null
          liner: string | null
          lip_colour: string | null
          look_name: string | null
          look_type: string | null
          preview_path: string | null
          why_it_works: string | null
        }
        Insert: {
          best_match?: boolean
          bronzing?: string | null
          crease_colour?: string | null
          created_at?: string
          eye_description?: string | null
          gem_placement?: string | null
          glitter?: string | null
          hair?: string | null
          id?: string
          lash?: string | null
          lead_id?: string | null
          lid_colour?: string | null
          liner?: string | null
          lip_colour?: string | null
          look_name?: string | null
          look_type?: string | null
          preview_path?: string | null
          why_it_works?: string | null
        }
        Update: {
          best_match?: boolean
          bronzing?: string | null
          crease_colour?: string | null
          created_at?: string
          eye_description?: string | null
          gem_placement?: string | null
          glitter?: string | null
          hair?: string | null
          id?: string
          lash?: string | null
          lead_id?: string | null
          lid_colour?: string | null
          liner?: string | null
          lip_colour?: string | null
          look_name?: string | null
          look_type?: string | null
          preview_path?: string | null
          why_it_works?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "glam_match_looks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "glam_match_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      glam_match_uploads: {
        Row: {
          costume_path: string | null
          created_at: string
          id: string
          lead_id: string | null
          purge_after: string
          selfie_path: string | null
        }
        Insert: {
          costume_path?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          purge_after?: string
          selfie_path?: string | null
        }
        Update: {
          costume_path?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          purge_after?: string
          selfie_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "glam_match_uploads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "glam_match_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      google_reviews: {
        Row: {
          author_name: string | null
          created_at: string
          external_id: string
          id: string
          location: string | null
          quote: string
          rating: number | null
          raw_payload: Json | null
          review_date: string | null
          review_url: string | null
          synced_at: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          external_id: string
          id?: string
          location?: string | null
          quote: string
          rating?: number | null
          raw_payload?: Json | null
          review_date?: string | null
          review_url?: string | null
          synced_at?: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          created_at?: string
          external_id?: string
          id?: string
          location?: string | null
          quote?: string
          rating?: number | null
          raw_payload?: Json | null
          review_date?: string | null
          review_url?: string | null
          synced_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      station_rental_enquiries: {
        Row: {
          business_name: string | null
          created_at: string
          days_needed: string
          email: string
          enquiry_type: string
          full_name: string
          id: string
          instagram: string | null
          message: string | null
          service_type: string | null
          territory: string
          whatsapp: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          days_needed: string
          email: string
          enquiry_type?: string
          full_name: string
          id?: string
          instagram?: string | null
          message?: string | null
          service_type?: string | null
          territory: string
          whatsapp: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          days_needed?: string
          email?: string
          enquiry_type?: string
          full_name?: string
          id?: string
          instagram?: string | null
          message?: string | null
          service_type?: string | null
          territory?: string
          whatsapp?: string
        }
        Relationships: []
      }
      sync_state: {
        Row: {
          last_synced_at: string | null
          message: string | null
          source_key: string
          source_url: string
          status: string
          updated_at: string
        }
        Insert: {
          last_synced_at?: string | null
          message?: string | null
          source_key: string
          source_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          last_synced_at?: string | null
          message?: string | null
          source_key?: string
          source_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      territories: {
        Row: {
          active: boolean
          country: string
          created_at: string
          event_dates: string | null
          hashtags: string[] | null
          id: string
          keywords: string[] | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          country: string
          created_at?: string
          event_dates?: string | null
          hashtags?: string[] | null
          id?: string
          keywords?: string[] | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          country?: string
          created_at?: string
          event_dates?: string | null
          hashtags?: string[] | null
          id?: string
          keywords?: string[] | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ai_slot_availability: {
        Args: never
        Returns: {
          capacity: number
          event_day: string
          slot_time: string
          spots_left: number
        }[]
      }
      glam_match_purge_previews_and_leads: { Args: never; Returns: undefined }
      glam_match_purge_uploads: { Args: never; Returns: undefined }
      reserve_ai_booking: {
        Args: {
          p_amount: number
          p_day_key: string
          p_email: string
          p_first: string
          p_last: string
          p_phone: string
          p_product_id: string
          p_product_label: string
          p_slot_ids: string[]
          p_source: string
        }
        Returns: {
          id: string
          reference: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
