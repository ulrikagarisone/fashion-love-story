import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

// hero animation
function playHeroAnimations() {
    const tl = gsap.timeline();

    // 1. KISSY FACE POPS 
    tl.to('.hero__kissy', {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
    })

        // 2. ATHLETE SLIDES IN 
        .to('.hero__football', {
            x: 0, 
            rotation: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.6"); 
}

// INTRO SEQUENCER
function initIntro() {
    const tl = gsap.timeline();
    const curtain = document.querySelector('.intro-curtain');
    const introText = document.querySelector('.intro-curtain__text');
    const introKiss = document.querySelector('.intro-curtain__img');

    if (!curtain) return;

    // 1. Intro Animation (The Curtain Content)
    tl.to(introText, { opacity: 1, scale: 1, duration: 1 })
        .to(introKiss, { opacity: 1, scale: 1, rotation: -15, ease: "elastic.out" }, "-=0.2")
        .to({}, { duration: 0.5 }) // Pause to look at it

        // 2. Lift Curtain
        .to(curtain, {
            y: '-100%',
            duration: 1.1,
            ease: "power3.inOut",
            onStart: () => {
                gsap.delayedCall(0.3, playHeroAnimations);
            },

            onComplete: () => {
                curtain.style.display = 'none';
            }
        });
}

const init = () => {
    gsap.set('.hero', { opacity: 1, visibility: 'visible' });
    gsap.set('.hero__football', { x: '120%', opacity: 0 });
    gsap.set('.hero__kissy', { scale: 0, opacity: 0 });

    initIntro();
}

init();