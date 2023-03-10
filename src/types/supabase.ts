export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: number
          user_id: string
          category_id: number
          name: string
          activity_d: string
          start_time: string
          duration_hours: number
          duration_minutes: number
          inserted_at: string
        }
        Insert: {
          id?: number
          user_id: string
          category_id: number
          name: string
          activity_d: string
          start_time: string
          duration_hours: number
          duration_minutes: number
          inserted_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          category_id?: number
          name?: string
          activity_d?: string
          start_time?: string
          duration_hours?: number
          duration_minutes?: number
          inserted_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          user_id: string
          name: string
          inserted_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          inserted_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          inserted_at?: string
        }
      }
      user_profiles: {
        Row: {
          user_id: string
          username: string | null
        }
        Insert: {
          user_id: string
          username?: string | null
        }
        Update: {
          user_id?: string
          username?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
