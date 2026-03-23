import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

/** Subscription id on Invoice (Stripe types use parent.subscription_details; webhooks may still send legacy top-level). */
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const nested = invoice.parent?.subscription_details?.subscription
  if (nested) {
    return typeof nested === 'string' ? nested : nested.id
  }
  const legacy = (
    invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }
  ).subscription
  if (!legacy) return null
  return typeof legacy === 'string' ? legacy : legacy.id
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id ?? null

        await supabase.from('transactions').insert({
          user_id: userId,
          stripe_event_id: event.id,
          event_type: event.type,
          amount: session.amount_total,
          currency: session.currency,
          status: session.payment_status,
          stripe_customer_id: session.customer as string | null,
          stripe_subscription_id: session.subscription as string | null,
          raw_data: event.data.object,
        })
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id ?? null

        // Resolve user_id from customer if not in metadata
        let resolvedUserId = userId
        if (!resolvedUserId && subscription.customer) {
          const { data } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', subscription.customer as string)
            .maybeSingle()
          resolvedUserId = data?.user_id ?? null
        }

        const status = subscription.status

        await supabase.from('subscriptions').upsert(
          {
            user_id: resolvedUserId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            status,
            price_id: subscription.items.data[0]?.price?.id ?? null,
            current_period_start: new Date(
              (subscription as unknown as { current_period_start: number }).current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              (subscription as unknown as { current_period_end: number }).current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          },
          { onConflict: 'stripe_subscription_id' }
        )

        if (resolvedUserId) {
          await supabase
            .from('profiles')
            .update({ subscription_status: status })
            .eq('id', resolvedUserId)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        // Skip the initial checkout invoice — already recorded via checkout.session.completed
        if (invoice.billing_reason === 'subscription_create') break

        const subscriptionId = getInvoiceSubscriptionId(invoice)
        if (!subscriptionId) break

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .maybeSingle()

        await supabase.from('transactions').insert({
          user_id: sub?.user_id ?? null,
          stripe_event_id: event.id,
          event_type: event.type,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'paid',
          stripe_customer_id: invoice.customer as string | null,
          stripe_subscription_id: subscriptionId,
          raw_data: event.data.object,
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        const subscriptionId = getInvoiceSubscriptionId(invoice)
        if (!subscriptionId) break

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscriptionId)
          .maybeSingle()

        await supabase.from('transactions').insert({
          user_id: sub?.user_id ?? null,
          stripe_event_id: event.id,
          event_type: event.type,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: 'failed',
          stripe_customer_id: invoice.customer as string | null,
          stripe_subscription_id: subscriptionId,
          raw_data: event.data.object,
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        const { data } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle()

        if (data?.user_id) {
          await supabase
            .from('profiles')
            .update({ subscription_status: 'canceled' })
            .eq('id', data.user_id)
        }
        break
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error(`Webhook handler error [${event.type}]:`, message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
