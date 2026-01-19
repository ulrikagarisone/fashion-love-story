import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

// HERO ANIMATIONS
const initHero = () => {
  const football = document.querySelector('.hero__football');
  if (!football) return;

  const triggerPop = () => {
    football.classList.add('is-active');
  };

  setTimeout(triggerPop, 4200);
};

// HERO SECTION - SECOND MODEL SCROLL ANIMATION
function initHeroScrollModel() {
  const heroSection = document.querySelector('.hero');
  const secondModel = document.querySelector('.hero__scroll-model');

  if (!heroSection || !secondModel) return;

  gsap.set(secondModel, {
    y: 0,
    opacity: 1
  });

  // Smooth scroll down animation
  gsap.to(secondModel, {
    y: '120vh',
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
}

// TRANSITION - RUNWAY MODEL ANIMATION
function initTransitionRunway() {
  const transitionSection = document.querySelector('.transition');
  const runwayModel = document.querySelector('.transition__model');

  if (!transitionSection || !runwayModel) return;

  // Set initial state
  gsap.set(runwayModel, {
    y: '-50%',
    opacity: 1,
    scale: 1.2,
  });

  // Model walks down the runway (SVG) as you scroll
  gsap.to(runwayModel, {
    y: '0%',
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: transitionSection,
      start: 'top center',
      end: 'bottom center',
      scrub: 1.5,
    }
  });

  // Model disappears before blue section - exit animation
  gsap.to(runwayModel, {
    x: '-120vw',
    rotation: -15,
    opacity: 0,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: transitionSection,
      start: 'bottom 80%',
      end: 'bottom 20%',
      scrub: 1.5,
    }
  });
}

// TWO WORLDS - "SEPARATE WORLDS" POP-IN (NO FLOATING)
function initSeparateWorldsPopIn() {
  const closingStatement = document.querySelector('.two-worlds__closing');

  if (!closingStatement) {
    console.error("ERROR: .two-worlds__closing not found! Check your HTML.");
    return;
  }
  console.log("Element found, initializing animation");
  gsap.fromTo(closingStatement,
    {
      opacity: 0,
      scale: 0.5,
      y: 50
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: closingStatement,
        start: "top bottom",
        toggleActions: "play none none reverse",
        //markers: true, 
        id: "closing-text"
      }
    }
  );
}

// DRAG INTERACTION - HOVER HINT WITH MOUSE FOLLOW

// HERO SECTION - SECOND MODEL SCROLL ANIMATION
function initHeroScrollModel() {
  const heroSection = document.querySelector('.hero');
  const secondModel = document.querySelector('.hero__scroll-model');

  if (!heroSection || !secondModel) return;

  // Set initial position - model starts at top of hero, visible
  gsap.set(secondModel, {
    y: 0,
    opacity: 1
  });

  // Smooth scroll down animation
  gsap.to(secondModel, {
    y: '120vh',
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5, // Increased for smoother animation
      // markers: true, // Uncomment for debugging
    }
  });
}

// TRANSITION - RUNWAY MODEL ANIMATION
function initTransitionRunway() {
  const transitionSection = document.querySelector('.transition');
  const runwayModel = document.querySelector('.transition__model');

  if (!transitionSection || !runwayModel) return;

  // Set initial state
  gsap.set(runwayModel, {
    y: '-50%',
    opacity: 0.5
  });

  // Model walks down the runway (SVG) as you scroll
  gsap.to(runwayModel, {
    y: '50%',
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: transitionSection,
      start: 'top center',
      end: 'bottom center',
      scrub: 1.5,
      // markers: true, // Uncomment for debugging
    }
  });

  // Model disappears before blue section - exit animation
  gsap.to(runwayModel, {
    x: '-120vw',
    rotation: -15,
    opacity: 0,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: transitionSection,
      start: 'bottom 80%',
      end: 'bottom 20%',
      scrub: 1.5,
      // markers: true, // Uncomment for debugging
    }
  });
}

// TWO WORLDS - "SEPARATE WORLDS" POP-IN (NO FLOATING)
function initSeparateWorldsPopIn() {
  const closingStatement = document.querySelector('.two-worlds__closing');

  if (!closingStatement) return;

  // Initial state - hidden and scaled down
  gsap.set(closingStatement, {
    opacity: 0,
    scale: 0.5,
    y: 50
  });

  // Pop in animation ONCE when scrolling to it
  gsap.to(closingStatement, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: closingStatement,
      start: 'top 80%',
      toggleActions: 'play none none none' // Only play once, no reverse
    }
  });
}

// Leather years scroll lock
function initLeatherYearsScrollLock() {
  const section = document.querySelector('.leather-years');
  const dirkSection = document.querySelector('.leather-years__dirk');

  if (!section || !dirkSection) return;

  // Only apply on desktop
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop) return;

  function updateDirkPosition() {
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionBottom = sectionRect.bottom;
    const windowHeight = window.innerHeight;

    // When section enters viewport, fix the dirk section
    if (sectionTop <= 0 && sectionBottom > windowHeight) {
      dirkSection.classList.add('is-fixed');
      dirkSection.classList.remove('is-bottom');
    }
    // When section is above viewport (before scrolling to it)
    else if (sectionTop > 0) {
      dirkSection.classList.remove('is-fixed');
      dirkSection.classList.remove('is-bottom');
    }
    // When section is leaving viewport (scrolled past)
    else if (sectionBottom <= windowHeight) {
      dirkSection.classList.remove('is-fixed');
      dirkSection.classList.add('is-bottom');
    }
  }

  window.addEventListener('scroll', updateDirkPosition);
  window.addEventListener('resize', updateDirkPosition);
  updateDirkPosition(); // Initial call
}

