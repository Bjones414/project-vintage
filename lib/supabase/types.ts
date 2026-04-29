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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      garages: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "garages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_editorial: {
        Row: {
          color_context: string | null
          content_status: string
          created_at: string
          generation_id: string
          id: string
          notable_variants: Json
          production_notes: string | null
          summary: string | null
          updated_at: string
          watch_outs: Json
        }
        Insert: {
          color_context?: string | null
          content_status?: string
          created_at?: string
          generation_id: string
          id?: string
          notable_variants?: Json
          production_notes?: string | null
          summary?: string | null
          updated_at?: string
          watch_outs?: Json
        }
        Update: {
          color_context?: string | null
          content_status?: string
          created_at?: string
          generation_id?: string
          id?: string
          notable_variants?: Json
          production_notes?: string | null
          summary?: string | null
          updated_at?: string
          watch_outs?: Json
        }
        Relationships: [
          {
            foreignKeyName: "generation_editorial_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: true
            referencedRelation: "porsche_generations"
            referencedColumns: ["generation_id"]
          },
        ]
      }
      listing_analyses: {
        Row: {
          analysis_data: Json
          created_at: string
          id: string
          listing_id: string | null
          source_platform: string | null
          source_url: string
          user_id: string | null
        }
        Insert: {
          analysis_data: Json
          created_at?: string
          id?: string
          listing_id?: string | null
          source_platform?: string | null
          source_url: string
          user_id?: string | null
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          id?: string
          listing_id?: string | null
          source_platform?: string | null
          source_url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_analyses_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          asking_price: number | null
          auction_ends_at: string | null
          body_style: string | null
          created_at: string
          currency: string
          decoded_body_class: string | null
          decoded_engine: string | null
          decoded_make: string | null
          decoded_model: string | null
          decoded_plant: string | null
          decoded_transmission: string | null
          decoded_year: number | null
          drivetrain: string | null
          ended_date: string | null
          engine_displacement_cc: number | null
          exterior_color: string | null
          exterior_color_code: string | null
          final_price: number | null
          generation: string | null
          generation_id: string | null
          high_bid: number | null
          id: string
          interior_color: string | null
          interior_material: string | null
          last_verified_at: string | null
          listed_date: string | null
          listing_status: string | null
          make: string
          mileage: number | null
          mileage_unit: string
          model: string
          modifications: Json
          options: Json
          ownership_count: number | null
          raw_description: string | null
          raw_html_snapshot_key: string | null
          reserve_met: boolean | null
          service_history_present: boolean | null
          source_listing_id: string
          source_platform: string
          source_url: string
          status: string
          transmission: string | null
          trim: string | null
          updated_at: string
          vin: string | null
          vin_decode_raw: Json | null
          year: number
        }
        Insert: {
          asking_price?: number | null
          auction_ends_at?: string | null
          body_style?: string | null
          created_at?: string
          currency?: string
          decoded_body_class?: string | null
          decoded_engine?: string | null
          decoded_make?: string | null
          decoded_model?: string | null
          decoded_plant?: string | null
          decoded_transmission?: string | null
          decoded_year?: number | null
          drivetrain?: string | null
          ended_date?: string | null
          engine_displacement_cc?: number | null
          exterior_color?: string | null
          exterior_color_code?: string | null
          final_price?: number | null
          generation?: string | null
          generation_id?: string | null
          high_bid?: number | null
          id?: string
          interior_color?: string | null
          interior_material?: string | null
          last_verified_at?: string | null
          listed_date?: string | null
          listing_status?: string | null
          make: string
          mileage?: number | null
          mileage_unit?: string
          model: string
          modifications?: Json
          options?: Json
          ownership_count?: number | null
          raw_description?: string | null
          raw_html_snapshot_key?: string | null
          reserve_met?: boolean | null
          service_history_present?: boolean | null
          source_listing_id: string
          source_platform: string
          source_url: string
          status?: string
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          vin?: string | null
          vin_decode_raw?: Json | null
          year: number
        }
        Update: {
          asking_price?: number | null
          auction_ends_at?: string | null
          body_style?: string | null
          created_at?: string
          currency?: string
          decoded_body_class?: string | null
          decoded_engine?: string | null
          decoded_make?: string | null
          decoded_model?: string | null
          decoded_plant?: string | null
          decoded_transmission?: string | null
          decoded_year?: number | null
          drivetrain?: string | null
          ended_date?: string | null
          engine_displacement_cc?: number | null
          exterior_color?: string | null
          exterior_color_code?: string | null
          final_price?: number | null
          generation?: string | null
          generation_id?: string | null
          high_bid?: number | null
          id?: string
          interior_color?: string | null
          interior_material?: string | null
          last_verified_at?: string | null
          listed_date?: string | null
          listing_status?: string | null
          make?: string
          mileage?: number | null
          mileage_unit?: string
          model?: string
          modifications?: Json
          options?: Json
          ownership_count?: number | null
          raw_description?: string | null
          raw_html_snapshot_key?: string | null
          reserve_met?: boolean | null
          service_history_present?: boolean | null
          source_listing_id?: string
          source_platform?: string
          source_url?: string
          status?: string
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          vin?: string | null
          vin_decode_raw?: Json | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "porsche_generations"
            referencedColumns: ["generation_id"]
          },
        ]
      }
      porsche_color_codes: {
        Row: {
          color_family: string | null
          color_name: string
          created_at: string
          finish_type: string | null
          generation_applicability: string[] | null
          is_special_order: boolean
          notes: string | null
          paint_code: string
          rarity: string | null
          updated_at: string
        }
        Insert: {
          color_family?: string | null
          color_name: string
          created_at?: string
          finish_type?: string | null
          generation_applicability?: string[] | null
          is_special_order?: boolean
          notes?: string | null
          paint_code: string
          rarity?: string | null
          updated_at?: string
        }
        Update: {
          color_family?: string | null
          color_name?: string
          created_at?: string
          finish_type?: string | null
          generation_applicability?: string[] | null
          is_special_order?: boolean
          notes?: string | null
          paint_code?: string
          rarity?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      porsche_generations: {
        Row: {
          body_styles: string[] | null
          common_issues: Json | null
          content_status: string | null
          created_at: string
          engine_type: string | null
          generation_id: string
          hero_image_caption: string | null
          hero_image_license: string | null
          hero_image_url: string | null
          model: string
          model_family: string | null
          notes: string | null
          notes_full: string | null
          period_reviews: Json | null
          production_count: number | null
          updated_at: string
          year_end: number | null
          year_start: number
        }
        Insert: {
          body_styles?: string[] | null
          common_issues?: Json | null
          content_status?: string | null
          created_at?: string
          engine_type?: string | null
          generation_id: string
          hero_image_caption?: string | null
          hero_image_license?: string | null
          hero_image_url?: string | null
          model: string
          model_family?: string | null
          notes?: string | null
          notes_full?: string | null
          period_reviews?: Json | null
          production_count?: number | null
          updated_at?: string
          year_end?: number | null
          year_start: number
        }
        Update: {
          body_styles?: string[] | null
          common_issues?: Json | null
          content_status?: string | null
          created_at?: string
          engine_type?: string | null
          generation_id?: string
          hero_image_caption?: string | null
          hero_image_license?: string | null
          hero_image_url?: string | null
          model?: string
          model_family?: string | null
          notes?: string | null
          notes_full?: string | null
          period_reviews?: Json | null
          production_count?: number | null
          updated_at?: string
          year_end?: number | null
          year_start?: number
        }
        Relationships: []
      }
      porsche_option_codes: {
        Row: {
          affects_value: boolean
          category: string | null
          code: string
          created_at: string
          description: string
          desirability: string | null
          generation_id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          affects_value?: boolean
          category?: string | null
          code: string
          created_at?: string
          description: string
          desirability?: string | null
          generation_id: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          affects_value?: boolean
          category?: string | null
          code?: string
          created_at?: string
          description?: string
          desirability?: string | null
          generation_id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "porsche_option_codes_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "porsche_generations"
            referencedColumns: ["generation_id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_enabled: boolean
          alert_frequency: string
          created_at: string
          filters: Json
          id: string
          label: string | null
          last_alerted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_enabled?: boolean
          alert_frequency?: string
          created_at?: string
          filters?: Json
          id?: string
          label?: string | null
          last_alerted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_enabled?: boolean
          alert_frequency?: string
          created_at?: string
          filters?: Json
          id?: string
          label?: string | null
          last_alerted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          onboarding_complete: boolean
          preferred_currency: string
          preferred_mileage: string
          role: string
          stripe_customer_id: string | null
          subscription_period_end: string | null
          subscription_status: string
          subscription_tier: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          onboarding_complete?: boolean
          preferred_currency?: string
          preferred_mileage?: string
          role?: string
          stripe_customer_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string
          subscription_tier?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          onboarding_complete?: boolean
          preferred_currency?: string
          preferred_mileage?: string
          role?: string
          stripe_customer_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string
          subscription_tier?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          body_style: string | null
          created_at: string
          exterior_color: string | null
          exterior_color_code: string | null
          garage_id: string
          generation: string | null
          id: string
          interior_color: string | null
          make: string
          mileage: number | null
          mileage_unit: string
          model: string
          modifications: Json
          notes: string | null
          options: Json
          ownership_status: string
          purchase_currency: string | null
          purchase_date: string | null
          purchase_price: number | null
          transmission: string | null
          trim: string | null
          updated_at: string
          user_id: string
          vin: string | null
          year: number
        }
        Insert: {
          body_style?: string | null
          created_at?: string
          exterior_color?: string | null
          exterior_color_code?: string | null
          garage_id: string
          generation?: string | null
          id?: string
          interior_color?: string | null
          make: string
          mileage?: number | null
          mileage_unit?: string
          model: string
          modifications?: Json
          notes?: string | null
          options?: Json
          ownership_status?: string
          purchase_currency?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          user_id: string
          vin?: string | null
          year: number
        }
        Update: {
          body_style?: string | null
          created_at?: string
          exterior_color?: string | null
          exterior_color_code?: string | null
          garage_id?: string
          generation?: string | null
          id?: string
          interior_color?: string | null
          make?: string
          mileage?: number | null
          mileage_unit?: string
          model?: string
          modifications?: Json
          notes?: string | null
          options?: Json
          ownership_status?: string
          purchase_currency?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          transmission?: string | null
          trim?: string | null
          updated_at?: string
          user_id?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      watched_listings: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          notes: string | null
          notify_on_close: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          notes?: string | null
          notify_on_close?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          notes?: string | null
          notify_on_close?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watched_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watched_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
