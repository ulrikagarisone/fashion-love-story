import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


// THE MEETING SECTION ANIMATION
function initMeetingSection() {
    const section = document.querySelector('.meeting');

    // Select elements
    const theText = document.querySelector('.meeting__line-top');
    const meetText = document.querySelector('.meeting__text:first-child');
    const ingText = document.querySelector('.meeting__text:last-child'); // Only visible on desktop
    const imageWrapper = document.querySelector('.meeting__image-wrapper');
    const image = document.querySelector('.meeting__image');
    const content = document.querySelector('.meeting__content').children; // Subtitle, paragraphs

    if (!section) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 75%", // Starts when section hits 75% of viewport
            toggleActions: "play none none reverse"
        }
    });

    // 1. "THE" drops down
    tl.from(theText, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    })

        // 2. "MEET" slides in from Left
        .from(meetText, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.6")

        // 3. "ING" slides in from Right (Desktop only)
        .from(ingText, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        }, "<") // "<" means start at same time as previous animation

        // 4. IMAGE REVEAL (The "Cool" Part)
        // We use clip-path to make it look like it's unfolding from the center
        .fromTo(imageWrapper,
            {
                clipPath: "inset(0 50% 0 50%)", // Hidden as a thin line in the center
                scale: 1.1
            },
            {
                clipPath: "inset(0 0% 0 0%)", 
                scale: 1, 
                duration: 1.2,
                ease: "expo.out"
            },
            "-=0.8" 
        )

        // The image scales down while the wrapper opens
        .from(image, {
            scale: 1.4,
            duration: 1.5,
            ease: "power2.out"
        }, "<")

        // BODY CONTENT 
        .from(content, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.5");
}


const init = () => {
    initMeetingSection();
    console.log('Meeting ready');
}

init();