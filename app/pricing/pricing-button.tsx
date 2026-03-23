'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface PricingButtonProps {
  isLoggedIn: boolean
}

export function PricingButton({ isLoggedIn }: PricingButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpgrade() {
    if (!isLoggedIn) {
      router.push('/auth/login?redirect=/pricing')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })

      if (res.status === 401) {
        router.push('/auth/login?redirect=/pricing')
        return
      }

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Failed to create checkout session')
      }

      window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-full" onClick={handleUpgrade} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Redirecting…
        </>
      ) : isLoggedIn ? (
        'Upgrade to Pro'
      ) : (
        'Get started'
      )}
    </Button>
  )
}
