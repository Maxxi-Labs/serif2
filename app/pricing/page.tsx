import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PricingButton } from './pricing-button'

export const dynamic = 'force-dynamic'

const freePlanFeatures = [
  'Unlimited manual blog posts',
  'Publish & manage drafts',
  'Custom blog slugs',
  'Public blog page',
]

const proPlanFeatures = [
  'Everything in Free',
  'AI blog generation with GPT-5.1',
  'Priority support',
  'Early access to new features',
]

export default async function PricingPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims?.sub

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight font-serif">Simple pricing</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start for free. Upgrade to Pro for AI-powered blog creation and all features.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free plan */}
          <div className="rounded-2xl border bg-card p-8 flex flex-col gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Free</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground mb-1">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for getting started.</p>
            </div>

            <ul className="flex-1 space-y-3">
              {freePlanFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="size-4 text-muted-foreground shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="rounded-lg border px-4 py-2.5 text-center text-sm text-muted-foreground">
              Current plan
            </div>
          </div>

          {/* Pro plan */}
          <div className="rounded-2xl border-2 border-foreground bg-card p-8 flex flex-col gap-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-full">
                Most popular
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-wide">Pro</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">$20</span>
                <span className="text-muted-foreground mb-1">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Unlock AI blog creation and all features.</p>
            </div>

            <ul className="flex-1 space-y-3">
              {proPlanFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="size-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <PricingButton isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </section>
  )
}
