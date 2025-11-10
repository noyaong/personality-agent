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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          response_time_ms: number | null
          role: string
          session_id: string | null
          tokens_used: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          role: string
          session_id?: string | null
          tokens_used?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          role?: string
          session_id?: string | null
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          ended_at: string | null
          id: string
          message_count: number | null
          persona_profile_id: string | null
          relationship_type: string
          session_metadata: Json | null
          session_status: string | null
          started_at: string | null
          total_tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          message_count?: number | null
          persona_profile_id?: string | null
          relationship_type: string
          session_metadata?: Json | null
          session_status?: string | null
          started_at?: string | null
          total_tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          message_count?: number | null
          persona_profile_id?: string | null
          relationship_type?: string
          session_metadata?: Json | null
          session_status?: string | null
          started_at?: string | null
          total_tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_persona_profile_id_fkey"
            columns: ["persona_profile_id"]
            isOneToOne: false
            referencedRelation: "active_persona_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_persona_profile_id_fkey"
            columns: ["persona_profile_id"]
            isOneToOne: false
            referencedRelation: "persona_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_patterns: {
        Row: {
          conversation_topic: string | null
          created_at: string | null
          disc: string | null
          effectiveness_score: number | null
          emotional_context: string | null
          enneagram: string | null
          example_responses: Json | null
          id: string
          mbti: string
          pattern_category: string
          pattern_embedding: string | null
          pattern_text: string
          relationship_type: string
          usage_frequency: number | null
        }
        Insert: {
          conversation_topic?: string | null
          created_at?: string | null
          disc?: string | null
          effectiveness_score?: number | null
          emotional_context?: string | null
          enneagram?: string | null
          example_responses?: Json | null
          id?: string
          mbti: string
          pattern_category: string
          pattern_embedding?: string | null
          pattern_text: string
          relationship_type: string
          usage_frequency?: number | null
        }
        Update: {
          conversation_topic?: string | null
          created_at?: string | null
          disc?: string | null
          effectiveness_score?: number | null
          emotional_context?: string | null
          enneagram?: string | null
          example_responses?: Json | null
          id?: string
          mbti?: string
          pattern_category?: string
          pattern_embedding?: string | null
          pattern_text?: string
          relationship_type?: string
          usage_frequency?: number | null
        }
        Relationships: []
      }
      persona_profiles: {
        Row: {
          behavioral_patterns: Json | null
          communication_style: Json | null
          created_at: string | null
          creator_id: string | null
          creator_usage_count: number | null
          disc: string | null
          enneagram: string | null
          id: string
          is_active: boolean | null
          is_official: boolean | null
          last_used_at: string | null
          mbti: string
          persona_description: string | null
          persona_name: string
          profile_embedding: string | null
          public_usage_count: number | null
          traits: Json | null
          updated_at: string | null
          usage_count: number | null
          visibility: string | null
        }
        Insert: {
          behavioral_patterns?: Json | null
          communication_style?: Json | null
          created_at?: string | null
          creator_id?: string | null
          creator_usage_count?: number | null
          disc?: string | null
          enneagram?: string | null
          id?: string
          is_active?: boolean | null
          is_official?: boolean | null
          last_used_at?: string | null
          mbti: string
          persona_description?: string | null
          persona_name: string
          profile_embedding?: string | null
          public_usage_count?: number | null
          traits?: Json | null
          updated_at?: string | null
          usage_count?: number | null
          visibility?: string | null
        }
        Update: {
          behavioral_patterns?: Json | null
          communication_style?: Json | null
          created_at?: string | null
          creator_id?: string | null
          creator_usage_count?: number | null
          disc?: string | null
          enneagram?: string | null
          id?: string
          is_active?: boolean | null
          is_official?: boolean | null
          last_used_at?: string | null
          mbti?: string
          persona_description?: string | null
          persona_name?: string
          profile_embedding?: string | null
          public_usage_count?: number | null
          traits?: Json | null
          updated_at?: string | null
          usage_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_profiles_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          disc: string | null
          email: string | null
          enneagram: string | null
          full_name: string | null
          id: string
          mbti: string | null
          my_avatar_persona_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          disc?: string | null
          email?: string | null
          enneagram?: string | null
          full_name?: string | null
          id: string
          mbti?: string | null
          my_avatar_persona_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          disc?: string | null
          email?: string | null
          enneagram?: string | null
          full_name?: string | null
          id?: string
          mbti?: string | null
          my_avatar_persona_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_my_avatar_persona"
            columns: ["my_avatar_persona_id"]
            isOneToOne: false
            referencedRelation: "active_persona_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_my_avatar_persona"
            columns: ["my_avatar_persona_id"]
            isOneToOne: false
            referencedRelation: "persona_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_persona_stats: {
        Row: {
          creator_name: string | null
          creator_usage_count: number | null
          disc: string | null
          enneagram: string | null
          id: string | null
          is_official: boolean | null
          last_used_at: string | null
          mbti: string | null
          persona_name: string | null
          public_usage_count: number | null
          session_count: number | null
          total_messages: number | null
          usage_count: number | null
          visibility: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      search_similar_patterns: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
          target_disc?: string
          target_enneagram?: string
          target_mbti: string
          target_relationship: string
        }
        Returns: {
          example_responses: Json
          id: string
          pattern_text: string
          similarity: number
        }[]
      }
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
  public: {
    Enums: {},
  },
} as const
