import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/signup', req.url));

  const formData = await req.formData();
  const plan = String(formData.get('plan') || 'monthly');
  const price = plan === 'full' ? process.env.STRIPE_PRICE_FULL_PACK : process.env.STRIPE_PRICE_MONTHLY;
  const mode = plan === 'full' ? 'payment' : 'subscription';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  if (!price || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.redirect(new URL('/pricing?error=missing-stripe-env', req.url));
  }

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price, quantity: 1 }],
    customer_email: user.email || undefined,
    success_url: `${siteUrl}/dashboard?paid=1`,
    cancel_url: `${siteUrl}/pricing?cancelled=1`,
    metadata: { user_id: user.id, plan }
  });
  return NextResponse.redirect(session.url!, { status: 303 });
}
