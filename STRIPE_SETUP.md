# Stripe Integration Setup Guide

## 1. Environment Variables

Add to your `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_STRIPE_PRICE_ID=price_your_monthly_price_id
```

Add to Vercel Environment Variables:
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PRICE_ID`

## 2. Create Stripe Product & Price

1. Go to: https://dashboard.stripe.com/products
2. Click **Add Product**
3. Set:
   - Name: "Slicer Premium"
   - Description: "Cloud sync, unlimited storage, priority support"
   - Pricing: Recurring monthly (e.g., $9.99/month)
4. Save and copy the **Price ID** (starts with `price_`)
5. Add Price ID to your `.env` as `VITE_STRIPE_PRICE_ID`

## 3. Supabase Edge Functions

Create these Edge Functions in Supabase:

### Function 1: create-checkout-session

```typescript
// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail, userId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        userId: userId,
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }
})
```

### Function 2: stripe-webhook

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId

        if (userId) {
          // Update user to premium
          await supabase
            .from('profiles')
            .update({ subscription_tier: 'premium' })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if ('email' in customer) {
          // Downgrade user to free
          await supabase
            .from('profiles')
            .update({ subscription_tier: 'free' })
            .eq('email', customer.email)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

## 4. Deploy Edge Functions

Install Supabase CLI:
```bash
npm install -g supabase
```

Login and link project:
```bash
supabase login
supabase link --project-ref your-project-ref
```

Deploy functions:
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

Set secrets:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 5. Configure Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Set endpoint URL to:
   ```
   https://your-project-ref.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Supabase secrets:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret
   ```

## 6. Test Payment Flow

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Any ZIP code

## 7. Production Checklist

- [ ] Switch to Live Mode keys in Stripe
- [ ] Update all environment variables with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment methods
- [ ] Set up Stripe billing portal
- [ ] Configure email receipts in Stripe
