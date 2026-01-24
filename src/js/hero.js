import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import delay from "./utils/delay.js";
import loadImageAsync from "./utils/loadImageAsync.js";

gsap.registerPlugin(ScrollTrigger);

// 1. CONFIGURATION
const CRITICAL_IMAGES = [
    "/fashion-love-story/images/kissy1-400.avif",
    "/fashion-love-story/images/model_hero-800.avif",
    "/fashion-love-story/images/leather_cutout-800.avif"
];

/* 2. THE GLOBAL SCROLL MODEL) */
const setupGlobalModelWalking = () => {
    const model = document.querySelector('.global-scroll-model');
    const hero = document.querySelector('.hero');
    const transition = document.querySelector('.transition'); // The section it walks into

    if (!model || !hero) return;

    // Set initial state: Hidden and small
    gsap.set(model, { opacity: 0, scale: 0.5 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            endTrigger: transition,
            end: "bottom top",
            scrub: 1.5
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
            duration: 0.6
        })
        .to(model, {
            opacity: 0,
            filter: "blur(10px)",
            duration: 0.2
        });
};

/**
 * 3. PROGRESS & CURTAIN
 */
const updateLoadingProgress = (loadedCount) => {
    const $percentage = document.querySelector(".preloader__percentage");
    const $visual = document.querySelector(".preloader__visual");
    const relativeProgress = loadedCount / CRITICAL_IMAGES.length;

    if ($percentage) $percentage.textContent = `${Math.round(relativeProgress * 100)}%`;
    if ($visual) $visual.style.transform = `scale3d(1, ${relativeProgress}, 1)`;
};

const playHeroAnimations = () => {
    const tl = gsap.timeline();
    tl.to('.hero__kissy', { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" })
        .to('.hero__football', { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.4");
};

const runCurtainSequence = async () => {
    await delay(350);
    const curtain = document.querySelector('.intro-curtain');
    if (!curtain) return;

    const tl = gsap.timeline();
    tl.to(curtain, {
        y: '-100%',
        duration: 1.2,
        delay: 0.8,
        ease: "power4.inOut",
        onStart: () => playHeroAnimations(),
        onComplete: () => {
            document.body.classList.remove("overflow-y-hidden");
            document.documentElement.classList.remove("is-loading");
            curtain.style.display = 'none';
            ScrollTrigger.refresh();
        }
    });
};

/**
 * 4. MASTER EXPORT
 */
export const initHero = async () => {
    document.documentElement.classList.add("is-loading");
    document.body.classList.add("overflow-y-hidden");

    // Force the scroll to the top so the loader is visible
    window.scrollTo(0, 0);

    gsap.set('.hero__football', { x: '100vw', opacity: 0 });
    gsap.set('.hero__kissy', { scale: 0, opacity: 0 });

    setupGlobalModelWalking();

    try {
        let loadedCount = 0;

        updateLoadingProgress(0);

        // Map every image path to a loading "Promise"
        await Promise.all(
            CRITICAL_IMAGES.map(async (path) => {
                try {
                    // Try to load the image
                    await loadImageAsync(path);
                } catch (e) {
                    // If one image fails, don't crash the whole site!
                    console.warn("Could not load image:", path);
                }

                // Every time an image (success or fail) finishes, update progress
                loadedCount++;
                updateLoadingProgress(loadedCount);
            })
        );

        // Once all images are finished, play the "Open Curtain" animation
        runCurtainSequence();

    } catch (err) {
        /**
         * 5. THE EMERGENCY EXIT
         * If anything in the 'try' block explodes, we must 
         * unlock the screen so the user isn't stuck forever.
         */
        console.error("Critical loader error:", err);
        document.body.classList.remove("overflow-y-hidden");
        document.documentElement.classList.remove("is-loading");

        // Hide the curtain manually if the GSAP sequence didn't run
        const curtain = document.querySelector('.intro-curtain');
        if (curtain) curtain.style.display = 'none';
    }
};