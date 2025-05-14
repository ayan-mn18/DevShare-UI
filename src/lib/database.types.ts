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
      users: {
        Row: {
          id: string
          email: string | null
          twitter_username: string | null
          leetcode_username: string | null
          github_username: string | null
          test_tweet_used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          twitter_username?: string | null
          leetcode_username?: string | null
          github_username?: string | null
          test_tweet_used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          twitter_username?: string | null
          leetcode_username?: string | null
          github_username?: string | null
          test_tweet_used?: boolean
          created_at?: string
        }
      }
      bots: {
        Row: {
          id: string
          user_id: string
          name: string
          status: string
          access_token: string | null
          refresh_token: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          status?: string
          access_token?: string | null
          refresh_token?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          status?: string
          access_token?: string | null
          refresh_token?: string | null
          created_at?: string
        }
      }
      tweets: {
        Row: {
          id: string
          bot_id: string
          content: string
          schedule_time: string
          status: string
          leetcode_contribution: number | null
          github_contribution: number | null
          created_at: string
        }
        Insert: {
          id?: string
          bot_id: string
          content: string
          schedule_time: string
          status?: string
          leetcode_contribution?: number | null
          github_contribution?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          bot_id?: string
          content?: string
          schedule_time?: string
          status?: string
          leetcode_contribution?: number | null
          github_contribution?: number | null
          created_at?: string
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