console.log('Script loaded');

// ELEMENTS
const modal = document.querySelector('#clappingModal');
const startBtn = document.querySelector('#startExperience');
const skipBtn = document.querySelector('#skipBtn');
const volBar = document.querySelector('#volumeBar');
const energyBar = document.querySelector('#energyBar');
const energyText = document.querySelector('#energyText');
const overlay = document.querySelector('#spotlightOverlay');

console.log('Button found:', startBtn);

// STATE
let energy = 0;
let unlocked = false;

// GLOBAL FUNCTION FOR ONCLICK
window.openModal = () => {
    console.log('✅ BUTTON CLICKED!!!');
    modal.classList.add('clapping-modal--active');
    startMicrophoneCheck();
};

// ALSO TRY addEventListener
if (startBtn) {
    startBtn.onclick = () => {
        console.log('✅ ONCLICK WORKS!!!');
        window.openModal();
    };

    startBtn.addEventListener('click', () => {
        console.log('✅ LISTENER WORKS!!!');
        window.openModal();
    });
}

// START MICROPHONE
const startMicrophoneCheck = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Mic access granted');
        startClapping(stream);
    } catch (e) {
        console.log('Mic denied:', e);
        skipBtn.textContent = 'Mic denied. Click to continue';
    }
};

// SKIP BUTTON
if (skipBtn) {
    skipBtn.addEventListener('click', () => {
        console.log('Skip clicked');
        modal.classList.remove('clapping-modal--active');
        overlay.classList.add('san-siro__dark-overlay--hidden');
    });
}

// CLAPPING LOGIC
const startClapping = (stream) => {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    const mic = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    mic.connect(analyser);
    analyser.connect(processor);
    processor.connect(ctx.destination);

    processor.onaudioprocess = () => {
        if (unlocked) return;

        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const vol = sum / data.length;

        volBar.style.height = Math.min(100, vol * 2) + '%';

        if (vol > 25) {
            energy += 3;
        } else {
            energy -= 0.5;
        }

        energy = Math.max(0, Math.min(100, energy));

        energyBar.style.width = energy + '%';
        energyText.textContent = Math.floor(energy) + '%';

        if (energy >= 100) {
            unlocked = true;
            processor.disconnect();
            modal.classList.remove('clapping-modal--active');
            overlay.classList.add('san-siro__dark-overlay--hidden');
            console.log('Unlocked!');
        }
    };
};

// SAN SIRO SCROLL
const stage = document.querySelector('#sanSiroStage');
const yearDisplay = document.querySelector('#yearDisplay');

if (stage && overlay) {
    stage.addEventListener('mousemove', (e) => {
        if (!overlay.classList.contains('san-siro__dark-overlay--hidden')) {
            const rect = stage.getBoundingClientRect();
            overlay.style.setProperty('--x', `${e.clientX - rect.left}px`);
            overlay.style.setProperty('--y', `${e.clientY - rect.top}px`);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('san-siro__trigger--intro')) {
                    overlay.classList.remove('san-siro__dark-overlay--hidden');
                    if (yearDisplay) yearDisplay.classList.remove('san-siro__year-display--visible');
                } else {
                    overlay.classList.add('san-siro__dark-overlay--hidden');
                    if (yearDisplay) {
                        yearDisplay.classList.add('san-siro__year-display--visible');
                        yearDisplay.textContent = entry.target.getAttribute('data-year') || yearDisplay.textContent;
                    }
                }
                entry.target.classList.add('san-siro__trigger--active');
            } else {
                entry.target.classList.remove('san-siro__trigger--active');
            }

            const step = entry.target.getAttribute('data-target');
            if (step && entry.isIntersecting) {
                document.querySelectorAll('.san-siro__model').forEach(m => m.classList.remove('san-siro__model--active'));
                const active = document.querySelector(`.san-siro__model[data-step="${step}"]`);
                if (active) active.classList.add('san-siro__model--active');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.san-siro__trigger').forEach(el => observer.observe(el));
}

console.log('Script fully loaded');