"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { scrollObserver } from './scrollObserver';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const sectionsRef = useRef<NodeListOf<HTMLElement> | null>(null);

  useEffect(() => {
    sectionsRef.current = document.querySelectorAll('.fade-in');
    scrollObserver(sectionsRef);

    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const video = document.querySelector(`.${styles.heroVideo}`) as HTMLVideoElement | null;
          if (video) {
            const zoomLevel = 1 + window.scrollY * 0.0001;
            video.style.transform = `scale(${zoomLevel})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <section className={`${styles.hero} fade-in`}>
        <video autoPlay muted loop className={styles.heroVideo}>
          <source src="/path-to-your-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroMainText}>Empowering Change</h1>
          <h2 className={styles.heroSubText}>Creating a Better Tomorrow Through Behavior Analysis</h2>
          <Link href="/membership">
            <button className={styles.heroButton}>Join Us</button>
          </Link>
        </div>
      </section>

      <section id="mission" className={`${styles.section} fade-in`}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionText}>
            <h2 className={styles.sectionHeading}>Our Mission</h2>
            <p>
              At the Québec Association of Behavior Analysis (QcABA), we are dedicated to promoting the principles and
              practices of behavior analysis to enhance the quality of life for individuals and communities. But what
              exactly is behavior analysis?
            </p>
            <Link href="/aba">
              <button className={styles.learnMoreButton}>Learn More</button>
            </Link>
          </div>
          <div className={styles.sectionImageWrapper}>
            <Image
              className={styles.sectionImage}
              src="/mission-image.jpg"
              alt="Mission Image"
              width={500}
              height={350}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="events" className={`${styles.section} fade-in`}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionText}>
            <h2 className={styles.eventHeading}>Coming Up Next</h2>
            <p className={styles.eventTitle}>
              <strong>13th Annual QCABA Conference</strong> <br />
              <span className={styles.eventType}>Online Event</span>
            </p>
            <p className={styles.eventDate}>📅 Friday, September 20th</p>
            <Link href="https://www.behaviorlive.com/" target="_blank" rel="noopener noreferrer">
              <button className={styles.detailsButton}>Details</button>
            </Link>
          </div>
          <div className={styles.sectionImageWrapper}>
            <Image
              className={styles.sectionImage}
              src="/conference-image.jpg"
              alt="Conference Image"
              width={500}
              height={350}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
