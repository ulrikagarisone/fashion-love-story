/**
 * 1. UTILS & AUDIO LOGIC
 */
let currentStream = null;

const killMicrophone = () => {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
};

/**
 * 2. THE CLAPPING GAME ENGINE
 */
const startClappingLogic = (stream, els) => {
    currentStream = stream;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    const mic = ctx.createMediaStreamSource(stream);

    analyser.fftSize = 1024;
    mic.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let energy = 0;
    let unlocked = false;

    const checkVolume = () => {
        if (unlocked) { ctx.close(); return; }

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const vol = sum / dataArray.length;

        // UI Update
        if (els.volBar) els.volBar.style.height = Math.min(100, vol * 2) + '%';

        energy += (vol > 15) ? 1.5 : -0.5;
        energy = Math.max(0, Math.min(100, energy));

        if (els.energyBar) els.energyBar.style.width = energy + '%';
        if (els.energyText) els.energyText.textContent = Math.floor(energy) + '%';

        if (energy >= 100) {
            unlocked = true;
            handleWin(els);
        } else {
            requestAnimationFrame(checkVolume);
        }
    };
    checkVolume();
};

const handleWin = (els) => {
    if (els.modal) els.modal.classList.remove('clapping-modal--active');
    if (els.overlay) els.overlay.classList.add('san-siro__dark-overlay--hidden');
    if (els.scrollHint) els.scrollHint.classList.add('san-siro__scroll-hint--visible');
    killMicrophone();
    console.log('Unlocked & Mic Stopped!');
};

/**
 * 3. THE SCROLL & TEXT BOX LOGIC (The part we missed!)
 */
const initSanSiroScroll = (els) => {
    // Spotlight movement
    els.stage.addEventListener('mousemove', (e) => {
        if (!els.overlay.classList.contains('san-siro__dark-overlay--hidden')) {
            const rect = els.stage.getBoundingClientRect();
            els.overlay.style.setProperty('--x', `${e.clientX - rect.left}px`);
            els.overlay.style.setProperty('--y', `${e.clientY - rect.top}px`);
        }
    });

    // Observer for Years and Models (The text boxes)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('san-siro__trigger--intro')) {
                    els.overlay.classList.add('san-siro__dark-overlay--hidden');
                    if (els.scrollHint) els.scrollHint.classList.remove('san-siro__scroll-hint--visible');

                    if (els.yearDisplay) {
                        els.yearDisplay.classList.add('san-siro__year-display--visible');
                        els.yearDisplay.textContent = entry.target.getAttribute('data-year') || els.yearDisplay.textContent;
                    }
                }
                entry.target.classList.add('san-siro__trigger--active');
            } else {
                entry.target.classList.remove('san-siro__trigger--active');
            }

            // --- THIS FIXES THE TEXT BOXES ---
            const step = entry.target.getAttribute('data-target');
            if (step && entry.isIntersecting) {
                document.querySelectorAll('.san-siro__model').forEach(m => {
                    m.classList.remove('san-siro__model--active');
                });
                const activeModel = document.querySelector(`.san-siro__model[data-step="${step}"]`);
                if (activeModel) activeModel.classList.add('san-siro__model--active');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.san-siro__trigger').forEach(el => observer.observe(el));
};

/**
 * 4. THE MASTER EXPORT
 */
export const initInteraction3 = () => {
    const els = {
        modal: document.querySelector('#clappingModal'),
        startBtn: document.querySelector('#startExperience'),
        skipBtn: document.querySelector('#skipBtn'),
        volBar: document.querySelector('#volumeBar'),
        energyBar: document.querySelector('#energyBar'),
        energyText: document.querySelector('#energyText'),
        overlay: document.querySelector('#spotlightOverlay'),
        stage: document.querySelector('#sanSiroStage'),
        yearDisplay: document.querySelector('#yearDisplay'),
        scrollHint: document.querySelector('#scrollHint')
    };

    if (els.stage && els.overlay) {
        initSanSiroScroll(els);
    }

    const openModal = async () => {
        if (els.modal) els.modal.classList.add('clapping-modal--active');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startClappingLogic(stream, els);
        } catch (e) {
            if (els.skipBtn) els.skipBtn.textContent = 'Mic denied. Click to continue';
        }
    };

    if (els.startBtn) els.startBtn.addEventListener('click', openModal);

    if (els.skipBtn) {
        els.skipBtn.addEventListener('click', () => handleWin(els));
    }

    document.body.classList.add('js-enabled');
};