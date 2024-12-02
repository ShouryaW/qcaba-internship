'use client';

import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import './globals.css';
import styles from './Layout.module.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>QCABA - Québec Association of Behavior Analysis</title>
        <meta name="description" content="QCABA - Promoting Behavior Analysis in Québec" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={styles.container}>
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <footer className={styles.footer}>
            <p>Contact us at <a href="mailto:info@qcaba.org">info@qcaba.org</a></p>
            <p>Location: Montréal, Québec, Canada</p>
            <p>&copy; 2024 Québec Association of Behavior Analysis (QCABA). All rights reserved.</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}

function Header() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <img src="/logo.png" alt="QCABA Logo" width={120} height={120} />
      </Link>
      <nav className={styles.nav}>
        <Link href="/about" className={styles.navLink}>About</Link>
        <Link href="/membership" className={styles.navLink}>Membership</Link>
        <Link href="/events" className={styles.navLink}>Events</Link>
        {status === 'authenticated' ? (
          <Link href="/profile" className={styles.navLink}>Profile</Link>
        ) : (
          <Link href="/login" className={styles.navLink}>Login</Link>
        )}
      </nav>
    </header>
  );
}
