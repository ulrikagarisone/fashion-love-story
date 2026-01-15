import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function init() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  // Get elements
  const heroModel = document.querySelector('.hero__model');
  const heroFootball = document.querySelector('.hero__football');
  const transitionModel = document.querySelector('.transition__model-image');
  const transitionSection = document.querySelector('.transition');

  // Hero model fade in on load
  gsap.to(heroModel, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.3
  });

  // Check if desktop
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (isDesktop && heroFootball) {
    // Football player animation (desktop only)
    // Animate in from left, swoosh around, land on bottom right
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero__main-image',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    })
      .to(heroFootball, {
        opacity: 1,
        x: '110vw', // Shoot across screen from left to right
        y: -100,
        rotation: 360,
        duration: 0.4,
        ease: 'power2.in'
      })
      .to(heroFootball, {
        x: '60vw', // Loop back
        y: 50,
        rotation: 540,
        duration: 0.3,
        ease: 'power1.inOut'
      })
      .to(heroFootball, {
        x: 0, // Land on final position (relative to image)
        y: 0,
        rotation: 720,
        duration: 0.3,
        ease: 'power2.out'
      });
  }

  // Transition model walking down
  if (transitionModel && transitionSection) {
    gsap.timeline({
      scrollTrigger: {
        trigger: transitionSection,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    })
      .to(transitionModel, {
        opacity: 1,
        y: 0,
        duration: 0.3
      })
      .to(transitionModel, {
        y: 300,
        duration: 0.7
      });
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
}

// Wait for DOM and GSAP to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 100);
  });
} else {
  setTimeout(init, 100);
}