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
                layers.forEach(layer => layer.style.opacity = "1");
            }
        } else {
            section.classList.remove('is-inspecting');

            // Clean up styles when turning off
            layers.forEach(layer => {
                layer.style.opacity = "0";
                if (window.innerWidth >= 1024) {
                    layer.style.webkitMaskSize = "0px 0px";
                    layer.style.maskSize = "0px 0px";
                }
            });
        }
    });

    // 2. Desktop Mouse Move (Lens Logic)
    section.addEventListener('mousemove', (e) => {
        // Only run if the Archive toggle is ON and user is on Desktop
        if (toggle.checked && window.innerWidth >= 1024) {
            layers.forEach(layer => {
                const rect = layer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Reveal the lens
                layer.style.opacity = '1';
                layer.style.webkitMaskSize = '200% 200%';
                layer.style.maskSize = '200% 200%';

                const maskCss = `radial-gradient(circle 120px at ${x}px ${y}px, black 100%, transparent 100%)`;
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