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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number | null
          booking_date: string
          booking_type: string | null
          coach_id: string | null
          court_id: string
          created_at: string
          duration_minutes: number | null
          end_time: string
          id: string
          is_prime_time: boolean | null
          notes: string | null
          opponent_name: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          booking_date: string
          booking_type?: string | null
          coach_id?: string | null
          court_id: string
          created_at?: string
          duration_minutes?: number | null
          end_time: string
          id?: string
          is_prime_time?: boolean | null
          notes?: string | null
          opponent_name?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          booking_date?: string
          booking_type?: string | null
          coach_id?: string | null
          court_id?: string
          created_at?: string
          duration_minutes?: number | null
          end_time?: string
          id?: string
          is_prime_time?: boolean | null
          notes?: string | null
          opponent_name?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_availability: {
        Row: {
          coach_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          is_available: boolean | null
          notes: string | null
          recurring: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          recurring?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          recurring?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      coaching_sessions: {
        Row: {
          amount: number | null
          coach_id: string
          court_id: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          session_date: string
          session_type: string | null
          start_time: string
          status: Database["public"]["Enums"]["session_status"] | null
          student_id: string | null
          student_name: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          coach_id: string
          court_id?: string | null
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          session_date: string
          session_type?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["session_status"] | null
          student_id?: string | null
          student_name?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          coach_id?: string
          court_id?: string | null
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          session_date?: string
          session_type?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          student_id?: string | null
          student_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_sessions_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          notes: string | null
          status: Database["public"]["Enums"]["court_status"] | null
          surface: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: Database["public"]["Enums"]["court_status"] | null
          surface?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["court_status"] | null
          surface?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dependents: {
        Row: {
          created_at: string
          date_of_birth: string | null
          id: string
          is_active: boolean | null
          member_id: string
          name: string
          relationship: Database["public"]["Enums"]["dependent_relationship"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_active?: boolean | null
          member_id: string
          name: string
          relationship: Database["public"]["Enums"]["dependent_relationship"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_active?: boolean | null
          member_id?: string
          name?: string
          relationship?: Database["public"]["Enums"]["dependent_relationship"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependents_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          entry_date: string
          id: string
          is_cash: boolean | null
          notes: string | null
          receipt_url: string | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_date: string
          id?: string
          is_cash?: boolean | null
          notes?: string | null
          receipt_url?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_date?: string
          id?: string
          is_cash?: boolean | null
          notes?: string | null
          receipt_url?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          booking_id: string | null
          created_at: string
          description: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          receipt_url: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      pledges: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          member_id: string | null
          notes: string | null
          paid_amount: number | null
          pledge_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          pledge_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          pledge_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string | null
          id: string
          membership_end: string | null
          membership_start: string | null
          membership_type: Database["public"]["Enums"]["membership_type"] | null
          phone: string | null
          status: Database["public"]["Enums"]["member_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id?: string
          membership_end?: string | null
          membership_start?: string | null
          membership_type?:
            | Database["public"]["Enums"]["membership_type"]
            | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string | null
          id?: string
          membership_end?: string | null
          membership_start?: string | null
          membership_type?:
            | Database["public"]["Enums"]["membership_type"]
            | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          entry_date: string
          id: string
          is_cash: boolean | null
          member_id: string | null
          notes: string | null
          payment_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_date: string
          id?: string
          is_cash?: boolean | null
          member_id?: string | null
          notes?: string | null
          payment_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entry_date?: string
          id?: string
          is_cash?: boolean | null
          member_id?: string | null
          notes?: string | null
          payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_entries_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "member" | "coach"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      court_status: "active" | "maintenance" | "closed"
      dependent_relationship:
        | "spouse"
        | "child"
        | "parent"
        | "sibling"
        | "other"
      member_status: "active" | "inactive" | "suspended"
      membership_type: "monthly" | "annual" | "pay_as_you_play"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      session_status:
        | "pending"
        | "confirmed"
        | "rejected"
        | "completed"
        | "cancelled"
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
    Enums: {
      app_role: ["admin", "member", "coach"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      court_status: ["active", "maintenance", "closed"],
      dependent_relationship: ["spouse", "child", "parent", "sibling", "other"],
      member_status: ["active", "inactive", "suspended"],
      membership_type: ["monthly", "annual", "pay_as_you_play"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      session_status: [
        "pending",
        "confirmed",
        "rejected",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
