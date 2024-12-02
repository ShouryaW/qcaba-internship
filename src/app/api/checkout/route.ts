import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function POST(req: Request) {
  try {
    const { membershipType } = await req.json();

    const prices = {
      student: 'price_1QROgs02tRX1xISQGNHltBfU',
      regular: 'price_1QROhy02tRX1xISQQmJliIA4',
      sustaining: 'price_1QROiV02tRX1xISQJw1REuvf',
      affiliate: 'price_1QROhY02tRX1xISQVMTWVipC',
    };

    const priceId = prices[membershipType];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid membership type' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
