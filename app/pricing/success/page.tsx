import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingSuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="size-16 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-serif">You&apos;re now on Pro!</h1>
          <p className="text-muted-foreground">
            Your subscription is active. You now have access to AI blog generation and all Pro
            features.
          </p>
        </div>

        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
