import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);

// 1. SCROLL LOCK (Desktop Pinning)
function initLeatherYearsScrollLock() {
    const section = document.querySelector('.leather-years');
    const dirkSection = document.querySelector('.leather-years__dirk');

    if (!section || !dirkSection || window.innerWidth < 1024) return;

    const update = () => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 0 && rect.bottom > window.innerHeight) {
            dirkSection.classList.add('is-fixed');
            dirkSection.classList.remove('is-bottom');
        } else if (rect.top > 0) {
            dirkSection.classList.remove('is-fixed', 'is-bottom');
        } else if (rect.bottom <= window.innerHeight) {
            dirkSection.classList.remove('is-fixed');
            dirkSection.classList.add('is-bottom');
        }
    };

    window.addEventListener('scroll', update);
    update();
}

// 2. MOBILE HORIZONTAL SCROLL
function initLeatherYearsMobileScroll() {
    const scrollContainer = document.querySelector('.leather-years__scroll-container');
    const section = document.querySelector('.leather-years');

    if (!scrollContainer || !section || window.innerWidth >= 1024) return;

    let isScrolling = false;

    const handleScroll = () => {
        const rect = section.getBoundingClientRect();
        isScrolling = (rect.top < window.innerHeight && rect.bottom > 0);
    };

    const handleWheel = (e) => {
        if (!isScrolling) return;
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            e.preventDefault();
            scrollContainer.scrollLeft += e.deltaY;
        }
    };

    const handleTouchStart = (e) => {
        if (!isScrolling) return;
        scrollContainer.dataset.touchStartY = e.touches[0].clientY;
        scrollContainer.dataset.touchStartX = scrollContainer.scrollLeft;
    };

    const handleTouchMove = (e) => {
        if (!isScrolling || !scrollContainer.dataset.touchStartY) return;
        const touchStartY = parseFloat(scrollContainer.dataset.touchStartY);
        const touchStartX = parseFloat(scrollContainer.dataset.touchStartX);
        const deltaY = touchStartY - e.touches[0].clientY;
        e.preventDefault();
        scrollContainer.scrollLeft = touchStartX + (deltaY * 2);
    };

    window.addEventListener('scroll', handleScroll);
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    scrollContainer.addEventListener('touchend', () => {
        delete scrollContainer.dataset.touchStartY;
        delete scrollContainer.dataset.touchStartX;
    });

    handleScroll();
}

// 3. CARD FLIP (New Interaction)
function initCardFlip() {
    const cards = document.querySelectorAll('.leather-years__item-image');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                card.classList.toggle('is-flipped');
            }
        });
    });
}

// 4. DESKTOP FADE-IN ANIMATIONS
function initLeatherYearsAnimations() {
    const items = document.querySelectorAll('.leather-years__item');
    if (!items.length) return;

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
}

// 5. THE MASTER DIRK INIT
const init = () => {
    initLeatherYearsScrollLock();
    initLeatherYearsMobileScroll();
    initLeatherYearsAnimations();
    initCardFlip(); // Don't forget to call it here!
};

// Start logic
init();