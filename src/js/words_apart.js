import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// SEPARATE WORLDS POP-IN 
function initSeparateWorldsPopIn() {
    const closingStatement = document.querySelector('.two-worlds__closing');
    const grid = document.querySelector('.two-worlds__grid'); 

    if (!closingStatement || !grid) return;

    closingStatement.style.position = 'relative';
    closingStatement.style.zIndex = '10';

    gsap.fromTo(closingStatement,
        { opacity: 0, scale: 0.5, y: 50 },
        {
            opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: grid,     
                start: "bottom 75%",
                toggleActions: "play none none reverse",
            }
        }
    );
}

const init = () => {
    initSeparateWorldsPopIn();
    console.log('Pop-in animation ready');
}

init();