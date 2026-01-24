import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

// 1. HERO ENTRANCE
function playHeroAnimations() {
    const tl = gsap.timeline();
    tl.to('.hero__kissy', {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
    })
        .to('.hero__football', {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.4");
}

// 2. SCROLLING MODEL 
function initGlobalScroll() {
    const model = document.querySelector('.global-scroll-model');
    const hero = document.querySelector('.hero');
    const transitionSection = document.querySelector('.transition');

    if (!model || !hero || !transitionSection) return;

    gsap.set(model, { opacity: 0, scale: 0.5, y: 0 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: hero,
            start: "top top",      // Starts exactly when hero hits the top
            endTrigger: transitionSection,
            end: "bottom top",
            scrub: 1.5,          
        }
    });

    tl.to(model, {
        opacity: 1,                
        scale: 0.85,
        duration: 0.2             
    })
        .to(model, {
            y: "70vh",                 
            rotate: -5,
            scale: 0.6,                
            ease: "none"               
        })
        .to(model, {
            opacity: 0,
            filter: "blur(10px)",      
            duration: 0.2
        });
}

// 3. THE INTRO
function initIntro() {
    const tl = gsap.timeline({ delay: 0.1 });
    const text = document.querySelector('.intro-curtain__text');
    const kiss = document.querySelector('.intro-curtain__img');
    const curtain = document.querySelector('.intro-curtain');

    if (!curtain || !text || !kiss) return;

    tl.fromTo(text, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1 })
        .fromTo(kiss, { opacity: 0, scale: 3, rotation: 10 }, { opacity: 1, scale: 1, rotation: -15, duration: 0.8, ease: "elastic.out" }, "-=0.5")
        .to({}, { duration: 0.8 })
        .to(curtain, {
            y: '-100%',
            duration: 1.2,
            ease: "power4.inOut",
            onStart: () => {
                gsap.delayedCall(0.5, playHeroAnimations);
            },
            onComplete: () => {
                curtain.style.display = 'none';
                // START SCROLL LOGIC ONCE INTRO IS DONE
                initGlobalScroll();
            }
        });
}

const init = () => {
    gsap.set('.hero__football', { x: '100vw', opacity: 0 });
    gsap.set('.hero__kissy', { scale: 0, opacity: 0 });
    gsap.set('.intro-curtain', { display: 'block', visibility: 'visible' });

    initIntro();
};

init();