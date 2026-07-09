import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err:any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId) {
      await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: String(session.customer || ''),
        stripe_subscription_id: String(session.subscription || ''),
        plan: session.metadata?.plan || 'unknown',
        status: session.mode === 'payment' ? 'paid_once' : 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await admin.from('subscriptions').update({ status: subscription.status, updated_at: new Date().toISOString() }).eq('stripe_subscription_id', subscription.id);
  }

  return NextResponse.json({ received: true });
}
