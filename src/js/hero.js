import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import delay from "./utils/delay.js";
import loadImageAsync from "./utils/loadImageAsync.js";
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

const criticalImages = [
    "/fashion-love-story/images/model_hero-800.avif",
    "/fashion-love-story/images/dirk_boot-800.avif"
];
let numImagesLoaded = 0;
const $percentage = document.querySelector(".preloader__percentage");
const $visual = document.querySelector(".preloader__visual");

const onProgress = () => {
    const relativeProgress = numImagesLoaded / criticalImages.length;
    const progressPercentage = Math.round(relativeProgress * 100);
    if ($percentage) $percentage.textContent = `${progressPercentage}%`;
    if ($visual) $visual.style.transform = `scale3d(1, ${relativeProgress}, 1)`;
};

// Your specific hero animations
function playHeroAnimations() {
    const tl = gsap.timeline();
    tl.to('.hero__kissy', { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" })
        .to('.hero__football', { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.4");
}

// Your Intro combined with the Teacher's "preloadComplete" logic
const startIntroAnimation = async () => {
    // Teacher's logic: wait for visual transition to finish
    await delay(350);

    const tl = gsap.timeline();
    const text = document.querySelector('.intro-curtain__text');
    const kiss = document.querySelector('.intro-curtain__img');
    const curtain = document.querySelector('.intro-curtain');

    tl.fromTo(text, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1 })
        .fromTo(kiss, { opacity: 0, scale: 3, rotation: 10 }, { opacity: 1, scale: 1, rotation: -15, duration: 0.8, ease: "elastic.out" }, "-=0.5")
        .to(curtain, {
            y: '-100%',
            duration: 1.2,
            ease: "power4.inOut",
            onStart: () => {
                gsap.delayedCall(0.5, playHeroAnimations);
            },
            onComplete: () => {
                curtain.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.documentElement.classList.remove('is-loading');
                ScrollTrigger.refresh();
            }
        });
};

const init = async () => {
    window.scrollTo(0, 0);
    document.documentElement.classList.add("is-loading");
    document.body.style.overflow = 'hidden';

    gsap.set('.hero__football', { x: '100vw', opacity: 0 });
    gsap.set('.hero__kissy', { scale: 0, opacity: 0 });

    onProgress();

    // Use .then() and .catch() directly on the promise to prevent "Uncaught" errors
    await Promise.all(
        criticalImages.map(path =>
            loadImageAsync(path)
                .then(() => {
                    numImagesLoaded++;
                    onProgress();
                })
                .catch(() => {
                    console.warn("⚠️ Image failed, but the show must go on:", path);
                    numImagesLoaded++;
                    onProgress();
                })
        )
    );

    console.log("🚀 Forced start!");
    startIntroAnimation();
};

init();