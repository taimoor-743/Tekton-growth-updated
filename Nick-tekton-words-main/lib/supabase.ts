import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// New database structure interfaces
export interface Project {
  id: string
  project_name: string
  business_details: string
  created_at: string
}

export interface ProjectUsage {
  id: string
  project_id: string
  website_structure: string
  output_link?: string
  status: 'pending' | 'ready' | 'error'
  error_message?: string
  created_at: string
  updated_at: string
}

// Combined interface for display purposes
export interface Request {
  id: string
  project_name: string
  business_details: string
  website_structure: string
  output_link?: string
  status: 'pending' | 'ready' | 'error'
  error_message?: string
  created_at: string
  updated_at: string
}