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

// INITIALIZE ALL
function init() {
  initHero();
  initTransition();
  initDraggableImages();
  initTwoWorldsAnimations();

  console.log(' Fashion Love Story initialized');
}

init();