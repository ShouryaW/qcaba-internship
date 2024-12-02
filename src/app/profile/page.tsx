'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if not authenticated
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' }); // Log out and redirect to login page
  };

  const handleBuyMembership = () => {
    router.push('/membership'); // Navigate to Membership page
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome, {session?.user?.email}</h1>
        <div className={styles.headerButtons}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div className={styles.profileContent}>
        <div className={styles.section}>
          <h2>Membership</h2>
          <p>{session?.user?.membership || 'You do not have a membership yet.'}</p>
          {!session?.user?.membership && (
            <button className={styles.buyMembershipButton} onClick={handleBuyMembership}>
              Buy Membership
            </button>
          )}
        </div>

        <div className={styles.section}>
          <h2>Personal Information</h2>
          <p>
            <strong>Email:</strong> {session?.user?.email}
          </p>
          <p>
            <strong>Password:</strong>{' '}
            {showPassword ? session?.user?.password : '•••••••••'}
            <button
              onClick={togglePasswordVisibility}
              className={styles.revealButton}
            >
              {showPassword ? 'Hide' : 'Reveal'}
            </button>
          </p>
        </div>

        {session?.user?.membership && (
          <div className={styles.section}>
            <h2>Membership Benefits</h2>
            <ul>
              <li>Discounted events and courses</li>
              <li>Access to exclusive resources</li>
              <li>Networking opportunities</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
