import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:gap-2">
      <p className="text-center text-sm sm:text-base break-all">
        Hello <span>{data.claims.email}</span>
      </p>
      <LogoutButton />
    </div>
  )
}
