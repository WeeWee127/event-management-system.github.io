export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          location: string
          start_date: string
          end_date: string
          max_attendees: number | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          location: string
          start_date: string
          end_date: string
          max_attendees?: number | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          location?: string
          start_date?: string
          end_date?: string
          max_attendees?: number | null
          user_id?: string
        }
      }
      registrations: {
        Row: {
          id: string
          created_at: string
          event_id: string
          user_id: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          user_id: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          user_id?: string
          status?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          full_name: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          avatar_url?: string | null
        }
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
  }
}