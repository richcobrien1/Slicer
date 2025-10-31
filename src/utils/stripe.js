import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabaseClient';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/**
 * Create Stripe checkout session for premium subscription
 */
export const createCheckoutSession = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to upgrade');
    }

    // Call Supabase Edge Function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
        successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.origin,
        customerEmail: user.email,
        userId: user.id
      }
    });

    if (error) throw error;

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error: redirectError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (redirectError) throw redirectError;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Create Stripe portal session for managing subscription
 */
export const createPortalSession = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in');
    }

    // Call Supabase Edge Function to create portal session
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        returnUrl: window.location.origin,
        userId: user.id
      }
    });

    if (error) throw error;

    // Redirect to Stripe Portal
    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

/**
 * Check if checkout was successful from URL params
 */
export const checkCheckoutSuccess = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (!sessionId) return null;

  try {
    // Verify session with backend
    const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
      body: { sessionId }
    });

    if (error) throw error;

    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname);

    return data;
  } catch (error) {
    console.error('Error verifying checkout:', error);
    return null;
  }
};
