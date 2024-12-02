"use client";

import Head from "next/head";
import { useEffect } from "react";
import styles from "./ABA.module.css";

const ABA: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          } else {
            entry.target.classList.remove(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(`.${styles.fade}`);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>What is Behavior Analysis? | QCABA</title>
        <meta
          name="description"
          content="Learn about Behavior Analysis and its applications in clinical, educational, and organizational settings."
        />
      </Head>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={`${styles.heroSection} ${styles.fade}`}>
          <h1 className={styles.mainTitle}>What is Behavior Analysis?</h1>
          <p className={styles.introText}>
            Behavior analysis is a scientific approach to understanding behavior and how it is influenced by the environment. It is based on learning theory principles, focusing on observable behaviors and their relationship with the environment.
          </p>
        </section>

        {/* Behavior Analysis Information */}
        <section className={styles.infoSection}>
          <div className={`${styles.infoBlock} ${styles.fade}`}>
            <h2>Behavior is Observable and Measurable</h2>
            <p>
              Behavior analysis focuses on behaviors that can be objectively measured and tracked over time, enabling analysts to assess the effectiveness of interventions.
            </p>
          </div>

          <div className={`${styles.infoBlock} ${styles.fade}`}>
            <h2>Behavior is Influenced by the Environment</h2>
            <p>
              Behavior is shaped by environmental variables through reinforcement and punishment. Analysts modify these variables to promote positive outcomes.
            </p>
          </div>

          <div className={`${styles.infoBlock} ${styles.fade}`}>
            <h2>Behavior Can Be Analyzed Scientifically</h2>
            <p>
              Using the scientific method, behavior analysts employ systematic observation and experimentation to develop evidence-based interventions.
            </p>
          </div>

          <div className={`${styles.infoBlock} ${styles.fade}`}>
            <h2>Focus on Function</h2>
            <p>
              Understanding the function or purpose of behavior is key to designing interventions that address the root cause rather than just the symptoms.
            </p>
          </div>
        </section>

        {/* Applications Section */}
        <section className={styles.applicationSection}>
          <h2 className={`${styles.fade}`}>Applications of Behavior Analysis</h2>

          <div className={`${styles.applicationBlock} ${styles.fade}`}>
            <h3>Clinical Behavior Analysis</h3>
            <p>
              Helping individuals with autism and developmental disabilities by improving communication, social, and adaptive skills.
            </p>
          </div>

          <div className={`${styles.applicationBlock} ${styles.fade}`}>
            <h3>Educational Initiatives</h3>
            <p>
              Behavior analysis improves classroom management and helps address behavioral challenges in educational settings.
            </p>
          </div>

          <div className={`${styles.applicationBlock} ${styles.fade}`}>
            <h3>Organizational Behavior Management</h3>
            <p>
              Boosting performance, enhancing workplace safety, and improving organizational effectiveness.
            </p>
          </div>

          <div className={`${styles.applicationBlock} ${styles.fade}`}>
            <h3>Sports Performance</h3>
            <p>
              Enhancing athletic performance and developing motivation strategies for training and exercise.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default ABA;
