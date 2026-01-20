import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

// 1. HERO ANIMATIONS
const initHero = () => {
  const football = document.querySelector('.hero__football');
  if (!football) return;
  setTimeout(() => football.classList.add('is-active'), 4200);
};

// 2. HERO SCROLL MODEL
function initHeroScrollModel() {
  const heroSection = document.querySelector('.hero');
  const secondModel = document.querySelector('.hero__scroll-model');
  if (!heroSection || !secondModel) return;

  gsap.set(secondModel, { y: 0, opacity: 1 });
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

// 3. TRANSITION RUNWAY
function initTransitionRunway() {
  const transitionSection = document.querySelector('.transition');
  const runwayModel = document.querySelector('.transition__model');
  if (!transitionSection || !runwayModel) return;

  gsap.set(runwayModel, { y: '-50%', opacity: 1, scale: 1.2 });

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

// 4. SEPARATE WORLDS POP-IN
function initSeparateWorldsPopIn() {
  const closingStatement = document.querySelector('.two-worlds__closing');
  if (!closingStatement) return;

  gsap.fromTo(closingStatement,
    { opacity: 0, scale: 0.5, y: 50 },
    {
      opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: closingStatement,
        start: "top 90%",
        toggleActions: "play none none reverse",
      }
    }
  );
}

// 5. DRAG INTERACTION (Restored)
function initDragResistance() {
  const items = {
    left: document.querySelector('[data-draggable="left"]'),
    right: document.querySelector('[data-draggable="right"]')
  };
  const grid = document.querySelector('.two-worlds__grid');

  if (!items.left || !items.right || !grid) return;

  // Helpers
  items.left.style.cursor = 'grab';
  items.right.style.cursor = 'grab';

  // Initialize Logic
  createDragHandler(items.left, items.right, 150, 1);
  createDragHandler(items.right, items.left, 150, -1);
}

// Helper for Drag (Restored)
function createDragHandler(main, other, maxDrag, dir) {
  let dragging = false;
  let startX = 0;
  const xSet = gsap.quickSetter(main, "x", "px");

  const getClientX = (e) => e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;

  const getResistance = () => {
    const r1 = main.getBoundingClientRect();
    const r2 = other.getBoundingClientRect();
    const gap = r2.left - r1.right;
    return gap < 50 ? (50 - gap) / 50 : 0;
  };

  const start = (e) => {
    dragging = true;
    main.style.cursor = 'grabbing';
    startX = getClientX(e) - gsap.getProperty(main, "x");
  };

  const move = (e) => {
    if (!dragging) return;
    if (e.type === 'touchmove') e.preventDefault();

    let delta = getClientX(e) - startX;
    delta = dir === 1 ? Math.max(0, Math.min(maxDrag, delta)) : Math.min(0, Math.max(-maxDrag, delta));

    const resist = getResistance();
    if (resist > 0.1) {
      const shake = Math.sin(Date.now() / 50) * 2 * resist;
      gsap.to(main, { x: delta * (1 - resist * 0.5), rotation: shake * dir, duration: 0.1, overwrite: true });
      gsap.to(other, { rotation: -shake * dir, duration: 0.1, overwrite: true });
    } else {
      xSet(delta);
      gsap.to([main, other], { rotation: 0, duration: 0.2, overwrite: true });
    }
  };

  const end = () => {
    if (!dragging) return;
    dragging = false;
    main.style.cursor = 'grab';
    gsap.to([main, other], { x: 0, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };

  main.addEventListener('mousedown', start);
  main.addEventListener('touchstart', start, { passive: false });
  document.addEventListener('mousemove', move);
  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('mouseup', end);
  document.addEventListener('touchend', end);
}

// 6. LEATHER YEARS LOGIC
// 6. LEATHER YEARS LOGIC

// Desktop scroll lock (unchanged)
function initLeatherYearsScrollLock() {
  const section = document.querySelector('.leather-years');
  const dirkSection = document.querySelector('.leather-years__dirk');

  if (!section || !dirkSection || window.innerWidth < 1024) {
    return;
  }

  const update = () => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 0 && rect.bottom > window.innerHeight) {
      dirkSection.classList.add('is-fixed');
      dirkSection.classList.remove('is-bottom');
    } else if (rect.top > 0) {
      dirkSection.classList.remove('is-fixed', 'is-bottom');
    } else if (rect.bottom <= window.innerHeight) {
      dirkSection.classList.remove('is-fixed');
      dirkSection.classList.add('is-bottom');
    }
  };

  window.addEventListener('scroll', update);
  update();
}

// Mobile horizontal scroll converter
function initLeatherYearsMobileScroll() {
  const scrollContainer = document.querySelector('.leather-years__scroll-container');
  const section = document.querySelector('.leather-years');

  if (!scrollContainer || !section) {
    return;
  }

  // Only run on mobile
  if (window.innerWidth >= 1024) {
    return;
  }

  let isScrolling = false;

  const handleScroll = () => {
    const rect = section.getBoundingClientRect();

    // Check if section is in viewport
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      isScrolling = true;
    } else {
      isScrolling = false;
    }
  };

  const handleWheel = (e) => {
    if (!isScrolling) {
      return;
    }

    const rect = section.getBoundingClientRect();

    // Only hijack scroll when section is visible
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      e.preventDefault();

      // Convert vertical scroll to horizontal
      scrollContainer.scrollLeft += e.deltaY;
    }
  };

  const handleTouchStart = (e) => {
    if (!isScrolling) {
      return;
    }

    scrollContainer.dataset.touchStartY = e.touches[0].clientY;
    scrollContainer.dataset.touchStartX = scrollContainer.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isScrolling || !scrollContainer.dataset.touchStartY) {
      return;
    }

    const touchStartY = parseFloat(scrollContainer.dataset.touchStartY);
    const touchStartX = parseFloat(scrollContainer.dataset.touchStartX);
    const touchCurrentY = e.touches[0].clientY;

    const deltaY = touchStartY - touchCurrentY;

    // Prevent default to stop vertical scroll
    e.preventDefault();

    // Convert vertical touch to horizontal scroll
    scrollContainer.scrollLeft = touchStartX + (deltaY * 2);
  };

  const handleTouchEnd = () => {
    delete scrollContainer.dataset.touchStartY;
    delete scrollContainer.dataset.touchStartX;
  };

  window.addEventListener('scroll', handleScroll);
  scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
  scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
  scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
  scrollContainer.addEventListener('touchend', handleTouchEnd);

  handleScroll();
}

