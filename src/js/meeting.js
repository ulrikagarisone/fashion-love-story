import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 1. ANIMATION FACTORY
 * This function only handles the GSAP sequence.
 */
const createMeetingTimeline = (els) => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: els.section,
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tl.from(els.theText, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    })
        .from(els.meetText, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.6")
        .from(els.ingText, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        }, "<")
        .fromTo(els.imageWrapper,
            { clipPath: "inset(0 50% 0 50%)", scale: 1.1 },
            { clipPath: "inset(0 0% 0 0%)", scale: 1, duration: 1.2, ease: "expo.out" },
            "-=0.8"
        )
        .from(els.image, {
            scale: 1.4,
            duration: 1.5,
            ease: "power2.out"
        }, "<")
        .from(els.content, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.5");

    return tl;
};

/**
 * 2. MASTER INIT (The Export)
 */
export const initMeeting = () => {
    const section = document.querySelector('.meeting');

    // If the section isn't on this page, stop immediately
    if (!section) return;

    // Group elements into a "State" object
    const els = {
        section: section,
        theText: section.querySelector('.meeting__line-top'),
        meetText: section.querySelector('.meeting__text:first-child'),
        ingText: section.querySelector('.meeting__text:last-child'),
        imageWrapper: section.querySelector('.meeting__image-wrapper'),
        image: section.querySelector('.meeting__image'),
        content: section.querySelector('.meeting__content')?.children
    };

    // Run the animation factory
    createMeetingTimeline(els);

    console.log('Meeting section logic initialized');
};