'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './Checkout.module.css';

const Checkout: React.FC = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const membership = searchParams.get('membership');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!membership) {
      alert('No membership type selected!');
      router.push('/membership');
    }
  }, [membership, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType: membership }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to create checkout session.');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Checkout Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Secure Checkout</h1>
      <div className={styles.wrapper}>
        <div className={styles.formContainer}>
          <h2 className={styles.subheading}>Payment Details</h2>
          <p>
            <strong>Email:</strong> {session?.user?.email || 'No email available'}
          </p>
          <form onSubmit={handleCheckout}>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Redirecting to Stripe...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
        <div className={styles.detailsContainer}>
          <h2 className={styles.subheading}>Membership Details</h2>
          <p className={styles.membershipTitle}>
            <strong>Type:</strong> {membership}
          </p>
          <p className={styles.description}>
            {membership === 'student' && 'Perfect for students aspiring to enter the field.'}
            {membership === 'regular' && 'Ideal for professionals dedicated to behavior analysis.'}
            {membership === 'sustaining' && 'Support the organization as a key contributor.'}
            {membership === 'affiliate' && 'For those interested in contributing to the community.'}
          </p>
          <p className={styles.price}>
            <strong>Total:</strong> $
            {membership === 'student' ? 20 : membership === 'regular' ? 30 : membership === 'sustaining' ? 60 : 20}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
