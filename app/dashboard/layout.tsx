import type { ReactNode } from 'react'
import { House, NotebookPen, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { DashboardUserMenu } from '@/components/dashboard-user-menu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'

type DashboardLayoutProps = {
  children: ReactNode
}

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: House },
  { href: '/dashboard/blogs', label: 'Blogs', icon: NotebookPen },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function getFallbackIdentity(rawClaims: unknown) {
  const claims = (rawClaims ?? {}) as Record<string, unknown>
  const email = typeof claims.email === 'string' ? claims.email : ''
  const userMetadata =
    typeof claims.user_metadata === 'object' && claims.user_metadata !== null
      ? (claims.user_metadata as Record<string, unknown>)
      : {}
  const nameCandidate = [
    userMetadata.full_name,
    userMetadata.name,
    claims.preferred_username,
    claims.name,
  ].find((value) => typeof value === 'string' && value.length > 0) as string | undefined
  const displayName = nameCandidate ?? (email ? email.split('@')[0] : 'User')
  const avatarUrlCandidate = [userMetadata.avatar_url, claims.picture].find(
    (value) => typeof value === 'string' && value.length > 0
  ) as string | undefined
  return { displayName, email: email || 'No email', avatarUrl: avatarUrlCandidate }
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect('/auth/login')
  }

  const fallback = getFallbackIdentity(data.claims)
  const userId = typeof data.claims.sub === 'string' ? data.claims.sub : null

  let displayName = fallback.displayName
  let avatarUrl = fallback.avatarUrl

  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, avatar_url')
      .eq('id', userId)
      .single()

    if (profile?.first_name) {
      displayName = profile.first_name
    }
    if (profile?.avatar_url) {
      avatarUrl = profile.avatar_url
    }
  }

  const userIdentity = {
    displayName,
    email: fallback.email,
    avatarUrl,
  }

  return (
    <div className="bg-muted/20 flex h-svh overflow-hidden">
      <aside className="bg-background hidden h-full w-64 border-r md:flex md:flex-col">
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold font-serif">
            <Image src="/icon.png" alt="" width={24} height={24} />
            Serif
          </Link>
        </div>
        <Separator />
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href={href}>
                <Icon className="size-4" />
                {label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="bg-background flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            {navItems.map(({ href, label }) => (
              <Button key={href} variant="ghost" size="sm" asChild>
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>
          <div className="ml-auto">
            <DashboardUserMenu
              name={userIdentity.displayName}
              email={userIdentity.email}
              avatarUrl={userIdentity.avatarUrl}
            />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
