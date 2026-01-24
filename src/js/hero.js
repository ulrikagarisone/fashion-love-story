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

    // 1. The Kissy Face pop-in
    tl.fromTo('.hero__kissy',
        { scale: 0, opacity: 0, rotation: 20 },
        {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        }
    )
        // 2. The Football Player fly-in
        .fromTo('.hero__football',
            {
                x: '100vw',
                opacity: 0,
                rotation: -45
            },
            {
                x: 0,
                opacity: 1,
                rotation: 0,
                duration: 1.2,
                ease: "power3.out"
            },
            "-=0.4" // Starts slightly before the kissy face finishes
        );
};

const runCurtainSequence = async () => {
    const els = {
        curtain: document.querySelector('.intro-curtain'),
        text: document.querySelector('.intro-curtain__text'),
        img: document.querySelector('.intro-curtain__img')
    };

    if (!els.curtain) return;

    // 1. PHASE ONE: Show the XOXO and Kiss
    const tl1 = gsap.timeline();
    tl1.to(els.text, { opacity: 1, scale: 1, duration: 0.5 })
        .to(els.img, { opacity: 1, scale: 1, rotation: -15, duration: 0.8, ease: "back.out(1.7)" }, "-=0.3");

    // This pauses the code for 1 second so people can see the XOXO
    await delay(1000);

    // 3. PHASE TWO: Slide the curtain up
    gsap.to(els.curtain, {
        y: '-100%',
        duration: 1.2,
        ease: "power4.inOut",
        onStart: () => playHeroAnimations(),
        onComplete: () => {
            // Clean up: Remove classes so the site is interactive
            document.body.classList.remove("overflow-y-hidden");
            document.documentElement.classList.remove("is-loading");
            els.curtain.style.display = 'none';
            ScrollTrigger.refresh();
        }
    });
};

export const initHero = async () => {
    // 1. Setup
    document.documentElement.classList.add("is-loading");
    document.body.classList.add("overflow-y-hidden");
    window.scrollTo(0, 0);

    // 2. Hide things
    gsap.set(['.hero__football', '.hero__kissy'], { opacity: 0 });
    setupGlobalModelWalking();

    try {
        // 3. Loading Phase
        let loadedCount = 0;
        await Promise.all(CRITICAL_IMAGES.map(async (path) => {
            await loadImageAsync(path);
            loadedCount++;
            updateLoadingProgress(loadedCount);
        }));

        // 4. Sequence Phase
        // We wait a tiny bit after images load so the 100% bar is visible
        await delay(200);
        runCurtainSequence();

    } catch (err) {
        // 5. Error Phase 
        document.documentElement.classList.remove("is-loading");
        document.body.classList.remove("overflow-y-hidden");
    }
};