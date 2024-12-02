export const scrollObserver = () => {
    const sections = document.querySelectorAll('.fade-in');
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add class to trigger animation
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );
  
    sections.forEach((section) => {
      observer.observe(section);
    });
  };
  