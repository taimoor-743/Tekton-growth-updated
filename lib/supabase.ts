import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Request {
  id: string
  project_name: string
  business_details: string
  website_structure: string
  output_link?: string
  status: 'pending' | 'ready' | 'error' | 'saved'
  error_message?: string
  created_at: string
  updated_at: string
}
