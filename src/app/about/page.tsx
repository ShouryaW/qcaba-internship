"use client";

import styles from './About.module.css';
import Image from 'next/image';

const About: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Main Heading */}
      <h1 className={styles.heading}>About Us</h1>

      {/* Subheading */}
      <h2 className={styles.centeredSubheading}>Dedicated to Empowering Change</h2>

      {/* Text Section */}
      <div className={styles.textSection}>
        <p>
          At the Québec Association of Behavior Analysis (QcABA), we are dedicated to promoting the principles and practices of behavior analysis 
          to enhance the quality of life for individuals and communities. Our association serves as a resource for professionals, students, and 
          the general public who are interested in understanding behavior and its impact on society.
        </p>
      </div>

      {/* Image */}
      <Image
        src="/about-us-image.jpg"
        alt="About Us"
        width={800}
        height={400}
        className={styles.image}
      />

      {/* Story Section */}
      <h2 className={styles.subheading}>Our Story</h2>
      <div className={styles.storySection}>
        <p>
          Founded in 2010, QcABA has been committed to fostering a better understanding of behavior analysis 
          across Québec. Our annual conferences and community outreach programs have empowered thousands of 
          individuals to make positive changes in their personal and professional lives.
        </p>
        <p>
          As an organization, we continue to grow and evolve to meet the needs of our members and the communities we serve. 
          Our goal is to make behavior analysis accessible, understandable, and impactful for everyone.
        </p>
      </div>
    </div>
  );
};

export default About;
