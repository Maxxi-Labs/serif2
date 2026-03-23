-- Add subscription_status to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'free';

-- ─── subscriptions ────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id     text NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  status                 text NOT NULL,
  price_id               text,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean NOT NULL DEFAULT false,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role bypasses RLS for inserts/updates from webhook
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
  RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscriptions_updated_at();

-- ─── transactions ─────────────────────────────────────────────────────────────
CREATE TABLE transactions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_event_id        text NOT NULL UNIQUE,
  event_type             text NOT NULL,
  amount                 integer,
  currency               text,
  status                 text,
  stripe_customer_id     text,
  stripe_subscription_id text,
  raw_data               jsonb,
  created_at             timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role bypasses RLS for inserts from webhook
CREATE POLICY "Service role can manage transactions"
  ON transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
