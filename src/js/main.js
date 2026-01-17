import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

// HERO ANIMATIONS
function initHero() {
  const heroModel = document.querySelector('.hero__model');
  const heroFootball = document.querySelector('.hero__football');

  // Hero model fade in on load
  if (heroModel) {
    gsap.to(heroModel, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  // Check if desktop
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (isDesktop && heroFootball) {
    // Football player auto-animation (desktop only)
    gsap.timeline({ delay: 1 })
      .to(heroFootball, {
        opacity: 1,
        x: '150vw',
        y: -150,
        rotation: 360,
        duration: 0.8,
        ease: 'power2.in'
      })
      .to(heroFootball, {
        x: '80vw',
        y: 0,
        rotation: 540,
        duration: 0.6,
        ease: 'power1.inOut'
      })
      .to(heroFootball, {
        x: '-20vw',
        y: 0,
        rotation: 720,
        duration: 0.8,
        ease: 'power2.out'
      });
  }
}

// TRANSITION - MODEL WALKS VERTICALLY
function initTransition() {
  const model = document.querySelector('.transition__model');
  const section = document.querySelector('.transition');

  if (!model || !section) return;

  // Model walks down vertically through the section
  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
    },
  })
    .fromTo(model,
      { y: '-30vh', opacity: 0 },
      { y: '30vh', opacity: 1, ease: 'none' }
    );

  // SVG text fade in
  const svgTexts = document.querySelectorAll('.transition__text');
  gsap.from(svgTexts, {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
    },
  });
}

// TWO WORLDS - DRAGGABLE IMAGES
function initDraggableImages() {
  const draggables = document.querySelectorAll('.two-worlds__draggable');

  draggables.forEach((element) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    const side = element.getAttribute('data-draggable');
    const maxDrag = 150; // Maximum pixels they can drag

    // Mouse/Touch start
    const handleStart = (e) => {
      isDragging = true;
      element.style.cursor = 'grabbing';

      const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

      startX = clientX - currentX;
      startY = clientY - currentY;
    };

    // Mouse/Touch move
    const handleMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

      let deltaX = clientX - startX;
      let deltaY = clientY - startY;

      // Limit drag distance
      if (side === 'left') {
        deltaX = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
      } else {
        deltaX = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
      }
      deltaY = Math.max(-maxDrag, Math.min(maxDrag, deltaY));

      currentX = deltaX;
      currentY = deltaY;

      element.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };

    // Mouse/Touch end - snap back
    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      element.style.cursor = 'grab';

      // Check if images are close together
      const leftImage = document.querySelector('[data-draggable="left"]');
      const rightImage = document.querySelector('[data-draggable="right"]');

      if (leftImage && rightImage) {
        const leftRect = leftImage.getBoundingClientRect();
        const rightRect = rightImage.getBoundingClientRect();
        const distance = Math.abs(leftRect.right - rightRect.left);

        // If close together, snap them together briefly
        if (distance < 50) {
          gsap.to([leftImage, rightImage], {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
          });
        }
      }

      // Snap back to original position with elastic bounce
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        onUpdate: () => {
          currentX = 0;
          currentY = 0;
        }
      });
    };

    // Add event listeners
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('touchstart', handleStart, { passive: false });

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });

    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
  });
}

// TWO WORLDS - SCROLL ANIMATIONS
function initTwoWorldsAnimations() {
  // Headline fade in
  const headline = document.querySelector('.two-worlds__headline');
  if (headline) {
    gsap.from(headline, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: headline,
        start: 'top 80%',
      },
    });
  }

  // Paragraphs stagger in
  const paragraphs = document.querySelectorAll('.two-worlds__paragraph');
  gsap.from(paragraphs, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.two-worlds__text',
      start: 'top 75%',
    },
  });

  // Grid items reveal
  const items = document.querySelectorAll('.two-worlds__item');
  gsap.from(items, {
    opacity: 0,
    y: 60,
    duration: 1,
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.two-worlds__grid',
      start: 'top 75%',
    },
  });

  // Closing statement
  const statement = document.querySelector('.two-worlds__statement');
  if (statement) {
    gsap.from(statement, {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.two-worlds__closing',
        start: 'top 80%',
      },
    });
  }
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

/* VORTEX TEXT ANIMATION*/
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



// INITIALIZE ALL
function init() {
  initHero();
  initTransition();
  initDraggableImages();
  initTwoWorldsAnimations(); 
  initLeatherYearsScrollLock();
  initLeatherYearsAnimations();
  initVortex();

  console.log(' Fashion love story');
}

init();