

const initBlindDateArchive = () => {
    const section = document.getElementById('blind-date-section');
    const toggle = document.getElementById('inspector-switch');
    const layers = document.querySelectorAll('.secret-layer');

    // Guard clause: Exit if elements don't exist
    if (!section || !toggle) return;

    // 1. Toggle Change Logic
    toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            section.classList.add('is-inspecting');

            // Force reveal on mobile immediately
            if (window.innerWidth < 1024) {
                layers.forEach(layer => {
                    layer.style.opacity = "1";

                    // --- THE MISSING FIX ---
                    // Remove the "flashlight" mask so the full image shows
                    layer.style.webkitMaskImage = "none";
                    layer.style.maskImage = "none";
                });
            }
        } else {
            section.classList.remove('is-inspecting');

            // Clean up styles when turning off
            layers.forEach(layer => {
                layer.style.opacity = "0";

                // Optional: Reset mask to avoid glitches if they resize back to desktop
                if (window.innerWidth >= 1024) {
                    layer.style.webkitMaskSize = "0px 0px";
                    layer.style.maskSize = "0px 0px";
                }
            });
        }
    });

    // 2. Desktop Mouse Move (Lens Logic)
    section.addEventListener('mousemove', (e) => {
        if (toggle.checked && window.innerWidth >= 1024) {
            layers.forEach(layer => {
                const rect = layer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Reveal the lens
                layer.style.opacity = '1';

                // SAFARI FIX: Use standard 100% size, don't stretch it to 200%
                // The gradient positions itself, so we don't need to stretch the box.
                layer.style.webkitMaskSize = '100% 100%';
                layer.style.maskSize = '100% 100%';

                layer.style.webkitMaskRepeat = 'no-repeat';
                layer.style.maskRepeat = 'no-repeat';

                // SAFARI FIX: Use 'rgba(0,0,0,0)' instead of 'transparent' 
                // and add a softer edge (100% -> 100% can be jagged in Safari)
                const maskCss = `radial-gradient(circle 120px at ${x}px ${y}px, black 50%, rgba(0,0,0,0) 100%)`;

                layer.style.webkitMaskImage = maskCss;
                layer.style.maskImage = maskCss;
            });
        }
    });

    // 3. Desktop Mouse Leave (Hide Lens)
    section.addEventListener('mouseleave', () => {
        if (toggle.checked && window.innerWidth >= 1024) {
            layers.forEach(layer => layer.style.opacity = '0');
        }
    });
};

function init() {
    initBlindDateArchive();

    console.log('Fashion Love Story Ready');
}
init();