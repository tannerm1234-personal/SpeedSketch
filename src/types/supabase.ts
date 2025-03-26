export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_challenges: {
        Row: {
          challenge_date: string
          created_at: string | null
          id: string
          prompt_id: string | null
        }
        Insert: {
          challenge_date: string
          created_at?: string | null
          id?: string
          prompt_id?: string | null
        }
        Update: {
          challenge_date?: string
          created_at?: string | null
          id?: string
          prompt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_challenges_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "game_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      game_prompts: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          difficulty: number | null
          id: string
          last_used: string | null
          word: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          last_used?: string | null
          word: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          difficulty?: number | null
          id?: string
          last_used?: string | null
          word?: string
        }
        Relationships: []
      }
      sketches: {
        Row: {
          confidence: number
          created_at: string | null
          id: string
          image_url: string | null
          object_name: string
          rating: number | null
          time_seconds: number
        }
        Insert: {
          confidence: number
          created_at?: string | null
          id?: string
          image_url?: string | null
          object_name: string
          rating?: number | null
          time_seconds: number
        }
        Update: {
          confidence?: number
          created_at?: string | null
          id?: string
          image_url?: string | null
          object_name?: string
          rating?: number | null
          time_seconds?: number
        }
        Relationships: []
      }
      user_games: {
        Row: {
          confidence_level: number | null
          created_at: string | null
          id: string
          prompt_id: string | null
          sketch_data: Json | null
          success: boolean
          time_remaining: number | null
          user_id: string
          word: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          sketch_data?: Json | null
          success: boolean
          time_remaining?: number | null
          user_id: string
          word: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          sketch_data?: Json | null
          success?: boolean
          time_remaining?: number | null
          user_id?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_games_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "game_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          average_time: number | null
          best_streak: number | null
          current_streak: number | null
          fastest_time: number | null
          games_played: number | null
          games_won: number | null
          last_played_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_time?: number | null
          best_streak?: number | null
          current_streak?: number | null
          fastest_time?: number | null
          games_played?: number | null
          games_won?: number | null
          last_played_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_time?: number | null
          best_streak?: number | null
          current_streak?: number | null
          fastest_time?: number | null
          games_played?: number | null
          games_won?: number | null
          last_played_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: string | null
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          subscription: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      daily_leaderboard: {
        Row: {
          created_at: string | null
          daily_rank: number | null
          id: string | null
          name: string | null
          time_remaining: number | null
          word: string | null
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          average_time: number | null
          best_streak: number | null
          current_streak: number | null
          fastest_time: number | null
          games_played: number | null
          games_won: number | null
          id: string | null
          name: string | null
          rank: number | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
