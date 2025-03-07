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
      tickets: {
        Row: {
          id: string
          client_id: string | null
          client_name: string
          location: string
          status: 'open' | 'in-progress' | 'resolved'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          description: string
          created_at: string
          updated_at: string
          assigned_to: string | null
          temperature: number | null
          equipment_type: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          client_name: string
          location: string
          status?: 'open' | 'in-progress' | 'resolved'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          description: string
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          temperature?: number | null
          equipment_type?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          client_name?: string
          location?: string
          status?: 'open' | 'in-progress' | 'resolved'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          description?: string
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          temperature?: number | null
          equipment_type?: string | null
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
      ticket_priority: 'low' | 'medium' | 'high' | 'urgent'
      ticket_status: 'open' | 'in-progress' | 'resolved'
    }
  }
}