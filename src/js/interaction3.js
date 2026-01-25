import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let currentStream = null;

/**
 * 1. UTILS
 */
const killMicrophone = () => {
    if (currentStream !== null) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
        currentStream = null;
    }
};

/**
 * 2. CLAPPING ENGINE (With Reset Capability)
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
        // If the modal was closed, stop the loop and the mic
        if (els.modal.classList.contains('clapping-modal--active') === false) {
            killMicrophone();
            ctx.close();
            return;
        }

        if (unlocked === true) {
            ctx.close();
            return;
        }

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum = sum + dataArray[i];
        }
        const vol = sum / dataArray.length;

        // Update Volume Bar UI
        if (els.volBar) {
            els.volBar.style.height = Math.min(100, vol * 2) + '%';
        }

        // Calculate Energy
        if (vol > 15) {
            energy = energy + 1.5;
        } else {
            energy = energy - 0.5;
        }

        // Keep energy between 0 and 100
        if (energy < 0) { energy = 0; }
        if (energy > 100) { energy = 100; }

        // Update Energy UI
        if (els.energyBar) {
            els.energyBar.style.width = energy + '%';
        }
        if (els.energyText) {
            els.energyText.textContent = Math.floor(energy) + '%';
        }

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
    if (els.modal) {
        els.modal.classList.remove('clapping-modal--active');
    }
    if (els.overlay) {
        els.overlay.classList.add('san-siro__dark-overlay--hidden');
    }
    if (els.scrollHint) {
        els.scrollHint.classList.add('san-siro__scroll-hint--visible');
    }
    killMicrophone();
};

/**
 * 3. SCROLL & RESET LOGIC
 */
const initSanSiroScroll = (els) => {
    // Spotlight follow
    els.stage.addEventListener('mousemove', (e) => {
        const isHidden = els.overlay.classList.contains('san-siro__dark-overlay--hidden');
        if (isHidden === false) {
            const rect = els.stage.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            els.overlay.style.setProperty('--x', mouseX + 'px');
            els.overlay.style.setProperty('--y', mouseY + 'px');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const step = entry.target.getAttribute('data-target');

            if (entry.isIntersecting === true) {
                // --- ENTERING VIEW ---
                entry.target.classList.add('san-siro__trigger--active');

                // If this is a year trigger (not the intro)
                const isIntro = entry.target.classList.contains('san-siro__trigger--intro');
                if (isIntro === false) {
                    els.overlay.classList.add('san-siro__dark-overlay--hidden');

                    if (els.scrollHint) {
                        els.scrollHint.classList.remove('san-siro__scroll-hint--visible');
                    }

                    if (els.yearDisplay) {
                        els.yearDisplay.classList.add('san-siro__year-display--visible');
                        const yearAttr = entry.target.getAttribute('data-year');
                        if (yearAttr) {
                            els.yearDisplay.textContent = yearAttr;
                        }
                    }
                }

                // Activate specific model text box
                if (step) {
                    document.querySelectorAll('.san-siro__model').forEach(model => {
                        model.classList.remove('san-siro__model--active');
                    });
                    const targetModel = document.querySelector(`.san-siro__model[data-step="${step}"]`);
                    if (targetModel) {
                        targetModel.classList.add('san-siro__model--active');
                    }
                }

            } else {
                // --- LEAVING VIEW (RESET) ---
                entry.target.classList.remove('san-siro__trigger--active');

                // If user scrolls back up past the intro, show the spotlight again
                const isIntro = entry.target.classList.contains('san-siro__trigger--intro');
                const isScrollingUp = entry.boundingClientRect.top > 0;

                if (isIntro === true && isScrollingUp === true) {
                    els.overlay.classList.remove('san-siro__dark-overlay--hidden');
                    if (els.yearDisplay) {
                        els.yearDisplay.classList.remove('san-siro__year-display--visible');
                    }
                }

                // Deactivate model text boxes when they leave
                if (step) {
                    const targetModel = document.querySelector(`.san-siro__model[data-step="${step}"]`);
                    if (targetModel) {
                        targetModel.classList.remove('san-siro__model--active');
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.san-siro__trigger').forEach(trigger => {
        observer.observe(trigger);
    });
};

/**
 * 4. MASTER EXPORT
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

    if (els.stage) {
        if (els.overlay) {
            initSanSiroScroll(els);
        }
    }

    const openModal = async () => {
        if (els.modal) {
            els.modal.classList.add('clapping-modal--active');
        }

        // Reset bars to zero whenever modal opens
        if (els.energyBar) { els.energyBar.style.width = '0%'; }
        if (els.volBar) { els.volBar.style.height = '0%'; }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startClappingLogic(stream, els);
        } catch (error) {
            console.log('Mic Error:', error);
            if (els.skipBtn) {
                els.skipBtn.textContent = 'Mic denied. Click to continue';
            }
        }
    };

    if (els.startBtn) {
        els.startBtn.addEventListener('click', openModal);
    }

    if (els.skipBtn) {
        els.skipBtn.addEventListener('click', () => {
            handleWin(els);
        });
    }

    document.body.classList.add('js-enabled');
};