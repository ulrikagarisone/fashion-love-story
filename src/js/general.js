import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const setupTwoWorldsStatement = () => {
    const smallText = document.querySelector('.two-worlds__statement-small');
    const largeText = document.querySelector('.two-worlds__statement-large');
    const closingSection = document.querySelector('.two-worlds__closing');

    if (smallText !== null) {
        if (largeText !== null) {
            if (closingSection !== null) {

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: closingSection,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });

                // slides up
                tl.fromTo(smallText,
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    }
                );

                // pops in with a slight big then small ease
                tl.fromTo(largeText,
                    {
                        opacity: 0,
                        y: 40,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: "back.out(1.5)"
                    },
                    "-=0.5" // starts the large text halfway through the first animation
                );
            }
        }
    }
};


const setupEyeTracker = () => {
    const lycraSection = document.querySelector('.watching-lycra');
    const pupils = document.querySelectorAll('.watching-lycra__pupil');

    // stop if elements are missing
    if (!lycraSection || pupils.length === 0) {
        return;
    }

    const handleMove = (e) => {
        let xCoord;
        let yCoord;

        //Check if the user is using a Touch Screen or a Mouse
        if (e.touches) {
            xCoord = e.touches[0].clientX;
            yCoord = e.touches[0].clientY;
        } else {
            // It's a mouse
            xCoord = e.clientX;
            yCoord = e.clientY;
        }

        pupils.forEach((pupil) => {
            const eye = pupil.parentElement;
            const rect = eye.getBoundingClientRect();

            // Find the exact middle of the eyeball
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Math to find the direction of the mouse/finger
            const angle = Math.atan2(yCoord - centerY, xCoord - centerX);

            // Limit how far the pupil can move
            const distance = Math.min(rect.width / 4, 15);

            // Calculate the move
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;

            // Apply the movement
            pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        });
    };

    lycraSection.addEventListener('mousemove', handleMove);
    lycraSection.addEventListener('touchmove', handleMove, { passive: true });
};


const setupFailedDates = () => {
    const section = document.querySelector('.failed-dates');
    const title = document.querySelector('.failed-title');
    if (!section) return;

    let mm = gsap.matchMedia();

    // The falling aimation 
    mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(title,
            { y: -50, rotation: 0 },
            {
                y: 100, rotation: 8, ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top center",
                    end: "bottom top",
                    scrub: 1
                }
            }
        );
    });
};

const setupFailedStatement = () => {
    const smallText = document.querySelector('.failed-statement-small');
    const largeText = document.querySelector('.failed-statement-large');

    if (smallText !== null) {
        if (largeText !== null) {

            // Create a timeline so they animate one after the other
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".failed-closing",
                    start: "top 80%", // Starts when the bottom section is 80% down the screen
                    toggleActions: "play none none reverse"
                }
            });

            tl.fromTo(smallText,
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }
            );

            tl.fromTo(largeText,
                {
                    opacity: 0,
                    scale: 0.8,
                    y: 30
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                },
                "-=0.4" // Starts slightly before the small text finishes
            );
        }
    }
};


const setupMobileGalleryScroll = () => {
    const gallery = document.querySelector('.blue-gallery');
    const section = document.querySelector('.blind-date-blue');
    if (!gallery || !section) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
        // sideways walk if the screen is actually small
        if (window.innerWidth < 1024) {

            const scrollAmount = gallery.scrollWidth - window.innerWidth;  //how many pixels the gallery needs to move to reach the end

            gsap.to(gallery, {
                x: () => -(scrollAmount + 150), //moves the gallery to the left
                ease: "none",
                scrollTrigger: {
                    trigger: ".blue-gallery",
                    start: "top 20%",
                    end: () => `+=${scrollAmount + 400}`,
                    pin: ".blind-date-blue",  //page stays still while the images slide by
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
        }
    });
};


const setupBulbTransition = () => {
    const section = document.querySelector(".idea-flash");

    if (!section) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",      // stay for 1.5 screen-lengths of scrolling
            scrub: 1,
            pin: true           // freeze the screen during the flash
        }
    });

    tl.to(".idea-flash__bulb", {
        autoAlpha: 1,
        y: 0,
        scale: 1.2,
        ease: "back.out(1.7)",
        duration: 1
    })

        .to(".idea-flash__glow", {
            scale: 150,             // Grow massive to cover everything
            duration: 3,
            ease: "power2.inOut"
        }, "+=0.2")                 // Start 0.2s after bulb pops

        .to([".idea-flash__dirk", ".idea-flash__bulb", ".idea-flash__content"], {
            autoAlpha: 0,
            duration: 0.5
        }, "<60%");                 // Start when the glow is 60% finished
};


const setupTicket3D = () => {
    const ticket = document.querySelector('.ticket');

    if (!ticket) return;

    ticket.addEventListener('mousemove', (e) => {
        // Find the ticke position, size on the screen
        const rect = ticket.getBoundingClientRect();

        // calculate how far your mouse is from the center verticaly
        const xRot = ((e.clientY - rect.top) / rect.height - 0.5) * -10;

        // now horizontall
        const yRot = ((e.clientX - rect.left) / rect.width - 0.5) * 10;

        // Apply the 3D tilt
        ticket.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });

    ticket.addEventListener('mouseleave', () => {
        ticket.style.transform = `rotateX(0deg) rotateY(0deg)`;// Reset
    });
};

const initHighlighter = () => {
    const highlights = document.querySelectorAll(".highlight-yellow");

    highlights.forEach((highlight) => {
        gsap.to(highlight, {
            backgroundPosition: "0% 0", // Moves the yellow gradient into view
            duration: 1,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: highlight,
                start: "top 85%",
                toggleActions: "play none none reverse",
            }
        });
    });
};


export const initGeneralInteractions = () => {
    setupTwoWorldsStatement();
    setupEyeTracker();
    setupFailedDates();
    setupFailedStatement();
    setupMobileGalleryScroll();
    setupBulbTransition();
    setupTicket3D();
    initHighlighter();

    console.log("All general interactions (Falling dates, walking models, etc) loaded.");
};