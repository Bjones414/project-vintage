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
      comp_engine_runs: {
        Row: {
          actual_price: number | null
          comps_used_json: Json
          confidence_score: number | null
          created_at: string
          generation_used: string
          id: string
          methodology_text: string | null
          model_version: string
          predicted_median: number | null
          predicted_p25: number | null
          predicted_p75: number | null
          subject_data: Json | null
          subject_listing_id: string | null
          verdict: string | null
          was_backtest: boolean
          weights_json: Json
        }
        Insert: {
          actual_price?: number | null
          comps_used_json?: Json
          confidence_score?: number | null
          created_at?: string
          generation_used: string
          id?: string
          methodology_text?: string | null
          model_version: string
          predicted_median?: number | null
          predicted_p25?: number | null
          predicted_p75?: number | null
          subject_data?: Json | null
          subject_listing_id?: string | null
          verdict?: string | null
          was_backtest?: boolean
          weights_json: Json
        }
        Update: {
          actual_price?: number | null
          comps_used_json?: Json
          confidence_score?: number | null
          created_at?: string
          generation_used?: string
          id?: string
          methodology_text?: string | null
          model_version?: string
          predicted_median?: number | null
          predicted_p25?: number | null
          predicted_p75?: number | null
          subject_data?: Json | null
          subject_listing_id?: string | null
          verdict?: string | null
          was_backtest?: boolean
          weights_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "comp_engine_runs_subject_listing_id_fkey"
            columns: ["subject_listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      comp_results: {
        Row: {
          comp_count: number
          comp_listing_ids: string[]
          computed_at: string
          fair_value_high_cents: number | null
          fair_value_low_cents: number | null
          fair_value_median_cents: number | null
          id: string
          listing_id: string
          most_recent_comp_sold_at: string | null
          oldest_comp_sold_at: string | null
          tier: string
        }
        Insert: {
          comp_count: number
          comp_listing_ids?: string[]
          computed_at?: string
          fair_value_high_cents?: number | null
          fair_value_low_cents?: number | null
          fair_value_median_cents?: number | null
          id?: string
          listing_id: string
          most_recent_comp_sold_at?: string | null
          oldest_comp_sold_at?: string | null
          tier: string
        }
        Update: {
          comp_count?: number
          comp_listing_ids?: string[]
          computed_at?: string
          fair_value_high_cents?: number | null
          fair_value_low_cents?: number | null
          fair_value_median_cents?: number | null
          id?: string
          listing_id?: string
          most_recent_comp_sold_at?: string | null
          oldest_comp_sold_at?: string | null
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "comp_results_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
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
      generation_mileage_bands: {
        Row: {
          band_name: string
          created_at: string
          generation: string
          max_miles: number | null
          min_miles: number
          notes: string | null
        }
        Insert: {
          band_name: string
          created_at?: string
          generation: string
          max_miles?: number | null
          min_miles: number
          notes?: string | null
        }
        Update: {
          band_name?: string
          created_at?: string
          generation?: string
          max_miles?: number | null
          min_miles?: number
          notes?: string | null
        }
        Relationships: []
      }
      generation_weight_config: {
        Row: {
          created_at: string
          factor_name: string
          generation: string
          notes: string | null
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          factor_name: string
          generation: string
          notes?: string | null
          updated_at?: string
          weight: number
        }
        Update: {
          created_at?: string
          factor_name?: string
          generation?: string
          notes?: string | null
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      listing_analyses: {
        Row: {
          analysis_data: Json
          comp_count: number | null
          confidence_score: number | null
          created_at: string
          finding_count: number
          findings: Json
          id: string
          listing_id: string | null
          source_platform: string | null
          source_url: string
          user_id: string | null
        }
        Insert: {
          analysis_data: Json
          comp_count?: number | null
          confidence_score?: number | null
          created_at?: string
          finding_count?: number
          findings?: Json
          id?: string
          listing_id?: string | null
          source_platform?: string | null
          source_url: string
          user_id?: string | null
        }
        Update: {
          analysis_data?: Json
          comp_count?: number | null
          confidence_score?: number | null
          created_at?: string
          finding_count?: number
          findings?: Json
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
          accident_history_stated: string | null
          asking_price: number | null
          auction_ends_at: string | null
          auction_outcome: string | null
          bid_count: number | null
          bid_to_buy_ratio: number | null
          bidder_count: number | null
          body_style: string | null
          comment_count: number | null
          condition_signal: string | null
          consignor_type: string | null
          country_of_sale: string | null
          created_at: string
          cross_listing_group_id: string | null
          currency: string
          days_on_market: number | null
          decoded_body_class: string | null
          decoded_engine: string | null
          decoded_make: string | null
          decoded_model: string | null
          decoded_plant: string | null
          decoded_transmission: string | null
          decoded_year: number | null
          delete_options: string[] | null
          documentation_score: number | null
          drivetrain: string | null
          ended_date: string | null
          engine_displacement_cc: number | null
          exterior_color: string | null
          exterior_color_code: string | null
          factory_options: string[] | null
          final_price: number | null
          final_to_reserve_ratio: number | null
          generation: string | null
          generation_id: string | null
          has_aero_kit: boolean | null
          has_books_literature: boolean | null
          has_kardex: boolean | null
          has_no_reserve: boolean
          has_original_keys: boolean | null
          has_owners_manual: boolean | null
          has_porsche_coa: boolean | null
          has_service_records: boolean | null
          has_spare_wheel_tire: boolean | null
          has_sport_seats: boolean | null
          has_tool_kit_complete: boolean | null
          has_window_sticker: boolean | null
          has_x50_powerkit: boolean | null
          high_bid: number | null
          hours_to_reserve: number | null
          id: string
          interior_color: string | null
          interior_color_rarity: string | null
          interior_material: string | null
          interior_signal: string | null
          is_comp_resistant: boolean
          is_featured_listing: boolean | null
          is_federalized_import: boolean | null
          is_original_owner_sale: boolean | null
          is_paint_to_sample: boolean | null
          is_single_family: boolean | null
          last_verified_at: string | null
          listed_at: string | null
          listed_date: string | null
          listing_photo_count: number | null
          listing_status: string | null
          make: string
          market_region: string | null
          mechanical_remediation_status: string | null
          mentioned_accident_history: boolean | null
          mentioned_accident_history_source: string | null
          mentioned_engine_service: boolean | null
          mentioned_engine_service_source: string | null
          mentioned_matching_numbers: boolean | null
          mentioned_matching_numbers_source: string | null
          mentioned_modifications: boolean | null
          mentioned_modifications_source: string | null
          mentioned_original_owner: boolean | null
          mentioned_original_owner_source: string | null
          mentioned_recent_ppi: boolean | null
          mentioned_recent_ppi_source: string | null
          mentioned_repaint: boolean | null
          mentioned_repaint_source: string | null
          mentioned_transmission_service: boolean | null
          mentioned_transmission_service_source: string | null
          mileage: number | null
          mileage_unit: string
          mod_status: string | null
          model: string
          modifications: Json
          notable_provenance: string | null
          numbers_matching: boolean | null
          options: Json
          owner_count: number | null
          owner_count_stated: number | null
          ownership_count: number | null
          ownership_geography_chain: Json | null
          paint_meter_max_microns: number | null
          paint_signal: string | null
          ppi_completed_by: string | null
          raw_html_snapshot_key: string | null
          recent_major_service: Json | null
          reserve_met: boolean | null
          seats_type: string | null
          service_history_present: boolean | null
          source_listing_id: string
          source_platform: string
          source_publication: string | null
          source_url: string
          status: string
          steering_side: string | null
          transmission: string | null
          transmission_variant: string | null
          trim: string | null
          trim_category: string | null
          trim_variant: string | null
          updated_at: string
          vin: string | null
          vin_decode_raw: Json | null
          vin_hash_partial: string | null
          watcher_count: number | null
          wheels_factory_correct: boolean | null
          year: number
        }
        Insert: {
          accident_history_stated?: string | null
          asking_price?: number | null
          auction_ends_at?: string | null
          auction_outcome?: string | null
          bid_count?: number | null
          bid_to_buy_ratio?: number | null
          bidder_count?: number | null
          body_style?: string | null
          comment_count?: number | null
          condition_signal?: string | null
          consignor_type?: string | null
          country_of_sale?: string | null
          created_at?: string
          cross_listing_group_id?: string | null
          currency?: string
          days_on_market?: number | null
          decoded_body_class?: string | null
          decoded_engine?: string | null
          decoded_make?: string | null
          decoded_model?: string | null
          decoded_plant?: string | null
          decoded_transmission?: string | null
          decoded_year?: number | null
          delete_options?: string[] | null
          documentation_score?: number | null
          drivetrain?: string | null
          ended_date?: string | null
          engine_displacement_cc?: number | null
          exterior_color?: string | null
          exterior_color_code?: string | null
          factory_options?: string[] | null
          final_price?: number | null
          final_to_reserve_ratio?: number | null
          generation?: string | null
          generation_id?: string | null
          has_aero_kit?: boolean | null
          has_books_literature?: boolean | null
          has_kardex?: boolean | null
          has_no_reserve?: boolean
          has_original_keys?: boolean | null
          has_owners_manual?: boolean | null
          has_porsche_coa?: boolean | null
          has_service_records?: boolean | null
          has_spare_wheel_tire?: boolean | null
          has_sport_seats?: boolean | null
          has_tool_kit_complete?: boolean | null
          has_window_sticker?: boolean | null
          has_x50_powerkit?: boolean | null
          high_bid?: number | null
          hours_to_reserve?: number | null
          id?: string
          interior_color?: string | null
          interior_color_rarity?: string | null
          interior_material?: string | null
          interior_signal?: string | null
          is_comp_resistant?: boolean
          is_featured_listing?: boolean | null
          is_federalized_import?: boolean | null
          is_original_owner_sale?: boolean | null
          is_paint_to_sample?: boolean | null
          is_single_family?: boolean | null
          last_verified_at?: string | null
          listed_at?: string | null
          listed_date?: string | null
          listing_photo_count?: number | null
          listing_status?: string | null
          make: string
          market_region?: string | null
          mechanical_remediation_status?: string | null
          mentioned_accident_history?: boolean | null
          mentioned_accident_history_source?: string | null
          mentioned_engine_service?: boolean | null
          mentioned_engine_service_source?: string | null
          mentioned_matching_numbers?: boolean | null
          mentioned_matching_numbers_source?: string | null
          mentioned_modifications?: boolean | null
          mentioned_modifications_source?: string | null
          mentioned_original_owner?: boolean | null
          mentioned_original_owner_source?: string | null
          mentioned_recent_ppi?: boolean | null
          mentioned_recent_ppi_source?: string | null
          mentioned_repaint?: boolean | null
          mentioned_repaint_source?: string | null
          mentioned_transmission_service?: boolean | null
          mentioned_transmission_service_source?: string | null
          mileage?: number | null
          mileage_unit?: string
          mod_status?: string | null
          model: string
          modifications?: Json
          notable_provenance?: string | null
          numbers_matching?: boolean | null
          options?: Json
          owner_count?: number | null
          owner_count_stated?: number | null
          ownership_count?: number | null
          ownership_geography_chain?: Json | null
          paint_meter_max_microns?: number | null
          paint_signal?: string | null
          ppi_completed_by?: string | null
          raw_html_snapshot_key?: string | null
          recent_major_service?: Json | null
          reserve_met?: boolean | null
          seats_type?: string | null
          service_history_present?: boolean | null
          source_listing_id: string
          source_platform: string
          source_publication?: string | null
          source_url: string
          status?: string
          steering_side?: string | null
          transmission?: string | null
          transmission_variant?: string | null
          trim?: string | null
          trim_category?: string | null
          trim_variant?: string | null
          updated_at?: string
          vin?: string | null
          vin_decode_raw?: Json | null
          vin_hash_partial?: string | null
          watcher_count?: number | null
          wheels_factory_correct?: boolean | null
          year: number
        }
        Update: {
          accident_history_stated?: string | null
          asking_price?: number | null
          auction_ends_at?: string | null
          auction_outcome?: string | null
          bid_count?: number | null
          bid_to_buy_ratio?: number | null
          bidder_count?: number | null
          body_style?: string | null
          comment_count?: number | null
          condition_signal?: string | null
          consignor_type?: string | null
          country_of_sale?: string | null
          created_at?: string
          cross_listing_group_id?: string | null
          currency?: string
          days_on_market?: number | null
          decoded_body_class?: string | null
          decoded_engine?: string | null
          decoded_make?: string | null
          decoded_model?: string | null
          decoded_plant?: string | null
          decoded_transmission?: string | null
          decoded_year?: number | null
          delete_options?: string[] | null
          documentation_score?: number | null
          drivetrain?: string | null
          ended_date?: string | null
          engine_displacement_cc?: number | null
          exterior_color?: string | null
          exterior_color_code?: string | null
          factory_options?: string[] | null
          final_price?: number | null
          final_to_reserve_ratio?: number | null
          generation?: string | null
          generation_id?: string | null
          has_aero_kit?: boolean | null
          has_books_literature?: boolean | null
          has_kardex?: boolean | null
          has_no_reserve?: boolean
          has_original_keys?: boolean | null
          has_owners_manual?: boolean | null
          has_porsche_coa?: boolean | null
          has_service_records?: boolean | null
          has_spare_wheel_tire?: boolean | null
          has_sport_seats?: boolean | null
          has_tool_kit_complete?: boolean | null
          has_window_sticker?: boolean | null
          has_x50_powerkit?: boolean | null
          high_bid?: number | null
          hours_to_reserve?: number | null
          id?: string
          interior_color?: string | null
          interior_color_rarity?: string | null
          interior_material?: string | null
          interior_signal?: string | null
          is_comp_resistant?: boolean
          is_featured_listing?: boolean | null
          is_federalized_import?: boolean | null
          is_original_owner_sale?: boolean | null
          is_paint_to_sample?: boolean | null
          is_single_family?: boolean | null
          last_verified_at?: string | null
          listed_at?: string | null
          listed_date?: string | null
          listing_photo_count?: number | null
          listing_status?: string | null
          make?: string
          market_region?: string | null
          mechanical_remediation_status?: string | null
          mentioned_accident_history?: boolean | null
          mentioned_accident_history_source?: string | null
          mentioned_engine_service?: boolean | null
          mentioned_engine_service_source?: string | null
          mentioned_matching_numbers?: boolean | null
          mentioned_matching_numbers_source?: string | null
          mentioned_modifications?: boolean | null
          mentioned_modifications_source?: string | null
          mentioned_original_owner?: boolean | null
          mentioned_original_owner_source?: string | null
          mentioned_recent_ppi?: boolean | null
          mentioned_recent_ppi_source?: string | null
          mentioned_repaint?: boolean | null
          mentioned_repaint_source?: string | null
          mentioned_transmission_service?: boolean | null
          mentioned_transmission_service_source?: string | null
          mileage?: number | null
          mileage_unit?: string
          mod_status?: string | null
          model?: string
          modifications?: Json
          notable_provenance?: string | null
          numbers_matching?: boolean | null
          options?: Json
          owner_count?: number | null
          owner_count_stated?: number | null
          ownership_count?: number | null
          ownership_geography_chain?: Json | null
          paint_meter_max_microns?: number | null
          paint_signal?: string | null
          ppi_completed_by?: string | null
          raw_html_snapshot_key?: string | null
          recent_major_service?: Json | null
          reserve_met?: boolean | null
          seats_type?: string | null
          service_history_present?: boolean | null
          source_listing_id?: string
          source_platform?: string
          source_publication?: string | null
          source_url?: string
          status?: string
          steering_side?: string | null
          transmission?: string | null
          transmission_variant?: string | null
          trim?: string | null
          trim_category?: string | null
          trim_variant?: string | null
          updated_at?: string
          vin?: string | null
          vin_decode_raw?: Json | null
          vin_hash_partial?: string | null
          watcher_count?: number | null
          wheels_factory_correct?: boolean | null
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
      market_snapshots: {
        Row: {
          active_listing_count: number | null
          generation_id: string | null
          id: string
          median_dom_30d: number | null
          median_price_30d: number | null
          sell_through_rate_30d: number | null
          snapshot_date: string
          sold_count_30d: number | null
          trim_category: string | null
        }
        Insert: {
          active_listing_count?: number | null
          generation_id?: string | null
          id?: string
          median_dom_30d?: number | null
          median_price_30d?: number | null
          sell_through_rate_30d?: number | null
          snapshot_date: string
          sold_count_30d?: number | null
          trim_category?: string | null
        }
        Update: {
          active_listing_count?: number | null
          generation_id?: string | null
          id?: string
          median_dom_30d?: number | null
          median_price_30d?: number | null
          sell_through_rate_30d?: number | null
          snapshot_date?: string
          sold_count_30d?: number | null
          trim_category?: string | null
        }
        Relationships: []
      }
      porsche_color_codes: {
        Row: {
          color_family: string | null
          color_name: string
          content_status: Database["public"]["Enums"]["content_status_t"]
          created_at: string
          finish_type: string | null
          generation_applicability: string[] | null
          id: string
          is_special_order: boolean
          notes: string | null
          paint_code: string | null
          rarity: string | null
          source_note: string | null
          updated_at: string
        }
        Insert: {
          color_family?: string | null
          color_name: string
          content_status?: Database["public"]["Enums"]["content_status_t"]
          created_at?: string
          finish_type?: string | null
          generation_applicability?: string[] | null
          id?: string
          is_special_order?: boolean
          notes?: string | null
          paint_code?: string | null
          rarity?: string | null
          source_note?: string | null
          updated_at?: string
        }
        Update: {
          color_family?: string | null
          color_name?: string
          content_status?: Database["public"]["Enums"]["content_status_t"]
          created_at?: string
          finish_type?: string | null
          generation_applicability?: string[] | null
          id?: string
          is_special_order?: boolean
          notes?: string | null
          paint_code?: string | null
          rarity?: string | null
          source_note?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      porsche_generations: {
        Row: {
          body_styles: string[] | null
          common_issues: Json | null
          content_status: Database["public"]["Enums"]["content_status_t"]
          created_at: string
          engine_family: string | null
          engine_type: string | null
          generation_id: string
          hero_image_caption: string | null
          hero_image_license: string | null
          hero_image_url: string | null
          model: string
          model_family: string | null
          msrp_launch_usd: string | null
          notes: string | null
          notes_full: string | null
          period_reviews: Json | null
          production_count: number | null
          production_years: string | null
          units_produced: string | null
          updated_at: string
          year_end: number | null
          year_start: number
        }
        Insert: {
          body_styles?: string[] | null
          common_issues?: Json | null
          content_status?: Database["public"]["Enums"]["content_status_t"]
          created_at?: string
          engine_family?: string | null
          engine_type?: string | null
          generation_id: string
          hero_image_caption?: string | null
          hero_image_license?: string | null
          hero_image_url?: string | null
          model: string
          model_family?: string | null
          msrp_launch_usd?: string | null
          notes?: string | null
          notes_full?: string | null
          period_reviews?: Json | null
          production_count?: number | null
          production_years?: string | null
          units_produced?: string | null
          updated_at?: string
          year_end?: number | null
          year_start: number
        }
        Update: {
          body_styles?: string[] | null
          common_issues?: Json | null
          content_status?: Database["public"]["Enums"]["content_status_t"]
          created_at?: string
          engine_family?: string | null
          engine_type?: string | null
          generation_id?: string
          hero_image_caption?: string | null
          hero_image_license?: string | null
          hero_image_url?: string | null
          model?: string
          model_family?: string | null
          msrp_launch_usd?: string | null
          notes?: string | null
          notes_full?: string | null
          period_reviews?: Json | null
          production_count?: number | null
          production_years?: string | null
          units_produced?: string | null
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
      trim_taxonomy: {
        Row: {
          created_at: string
          display_name: string
          generation: string
          is_separate_market: boolean
          notes: string | null
          production_total: number | null
          trim_category: string
        }
        Insert: {
          created_at?: string
          display_name: string
          generation: string
          is_separate_market?: boolean
          notes?: string | null
          production_total?: number | null
          trim_category: string
        }
        Update: {
          created_at?: string
          display_name?: string
          generation?: string
          is_separate_market?: boolean
          notes?: string | null
          production_total?: number | null
          trim_category?: string
        }
        Relationships: []
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
      content_status_t: "draft" | "verified" | "published"
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
    Enums: {
      content_status_t: ["draft", "verified", "published"],
    },
  },
} as const
