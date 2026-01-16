import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

function init() {
  const heroModel = document.querySelector('.hero__model');
  const heroFootball = document.querySelector('.hero__football');
  const transitionModel = document.querySelector('.transition__model-image');
  const transitionSection = document.querySelector('.transition');

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
    // Starts automatically after page load, NOT on scroll
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


  init();
