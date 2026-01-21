import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/style.css';

gsap.registerPlugin(ScrollTrigger);


    function initIntro() {
        const tl = gsap.timeline();

        const curtain = document.querySelector('.intro-curtain');
        const text = document.querySelector('.intro-curtain__text');
        const kiss = document.querySelector('.intro-curtain__img');

        if (!curtain) return;

        tl.to(text, {
            opacity: 1,
            scale: 1, 
            duration: 1,
            ease: "power2.out"
        })

            // 2. KISS STAMPS DOWN
            .to(kiss, {
                opacity: 1,
                scale: 1,
                rotation: -15, 
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.2")

            // 3. PAUSE
            .to({}, { duration: 0.5 })

            // 4. CURTAIN UP
            .to(curtain, {
                y: '-100%',
                duration: 1.1,
                ease: "power3.inOut",
                onComplete: () => {
                    curtain.style.display = 'none';
                }
            });
    }

const init = () => {
    initIntro();
}

init();