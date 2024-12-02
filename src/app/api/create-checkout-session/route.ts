import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { membershipType } = req.body;

    // Map membership types to fake price IDs
    const prices = {
      student: 'price_1HXXXXXXXXXXXXXX1', // Replace with Stripe test price IDs
      regular: 'price_1HXXXXXXXXXXXXXX2',
      sustaining: 'price_1HXXXXXXXXXXXXXX3',
    };

    const priceId = prices[membershipType];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid membership type' });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
