import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 1. VISUAL EFFECTS
 */
const setupEyeTracker = () => {
    const lycraSection = document.querySelector('.watching-lycra');
    const pupils = document.querySelectorAll('.watching-lycra__pupil');
    if (!lycraSection || pupils.length === 0) return;

    const handleMove = (e) => {
        const xCoord = e.touches ? e.touches[0].clientX : e.clientX;
        const yCoord = e.touches ? e.touches[0].clientY : e.clientY;
        pupils.forEach((pupil) => {
            const eye = pupil.parentElement;
            const rect = eye.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(yCoord - centerY, xCoord - centerX);
            const distance = Math.min(rect.width / 4, 15);
            pupil.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px))`;
        });
    };
    lycraSection.addEventListener('mousemove', handleMove);
    lycraSection.addEventListener('touchmove', handleMove, { passive: true });
};

/**
 * 2. FAILED DATES (Falling Title & Pop-in)
 */
const setupFailedDates = () => {
    const section = document.querySelector('.failed-dates');
    const title = document.querySelector('.failed-title');
    if (!section) return;

    let mm = gsap.matchMedia();

    // The Falling Animation (Desktop Only)
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

/**
 * 3. MOBILE HORIZONTAL SCROLL (Blind Date Blue)
 * This makes the models "walk" sideways on mobile
 */
const setupMobileGalleryScroll = () => {
    const gallery = document.querySelector('.blue-gallery');
    const section = document.querySelector('.blind-date-blue');
    if (!gallery || !section) return;

    let mm = gsap.matchMedia();

    mm.add("(max-width: 1023px)", () => {
        const scrollAmount = gallery.scrollWidth - window.innerWidth;
        gsap.to(gallery, {
            x: () => -(scrollAmount + 150),
            ease: "none",
            scrollTrigger: {
                trigger: ".blue-gallery",
                start: "top 20%",
                end: () => `+=${scrollAmount + 400}`,
                pin: ".blind-date-blue",
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    });
};

/**
 * 4. OTHER INTERACTION HELPERS
 */
const setupBulbTransition = () => {
    const section = document.querySelector(".idea-flash");
    if (!section) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "+=150%", scrub: 1, pin: true } });
    tl.to(".idea-flash__bulb", { autoAlpha: 1, y: 0, scale: 1.2, ease: "back.out(1.7)", duration: 1 })
        .to(".idea-flash__glow", { scale: 150, duration: 3, ease: "power2.inOut" }, "+=0.2")
        .to([".idea-flash__dirk", ".idea-flash__bulb", ".idea-flash__content"], { autoAlpha: 0, duration: 0.5 }, "<60%");
};

const setupTicket3D = () => {
    const ticket = document.getElementById('ticket3D');
    if (!ticket) return;
    ticket.addEventListener('mousemove', (e) => {
        const rect = ticket.getBoundingClientRect();
        const xRot = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        const yRot = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        ticket.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
    ticket.addEventListener('mouseleave', () => ticket.style.transform = `rotateX(0deg) rotateY(0deg)`);
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

const setupFailedQuotes = () => {
    const wrapper = document.querySelector('.failed-image-wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('click', () => {
        // We check width if you only want this behavior on mobile
        if (window.innerWidth < 1024) {
            wrapper.classList.toggle('is-active');
            console.log("Quote toggled");
        }
    });
};

/**
 * MASTER INIT (The Export)
 */
export const initGeneralInteractions = () => {
    setupEyeTracker();
    setupFailedDates();
    setupMobileGalleryScroll();
    setupBulbTransition();
    setupTicket3D();
    initHighlighter();
    setupFailedQuotes();

    console.log("All general interactions (Falling dates, walking models, etc) loaded.");
};