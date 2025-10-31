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

    console.log('Webhook received:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId

        console.log('Checkout completed for user:', userId)

        if (userId) {
          // Update user to premium
          const { error } = await supabase
            .from('profiles')
            .update({ 
              subscription_tier: 'premium',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (error) {
            console.error('Error updating user:', error)
            throw error
          }

          console.log('User upgraded to premium:', userId)
        }
        break
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // If subscription is canceled or expired
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          const customer = await stripe.customers.retrieve(subscription.customer as string)
          
          if ('email' in customer && customer.email) {
            console.log('Downgrading user:', customer.email)
            
            // Downgrade user to free
            const { error } = await supabase
              .from('profiles')
              .update({ 
                subscription_tier: 'free',
                updated_at: new Date().toISOString()
              })
              .eq('email', customer.email)

            if (error) {
              console.error('Error downgrading user:', error)
              throw error
            }

            console.log('User downgraded to free:', customer.email)
          }
        }
        break
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      }
    )
  }
})
