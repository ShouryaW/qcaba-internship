'use client';

import styles from './Events.module.css';

export default function Events() {
  const events = [
    {
      title: '13th Annual QCABA Conference',
      date: 'Friday, September 20th',
      location: 'Online Event',
      buttonText: 'RSVP Now',
      link: 'https://www.behaviorlive.com/',
      image: '/conference-image.jpg', // Updated with specific image
    },
    {
      title: 'Behavior Analysis Workshop',
      date: 'Tuesday, October 5th',
      location: 'Montréal, Canada',
      buttonText: 'Register',
      link: '#',
      image: '/mission-image.jpg', // Updated with specific image
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Upcoming Events</h1>
      <p className={styles.introText}>
        Discover the latest events and conferences designed to connect and inspire the community.
      </p>

      <div className={styles.eventGrid}>
        {events.map((event, index) => (
          <div className={styles.eventCard} key={index}>
            <div className={styles.eventImage}>
              <img
                src={event.image}
                alt={`${event.title}`}
              />
            </div>
            <div className={styles.eventContent}>
              <h2>{event.title}</h2>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <a href={event.link} target="_blank" rel="noopener noreferrer">
                <button className={styles.rsvpButton}>{event.buttonText}</button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
