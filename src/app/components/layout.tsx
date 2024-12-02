import './globals.css';  // Global styles for smooth scrolling and resets
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './components/Layout.module.css';  // Correct path

// Root Layout component
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.logo}>
              <Image src="/logo.png" alt="QCABA Logo" width={50} height={50} />
            </div>
            <nav className={styles.nav}>
              <Link href="/about" className={styles.navLink}>About</Link>
              <Link href="/membership" className={styles.navLink}>Membership</Link>
              <Link href="/contact" className={styles.navLink}>Contact</Link>
            </nav>
          </header>

          {/* Main content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>&copy; 2024 QCABA. All rights reserved.</p>
            <nav className={styles.footerNav}>
              <Link href="/privacy" className={styles.navLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.navLink}>Terms of Service</Link>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}
