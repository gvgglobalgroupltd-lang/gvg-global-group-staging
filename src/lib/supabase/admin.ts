import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Typed Supabase client for server-side operations
 * Use this when you need admin access or service role permissions
 */
export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)
