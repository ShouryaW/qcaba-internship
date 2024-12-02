"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Membership.module.css";

const Membership: React.FC = () => {
  const { data: session, status } = useSession(); // Access session data and status
  const router = useRouter();
  const [shake, setShake] = useState(false);

  // Debugging session status and data
  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [status, session]);

  // Trigger a shake animation for "Most Popular" card
  useEffect(() => {
    setShake(true);
    const timeout = setTimeout(() => setShake(false), 1500); // 1.5-second shake
    return () => clearTimeout(timeout);
  }, []);

  // Redirect based on session state when a membership is selected
  const handleSelect = (membership: string) => {
    if (status === "loading") return; // Wait until session status is resolved

    if (!session) {
      router.push(`/login?redirect=/membership`); // Redirect to login if unauthenticated
    } else {
      router.push(`/checkout?membership=${membership}`); // Proceed to checkout
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Our Memberships</h1>
      <p className={styles.introText}>
        At QcABA, we offer various types of memberships tailored to meet the
        diverse needs and interests of our members. Whether you're a seasoned
        behavior analyst, a student aspiring to enter the field, or you're
        committed to promoting behavior analysis, we have a membership option
        for you.
      </p>

      <h2 className={styles.chooseMembershipHeading}>Choose Your Membership</h2>

      <div className={styles.membershipContainer}>
        {/* Student Membership Card */}
        <MembershipCard
          title="Membre étudiant / Student Member"
          price="$20"
          description="Ideal for aspiring behavior analysts."
          validity="12 months"
          benefits={[
            "Discounted membership fees",
            "Educational resources",
            "Mentorship opportunities",
            "Scholarships and awards eligibility",
            "Professional network access",
          ]}
          onSelect={() => handleSelect("student")}
        />

        {/* Regular Membership Card */}
        <MembershipCard
          title="Membre régulier / Regular Member"
          price="$30"
          description="Perfect for dedicated behavior analysts."
          validity="12 months"
          benefits={[
            "Voting rights and leadership eligibility",
            "Extensive professional network",
            "Continuing education opportunities",
            "Conference discounts",
            "Exclusive newsletters and publications",
          ]}
          isMostPopular
          shake={shake}
          onSelect={() => handleSelect("regular")}
        />

        {/* Sustaining Membership Card */}
        <MembershipCard
          title="Membre donateur / Sustaining Member"
          price="$60"
          description="Perfect for champions of behavior analysis."
          validity="12 months"
          benefits={[
            "Recognition as a key supporter",
            "Exclusive event invitations",
            "Enhanced networking opportunities",
            "Advocacy support",
            "Professional network access",
          ]}
          onSelect={() => handleSelect("sustaining")}
        />

        {/* Affiliate Membership Card */}
        <MembershipCard
          title="Membre affilié / Affiliate Member"
          price="$20"
          description="Perfect for those with a professional interest in behavior analysis."
          validity="12 months"
          benefits={[
            "Participation in association activities",
            "Professional network access",
            "Newsletter and publications",
            "Conference and course discounts",
            "Job postings and career resources",
          ]}
          onSelect={() => handleSelect("affiliate")}
        />
      </div>
    </div>
  );
};

type MembershipCardProps = {
  title: string;
  price: string;
  description: string;
  validity: string;
  benefits: string[];
  isMostPopular?: boolean;
  shake?: boolean;
  onSelect: () => void;
};

const MembershipCard: React.FC<MembershipCardProps> = ({
  title,
  price,
  description,
  validity,
  benefits,
  isMostPopular = false,
  shake = false,
  onSelect,
}) => {
  return (
    <div
      className={`${styles.membershipCard} ${
        isMostPopular ? styles.mostPopular : ""
      } ${shake ? styles.shake : ""}`}
    >
      {isMostPopular && (
        <div className={styles.mostPopularBanner}>Most Popular</div>
      )}
      <h2 className={styles.membershipTitle}>{title}</h2>
      <p className={styles.price}>{price}</p>
      <p className={styles.description}>{description}</p>
      <p className={styles.validity}>Validity: {validity}</p>
      <ul className={styles.benefitsList}>
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
      <button className={styles.selectButton} onClick={onSelect}>
        Select
      </button>
    </div>
  );
};

export default Membership;
