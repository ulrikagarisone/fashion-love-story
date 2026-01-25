import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const initBlindDateArchive = () => {
    const section = document.querySelector('#blind-date-section');
    const toggle = document.querySelector('#inspector-switch');
    const layers = document.querySelectorAll('.secret-layer');

    if (!section || !toggle) return;

    // Toggle change logic
    toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            section.classList.add('is-inspecting');

            // for mobile just makae evrithing visable
            if (window.innerWidth < 1024) {
                layers.forEach(layer => {
                    layer.style.opacity = "1";
                    layer.style.webkitMaskImage = "none";
                    layer.style.maskImage = "none";
                });
            }
        } else {
            //if switch off hide evrithing and reset
            section.classList.remove('is-inspecting');
            layers.forEach(layer => {
                layer.style.opacity = "0";
                if (window.innerWidth >= 1024) {
                    layer.style.webkitMaskSize = "0px 0px";
                    layer.style.maskSize = "0px 0px";
                }
            });
        }
    });

    section.addEventListener('mousemove', (e) => {

        //if the switch is ON and the user is on a compute
        if (toggle.checked && window.innerWidth >= 1024) {
            layers.forEach(layer => {
                const rect = layer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                layer.style.opacity = '1';
                layer.style.webkitMaskSize = '100% 100%';
                layer.style.maskSize = '100% 100%';
                layer.style.webkitMaskRepeat = 'no-repeat';
                layer.style.maskRepeat = 'no-repeat';

                const maskCss = `radial-gradient(circle 120px at ${x}px ${y}px, black 50%, rgba(0,0,0,0) 100%)`; //circle that follows mouse coordinates
                layer.style.webkitMaskImage = maskCss;
                layer.style.maskImage = maskCss; //apply this mask to the secret layer
            });
        }
    });

    // desktop mouse leave
    section.addEventListener('mouseleave', () => {
        if (toggle.checked && window.innerWidth >= 1024) {
            layers.forEach(layer => layer.style.opacity = '0'); //hide layers when mouse leaves
        }
    });
};

export const initInteraction1 = () => {
    initBlindDateArchive();
    console.log('Fashion Love Story interaction1 ready');
};
