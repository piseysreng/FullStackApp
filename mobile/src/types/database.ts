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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          error_message: string | null
          id: number
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          status: Database["public"]["Enums"]["log_status"]
          user_agent: string | null
          user_id: number
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          id?: never
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          status?: Database["public"]["Enums"]["log_status"]
          user_agent?: string | null
          user_id: number
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          id?: never
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          status?: Database["public"]["Enums"]["log_status"]
          user_agent?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: number
          created_at: string
          id: number
          product_id: number
          quantity: number
          updated_at: string
        }
        Insert: {
          cart_id: number
          created_at?: string
          id?: never
          product_id: number
          quantity?: number
          updated_at?: string
        }
        Update: {
          cart_id?: number
          created_at?: string
          id?: never
          product_id?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_carts_id_fk"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: number
          session_id: string
          total_items: number
          total_price: number
          updated_at: string
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: never
          session_id: string
          total_items?: number
          total_price?: number
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: never
          session_id?: string
          total_items?: number
          total_price?: number
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image: string
          name: string
          parent_id: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          image?: string
          name: string
          parent_id?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          image?: string
          name?: string
          parent_id?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id: string
          is_active: boolean
          max_discount: number | null
          min_order_amount: number | null
          start_date: string
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order_amount?: number | null
          start_date: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order_amount?: number | null
          start_date?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      order_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: number
          notes: string | null
          order_id: number
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: never
          notes?: string | null
          order_id: number
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: never
          notes?: string | null
          order_id?: number
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_history_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          price_at_purchase: number
          product_id: number
          product_name: string
          quantity: number
          sku: string
          total_price: number
        }
        Insert: {
          id?: never
          order_id: number
          price_at_purchase: number
          product_id: number
          product_name: string
          quantity?: number
          sku: string
          total_price: number
        }
        Update: {
          id?: never
          order_id?: number
          price_at_purchase?: number
          product_id?: number
          product_name?: string
          quantity?: number
          sku?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: string
          coupon_id: string | null
          created_at: string
          discount_amount: number
          estimated_delivery_date: string | null
          id: number
          order_number: string
          shipping_address: string
          shipping_method_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          sub_total: number
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: number
        }
        Insert: {
          billing_address: string
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          estimated_delivery_date?: string | null
          id?: never
          order_number: string
          shipping_address: string
          shipping_method_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          sub_total?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id: number
        }
        Update: {
          billing_address?: string
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          estimated_delivery_date?: string | null
          id?: never
          order_number?: string
          shipping_address?: string
          shipping_method_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          sub_total?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_brand: string
          created_at: string
          exp_month: number
          exp_year: number
          id: number
          is_default: boolean
          last4: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_payment_method_id: string
          updated_at: string
          user_id: number
        }
        Insert: {
          card_brand: string
          created_at?: string
          exp_month: number
          exp_year: number
          id?: never
          is_default?: boolean
          last4: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_payment_method_id: string
          updated_at?: string
          user_id: number
        }
        Update: {
          card_brand?: string
          created_at?: string
          exp_month?: number
          exp_year?: number
          id?: never
          is_default?: boolean
          last4?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_payment_method_id?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attribute_value: {
        Row: {
          attribute_id: number
          id: number
          product_id: number
          value: string
        }
        Insert: {
          attribute_id: number
          id?: never
          product_id: number
          value: string
        }
        Update: {
          attribute_id?: number
          id?: never
          product_id?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_value_attribute_id_product_attributes_id_fk"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attribute_value_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: never
          name: string
          slug: string
        }
        Update: {
          id?: never
          name?: string
          slug?: string
        }
        Relationships: []
      }
      product_favorites: {
        Row: {
          created_at: string
          id: number
          product_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: never
          product_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          id?: never
          product_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_favorites_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_favorites_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          is_verified: boolean
          product_id: number
          rating: number
          user_id: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: never
          is_verified?: boolean
          product_id: number
          rating: number
          user_id: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: never
          is_verified?: boolean
          product_id?: number
          rating?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          favoriteCount: number
          featureImage: string
          galleryImages: string[]
          id: number
          isPublished: boolean
          name: string
          price: number
          ratingAvg: number
          reviewCount: number
          sku: string | null
          slug: string | null
          stockQuantity: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          favoriteCount?: number
          featureImage?: string
          galleryImages?: string[]
          id?: never
          isPublished?: boolean
          name: string
          price: number
          ratingAvg?: number
          reviewCount?: number
          sku?: string | null
          slug?: string | null
          stockQuantity?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          favoriteCount?: number
          featureImage?: string
          galleryImages?: string[]
          id?: never
          isPublished?: boolean
          name?: string
          price?: number
          ratingAvg?: number
          reviewCount?: number
          sku?: string | null
          slug?: string | null
          stockQuantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      products_to_categories: {
        Row: {
          category_id: number
          product_id: number
        }
        Insert: {
          category_id: number
          product_id: number
        }
        Update: {
          category_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_to_categories_category_id_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_to_categories_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          base_cost: number
          carrier_name: string
          created_at: string
          free_shipping_threshold: number | null
          id: number
          is_active: boolean
          max_days: number
          min_days: number
          name: string
          updated_at: string
        }
        Insert: {
          base_cost?: number
          carrier_name: string
          created_at?: string
          free_shipping_threshold?: number | null
          id?: never
          is_active?: boolean
          max_days: number
          min_days: number
          name: string
          updated_at?: string
        }
        Update: {
          base_cost?: number
          carrier_name?: string
          created_at?: string
          free_shipping_threshold?: number | null
          id?: never
          is_active?: boolean
          max_days?: number
          min_days?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          error_message: string | null
          gateway_transaction_id: string | null
          id: number
          order_id: number
          payment_gateway: Database["public"]["Enums"]["payment_gateway"]
          payment_method_details: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          user_id: number
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          error_message?: string | null
          gateway_transaction_id?: string | null
          id?: never
          order_id: number
          payment_gateway: Database["public"]["Enums"]["payment_gateway"]
          payment_method_details?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id: number
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          error_message?: string | null
          gateway_transaction_id?: string | null
          id?: never
          order_id?: number
          payment_gateway?: Database["public"]["Enums"]["payment_gateway"]
          payment_method_details?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string
          clerkId: string | null
          created_at: string
          email: string | null
          firstName: string | null
          id: number
          isActive: boolean
          lastName: string | null
          role: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar?: string
          clerkId?: string | null
          created_at?: string
          email?: string | null
          firstName?: string | null
          id?: never
          isActive?: boolean
          lastName?: string | null
          role?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar?: string
          clerkId?: string | null
          created_at?: string
          email?: string | null
          firstName?: string | null
          id?: never
          isActive?: boolean
          lastName?: string | null
          role?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      discount_type: "PERCENTAGE" | "FIXED_AMOUNT"
      log_status: "SUCCESS" | "FAILURE"
      order_status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
      payment_gateway: "STRIPE" | "PAYPAL" | "BANK_TRANSFER" | "COD"
      payment_provider: "STRIPE" | "PAYPAL"
      transaction_status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
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
      discount_type: ["PERCENTAGE", "FIXED_AMOUNT"],
      log_status: ["SUCCESS", "FAILURE"],
      order_status: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
      payment_gateway: ["STRIPE", "PAYPAL", "BANK_TRANSFER", "COD"],
      payment_provider: ["STRIPE", "PAYPAL"],
      transaction_status: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
    },
  },
} as const
