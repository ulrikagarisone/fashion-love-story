import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LOGIC: The "FLIP" animation for the Captain image
 * Moving an element from a gallery to a hero position on scroll.
 */
const runCaptainTransition = () => {
    const source = document.querySelector('.blue-item:nth-child(3) .img-wrapper');
    const sourceLabel = document.querySelector('.blue-item:nth-child(3) .tag-vertical');
    const dest = document.querySelector('.happy-accident__hero-wrapper');

    if (!source || !dest) return;

    // 1. Get the starting and ending positions
    const state1 = source.getBoundingClientRect();
    const state2 = dest.getBoundingClientRect();

    const deltaX = state2.left - state1.left;
    const deltaY = state2.top - state1.top;

    // 2. Build the timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".blind-date-blue",
            start: "top top",
            end: "bottom center",
            scrub: 1.5,
            invalidateOnRefresh: true 
        }
    });

    tl.to(sourceLabel, { autoAlpha: 0, duration: 0.1 }, 0.15)
      .to(source, {
          x: deltaX,
          y: deltaY,
          width: state2.width,
          height: state2.height,
          rotation: -5,
          borderRadius: "0px",
          ease: "power2.inOut",
          zIndex: 100
      }, 0)
      .to(dest, { autoAlpha: 1, duration: 0.2 }, "-=0.2")
      .to(source, { autoAlpha: 0, duration: 0.2 }, "<");
};

/**
 * MASTER EXPORT
 */
export const initCaptainAnimation = () => {
    let mm = gsap.matchMedia();

    // ONLY RUNS ON DESKTOP (Min-Width 1024px)
    mm.add("(min-width: 1024px)", () => {
        // Clear props on refresh to ensure math is always correct
        ScrollTrigger.addEventListener("refreshInit", () => {
            const source = document.querySelector('.blue-item:nth-child(3) .img-wrapper');
            if (source) gsap.set(source, { clearProps: "all" });
        });

        // Small delay to let the layout settle before measuring
        setTimeout(runCaptainTransition, 200);
    });
};