import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './PageTransition.module.css';  // The CSS file should be in the same folder

const PageTransition: React.FC = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true);
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => setIsTransitioning(false), 800); // Delay to finish the animation
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <div className={`${styles.transitionOverlay} ${isTransitioning ? styles.active : ''}`}>
      <div className={styles.splash}></div>
    </div>
  );
};

export default PageTransition;
