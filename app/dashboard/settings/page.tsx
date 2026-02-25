import { redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardSettingsPage() {
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.getClaims()

  if (authError || !authData?.claims) {
    redirect('/auth/login')
  }

  const userId = typeof authData.claims.sub === 'string' ? authData.claims.sub : null
  let profile: { first_name: string | null; avatar_url: string | null } | null = null

  if (userId) {
    const { data } = await supabase
      .from('profiles')
      .select('first_name, avatar_url')
      .eq('id', userId)
      .single()
    profile = data
  }

  const displayName =
    profile?.first_name ?? (typeof authData.claims.email === 'string' ? authData.claims.email : 'No name set')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Account</p>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        </div>
        <Badge variant="outline">Profile</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public profile</CardTitle>
          <CardDescription>Your profile information from the profiles table.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium">Display name</p>
            <p className="text-muted-foreground rounded-md border px-3 py-2">{displayName}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">Bio</p>
            <p className="text-muted-foreground rounded-md border px-3 py-2">
              Writer focused on clean interfaces, product storytelling, and technical content.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Example toggles and defaults for your future settings UI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <p>Email digest</p>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <p>Comment notifications</p>
            <Badge variant="outline">Disabled</Badge>
          </div>
          <Separator />
          <p className="text-muted-foreground">
            Replace these rows with real form controls when settings endpoints are ready.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