// Desktop animations (unchanged)
function initLeatherYearsAnimations() {
  const items = document.querySelectorAll('.leather-years__item');

  if (!items.length) {
    return;
  }

  items.forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 80,
      duration: 0.8,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%'
      }
    });
  });
}

const initEyeTracker = () => {
  const lycraSection = document.querySelector('.watching-lycra');
  const pupils = document.querySelectorAll('.watching-lycra__pupil');

  if (!lycraSection || pupils.length === 0) return;

  const handleMove = (e) => {
    // Get coordinates from either mouse or the first touch point
    const xCoord = e.touches ? e.touches[0].clientX : e.clientX;
    const yCoord = e.touches ? e.touches[0].clientY : e.clientY;

    pupils.forEach((pupil) => {
      const eye = pupil.parentElement;
      const rect = eye.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(yCoord - centerY, xCoord - centerX);
      const distance = Math.min(rect.width / 4, 15);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
  };

  // Add touchstart so they react immediately on tap
  lycraSection.addEventListener('mousemove', handleMove);
  lycraSection.addEventListener('touchmove', handleMove, { passive: true });
  lycraSection.addEventListener('touchstart', handleMove, { passive: true });
};

// 7. VORTEX ANIMATION
function initVortex() {
  const container = document.querySelector('.vortex-container');
  if (!container) return;
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
    setTimeout(() => {
      word.remove();
    }, duration * 1000);

  }

  setInterval(createWord, 400);
  createWord();
  setTimeout(createWord, 100);
  setTimeout(createWord, 200);

}


// 8. SAN SIRO / TICKET (WRAPPED IN FUNCTION TO PREVENT CRASH)
function initSanSiro() {
  const overlay = document.getElementById('spotlightOverlay');
  const stage = document.querySelector('.san-siro');
  const yearDisplay = document.getElementById('yearDisplay');
  const ticket = document.getElementById('ticket3D');

  if (stage && overlay) {
    stage.addEventListener('mousemove', (e) => {
      if (!overlay.classList.contains('san-siro__dark-overlay--hidden')) {
        const rect = stage.getBoundingClientRect();
        overlay.style.setProperty('--x', `${e.clientX - rect.left}px`);
        overlay.style.setProperty('--y', `${e.clientY - rect.top}px`);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('san-siro__trigger--intro')) {
            overlay.classList.remove('san-siro__dark-overlay--hidden');
            if (yearDisplay) yearDisplay.classList.remove('san-siro__year-display--visible');
          } else {
            overlay.classList.add('san-siro__dark-overlay--hidden');
            if (yearDisplay) {
              yearDisplay.classList.add('san-siro__year-display--visible');
              yearDisplay.innerText = entry.target.getAttribute('data-year') || yearDisplay.innerText;
            }
          }
          entry.target.classList.add('san-siro__trigger--active');
        } else {
          entry.target.classList.remove('san-siro__trigger--active');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.san-siro__trigger').forEach(el => observer.observe(el));
  }

  if (ticket) {
    ticket.addEventListener('mousemove', (e) => {
      const rect = ticket.getBoundingClientRect();
      const xRot = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      const yRot = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      ticket.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
    ticket.addEventListener('mouseleave', () => ticket.style.transform = `rotateX(0deg) rotateY(0deg)`);
  }
}

const initFailedQuotes = () => {
  const wrapper = document.querySelector('.failed-image-wrapper');

  wrapper.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
      wrapper.classList.toggle('is-active');
    }
  });
};


// interaction 2 

//interaction 3


function init() {

  initHero();
  initHeroScrollModel();
  initTransitionRunway();
  initSeparateWorldsPopIn();
  initLeatherYearsMobileScroll();
  initDragResistance();
  initEyeTracker();
  initLeatherYearsScrollLock();
  initLeatherYearsAnimations();
  initVortex();
  initFailedQuotes();
  initSanSiro();

  console.log('Fashion Love Story Ready');
}
init();