// Leather yeasr
function initLeatherYearsAnimations() {
  const items = document.querySelectorAll('.leather-years__item');

  if (!items.length) return;

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (isDesktop) {
    // Desktop: Vertical scroll fade-in animations
    items.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
          markers: false
        }
      });
    });
  } else {
    // Mobile: Horizontal scroll fade-in
    items.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        x: 60,
        duration: 0.6,
        scrollTrigger: {
          trigger: item,
          start: 'left 85%',
          containerAnimation: null,
          toggleActions: 'play none none none',
          markers: false
        }
      });
    });
  }

  // Dirk section animation
  const dirkContent = document.querySelector('.leather-years__dirk-content');
  if (dirkContent) {
    gsap.from(dirkContent, {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.leather-years',
        start: 'top 60%',
        markers: false
      }
    });
  }

  // Boot image animation
  const bootImage = document.querySelector('.leather-years__boot');
  if (bootImage && isDesktop) {
    gsap.from(bootImage, {
      opacity: 0,
      scale: 0.8,
      rotation: -15,
      duration: 1.2,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.leather-years',
        start: 'top 60%',
        markers: false
      }
    });
  }
}

function initVortex() {
  const vortexContainer = document.querySelector('.vortex-container');

  if (!vortexContainer) return;

  const phrases = [
    "Leather + Lycra?",
    "What if...?",
    "Is it even possible?",
    "Impossible...",
    "Two different worlds?",
    "Could they work together?",
    "Everyone would say it's impossible...",
    "Crazy.",
    "Visionary?",
    "Risk.",
    "What if...?",
    "Two worlds colliding..."
  ];

  function createWord() {
    const word = document.createElement('div');
    word.classList.add('vortex-word');

    // Pick random phrase
    word.innerText = phrases[Math.floor(Math.random() * phrases.length)];

    // Add random styling variant
    const variant = Math.floor(Math.random() * 3) + 1;
    word.classList.add(`word-variant-${variant}`);

    // Randomize position slightly
    const randomX = (Math.random() - 0.5) * 50;
    const randomY = (Math.random() - 0.5) * 50;

    // Apply animation with dynamic duration
    const duration = Math.random() * 2 + 3; // 3-5 seconds
    word.style.animation = `flyOut ${duration}s linear forwards`;

    // Add offset
    word.style.marginLeft = `${randomX}vw`;
    word.style.marginTop = `${randomY}vh`;

    // Append
    vortexContainer.appendChild(word);

    // Remove after animation
    setTimeout(() => {
      word.remove();
    }, duration * 1000);
  }

  // Spawn word every 400ms
  setInterval(createWord, 400);

  // Start immediately with a few words
  createWord();
  setTimeout(createWord, 100);
  setTimeout(createWord, 200);
}


const overlay = document.getElementById('spotlightOverlay');
const stage = document.querySelector('.san-siro');
const yearDisplay = document.getElementById('yearDisplay');

// 1. MOUSE SPOTLIGHT (Only works while overlay is visible)
stage.addEventListener('mousemove', (e) => {
  if (!overlay.classList.contains('san-siro__dark-overlay--hidden')) {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    overlay.style.setProperty('--x', `${x}px`);
    overlay.style.setProperty('--y', `${y}px`);
  }
});

// 2. SCROLL OBSERVER (Trigger animations)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      // A. Handle "Lights On" Logic
      if (entry.target.classList.contains('san-siro__trigger--intro')) {
        // We are at the start: Keep it dark
        overlay.classList.remove('san-siro__dark-overlay--hidden');
        yearDisplay.classList.remove('san-siro__year-display--visible');
      } else {
        // We scrolled past start: Turn lights ON
        overlay.classList.add('san-siro__dark-overlay--hidden');
        yearDisplay.classList.add('san-siro__year-display--visible');

        // Update Year Text
        const year = entry.target.getAttribute('data-year');
        if (year) yearDisplay.innerText = year;

        // Switch Model Image
        const index = entry.target.getAttribute('data-target');
        if (index) updateModel(index);
      }

      // B. Animate Text Card
      entry.target.classList.add('san-siro__trigger--active');

    } else {
      entry.target.classList.remove('san-siro__trigger--active');
    }
  });
}, { threshold: 0.5 }); // Trigger when 50% of the section is visible

// Observe all triggers
document.querySelectorAll('.san-siro__trigger').forEach(el => observer.observe(el));

// Helper function to switch images
function updateModel(index) {
  document.querySelectorAll('.san-siro__model').forEach(img => {
    img.classList.remove('san-siro__model--active');
  });
  const active = document.querySelector(`.san-siro__model[data-step="${index}"]`);
  if (active) active.classList.add('san-siro__model--active');
}


const ticket = document.getElementById('ticket3D');

if (ticket) {
  ticket.addEventListener('mousemove', (e) => {
    const rect = ticket.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-10deg to 10deg)
    const xRot = ((y / rect.height) - 0.5) * -10;
    const yRot = ((x / rect.width) - 0.5) * 10;

    ticket.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg)`;
  });

  ticket.addEventListener('mouseleave', () => {
    ticket.style.transform = `rotateX(0deg) rotateY(0deg)`; // Reset
  });
}




// INITIALIZE ALL
function init() {
  initHero();  
  initHeroScrollModel();    
  initTransitionRunway();
  initSeparateWorldsPopIn();
  initDragResistance();
  initLeatherYearsScrollLock();
  initLeatherYearsAnimations();
  initVortex();
  createDragHandler();
    console.log(' Fashion love story');
}

init();