import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. DESKTOP LOGIC
const handleDesktopPinning = (section, dirkSection) => {
    if (!section || !dirkSection) return;
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.top <= 0 && rect.bottom > viewportHeight) {
        dirkSection.className = 'leather-years__dirk is-fixed';
    } else if (rect.top > 0) {
        dirkSection.className = 'leather-years__dirk';
    } else if (rect.bottom <= viewportHeight) {
        dirkSection.className = 'leather-years__dirk is-bottom';
    }
};

const setupDesktopAnimations = () => {
    // Kill existing triggers to prevent duplicates on resize
    ScrollTrigger.getAll().forEach(t => {
        if (t.trigger && t.trigger.classList.contains('leather-years__item')) t.kill();
    });

    const items = document.querySelectorAll('.leather-years__item');
    items.forEach((item) => {
        gsap.from(item, {
            opacity: 0,
            y: 80,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: "play none none reverse"
            }
        });
    });
};

// 2. INTERACTION HELPERS
const setupCardFlips = () => {
    const cards = document.querySelectorAll('.leather-years__item-image');
    cards.forEach(card => {
        // Use a named function so we can remove it if needed
        const toggleFlip = () => {
            if (window.innerWidth < 1024) {
                card.classList.toggle('is-flipped');
            }
        };
        card.removeEventListener('click', toggleFlip); // Prevent double-binding
        card.addEventListener('click', toggleFlip);
    });
};

// 3. MAIN EXPORT
export const initDirk = () => {
    const section = document.querySelector('.leather-years');
    const dirkSection = document.querySelector('.leather-years__dirk');
    const scrollContainer = document.querySelector('.leather-years__scroll-container');

    if (!section) return;

    const runLayoutLogic = () => {
        const isDesktop = window.innerWidth >= 1024;

        if (isDesktop) {
            // Desktop logic
            const pinHandler = () => handleDesktopPinning(section, dirkSection);
            window.removeEventListener('scroll', pinHandler);
            window.addEventListener('scroll', pinHandler);
            handleDesktopPinning(section, dirkSection); // Initial check
            setupDesktopAnimations();
        } else {
            // Mobile logic
            if (scrollContainer) {
                scrollContainer.style.webkitOverflowScrolling = 'touch';
            }
        }
    };

    // Run on init
    runLayoutLogic();
    setupCardFlips();

    // Re-run on resize (Optional but recommended)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(runLayoutLogic, 250);
    });

    console.log('Dirk Leather Years initialized');
};