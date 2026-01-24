import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 1. DESKTOP LOGIC (Pinning & Animations)
 */

const handleDesktopPinning = (section, dirkSection) => {
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

/**
 * 2. MOBILE LOGIC (Touch & Horizontal Scroll)
 */

const setupMobileScroll = (scrollContainer, section) => {
    let isScrolling = false;

    // Detect if user is inside the section
    const checkVisibility = () => {
        const rect = section.getBoundingClientRect();
        isScrolling = (rect.top < window.innerHeight && rect.bottom > 0);
    };

    // Transform vertical wheel to horizontal scroll
    const onWheel = (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
    };

    // Touch logic for mobile
    const onTouchMove = (e) => {
        if (!isScrolling || !scrollContainer.dataset.touchStartY) return;
        const deltaY = parseFloat(scrollContainer.dataset.touchStartY) - e.touches[0].clientY;
        const startX = parseFloat(scrollContainer.dataset.touchStartX);
        e.preventDefault();
        scrollContainer.scrollLeft = startX + (deltaY * 2);
    };

    window.addEventListener('scroll', checkVisibility);
    scrollContainer.addEventListener('wheel', onWheel, { passive: false });
    scrollContainer.addEventListener('touchmove', onTouchMove, { passive: false });

    // Initial check
    checkVisibility();
};

/**
 * 3. INTERACTION HELPERS
 */

const setupCardFlips = () => {
    const cards = document.querySelectorAll('.leather-years__item-image');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                card.classList.toggle('is-flipped');
            }
        });
    });
};

/**
 * 4. THE MAIN EXPORT initDirk
 */
export const initDirk = () => {
    const section = document.querySelector('.leather-years');
    const dirkSection = document.querySelector('.leather-years__dirk');
    const scrollContainer = document.querySelector('.leather-years__scroll-container');

    if (!section) return;

    // Route logic based on device size
    if (window.innerWidth >= 1024) {
        // Desktop Setup
        if (dirkSection) {
            window.addEventListener('scroll', () => handleDesktopPinning(section, dirkSection));
            handleDesktopPinning(section, dirkSection);
        }
        setupDesktopAnimations();
    } else {
        // Mobile Setup
        if (scrollContainer) {
            setupMobileScroll(scrollContainer, section);
        }
    }

    // Common Interactions
    setupCardFlips();

    console.log('Dirk Leather Years initialized');
};