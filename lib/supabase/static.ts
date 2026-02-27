import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client for static generation (e.g. generateStaticParams).
 * Does not use cookies, so it can run outside request context.
 * Use only for public read operations (e.g. listing published blogs).
 */
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
