import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import delay from "./utils/delay.js";
import loadImageAsync from "./utils/loadImageAsync.js";

gsap.registerPlugin(ScrollTrigger);

const CRITICAL_IMAGES = [
    "/fashion-love-story/images/kissy1-400.avif",
    "/fashion-love-story/images/model_hero-800.avif",
    "/fashion-love-story/images/lycra-1200.avif"
];

const setupGlobalModelWalking = () => {
    const model = document.querySelector('.global-scroll-model');
    const hero = document.querySelector('.hero');
    const transition = document.querySelector('.transition'); // The section it walks into

    if (!model || !hero) return;

    // Set initial state hidden and small
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

const updateLoadingProgress = (loadedCount) => {
    const $percentage = document.querySelector(".preloader__percentage");

    //Calculate the fraction
    const relativeProgress = loadedCount / CRITICAL_IMAGES.length;

    // fraction into a % n show
    if ($percentage) {
        $percentage.textContent = `${Math.round(relativeProgress * 100)}%`;
    }
};

const playHeroAnimations = () => {
    const tl = gsap.timeline();

    // The kissy face pop-in
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
        // The football player fly-in
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
            "-=0.4" // slightly before the kissy face finishes
        );
};


const runCurtainSequence = async () => {
    const els = {
        curtain: document.querySelector('.intro-curtain'),
        text: document.querySelector('.intro-curtain__text'),
        img: document.querySelector('.intro-curtain__img')
    };

    if (!els.curtain) return;

    // show the XOXO and Kiss
    const tl1 = gsap.timeline();
    tl1.to(els.text, {
            opacity: 1,
            scale: 1,
            duration: 0.5
        })

        // image kissy pop in
        .to(els.img, {
            opacity: 1,
            scale: 1,
            rotation: -15,        
            duration: 0.8,
            ease: "back.out(1.7)"  
        }, "-=0.3");

    // forces the computer to wait 1 second 
    await delay(1000);

    // Slide the curtain up
    gsap.to(els.curtain, {
        y: '-100%',
        duration: 1.2,
        ease: "power4.inOut",
        onStart: () => playHeroAnimations(),
        onComplete: () => {
            // remove classes so the site is interactive
            document.body.classList.remove("overflow-y-hidden");
            document.documentElement.classList.remove("is-loading");
            els.curtain.style.display = 'none';
            ScrollTrigger.refresh();
        }
    });
};


export const initHero = async () => {
    document.documentElement.classList.add("is-loading");
    document.body.classList.add("overflow-y-hidden");
    window.scrollTo(0, 0);

    // Hide things
    gsap.set(['.hero__football', '.hero__kissy'], { opacity: 0 });
    setupGlobalModelWalking();

    try {
        // Loading Phase
        let loadedCount = 0;
        await Promise.all(CRITICAL_IMAGES.map(async (path) => {
            await loadImageAsync(path);
            loadedCount++;
            updateLoadingProgress(loadedCount);
        }));

        // wait a tiny bit so visible
        await delay(200);
        runCurtainSequence();

    } catch (err) {
        // if error dont let the user get stuck on currrtain
        document.documentElement.classList.remove("is-loading");
        document.body.classList.remove("overflow-y-hidden");
    }
};