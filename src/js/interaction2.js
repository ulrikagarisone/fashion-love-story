const init = () => {
    console.log('Init started');

    // --- 1. ELEMENTS ---
    const modal = document.querySelector('#clappingModal');
    const startBtn = document.querySelector('#startExperience');
    const skipBtn = document.querySelector('#skipBtn');
    const volBar = document.querySelector('#volumeBar');
    const energyBar = document.querySelector('#energyBar');
    const energyText = document.querySelector('#energyText');
    const overlay = document.querySelector('#spotlightOverlay');
    const stage = document.querySelector('#sanSiroStage');
    const yearDisplay = document.querySelector('#yearDisplay');
    const scrollHint = document.querySelector('#scrollHint'); // NEW ELEMENT

    // --- 2. STATE ---
    let energy = 0;
    let unlocked = false;
    let currentStream = null; // Store stream to stop it later

    // --- 3. HELPER FUNCTIONS ---

    // Stop Microphone Completely
    const killMicrophone = () => {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            console.log('🎤 Microphone disconnected completely.');
            currentStream = null;
        }
    };

    // CLAPPING LOGIC
    const startClapping = (stream) => {
        currentStream = stream; // Save for later

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();

        if (ctx.state === 'suspended') ctx.resume();

        const analyser = ctx.createAnalyser();
        const mic = ctx.createMediaStreamSource(stream);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        mic.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
            // STOP LOOP if game is won
            if (unlocked) {
                ctx.close(); // Close audio processor
                return;
            }

            analyser.getByteFrequencyData(dataArray);

            // Calculate Volume
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const vol = sum / dataArray.length;

            // UI Update
            if (volBar) volBar.style.height = Math.min(100, vol * 2) + '%';

            // --- CHANGE 1: HARDER DIFFICULTY ---
            if (vol > 20) {
                energy += 0.4; // Was 2. Now 0.4 (approx 4-5 seconds of clapping)
            } else {
                energy -= 0.5; // Decays fast if you stop
            }

            energy = Math.max(0, Math.min(100, energy));

            if (energyBar) energyBar.style.width = energy + '%';
            if (energyText) energyText.textContent = Math.floor(energy) + '%';

            // WIN CONDITION
            if (energy >= 100) {
                unlocked = true;

                // 1. Hide Game Modal
                if (modal) modal.classList.remove('clapping-modal--active');

                // 2. Hide Dark Overlay
                if (overlay) overlay.classList.add('san-siro__dark-overlay--hidden');

                // 3. Show Scroll Hint
                if (scrollHint) scrollHint.classList.add('san-siro__scroll-hint--visible');

                // 4. STOP MICROPHONE (Privacy)
                killMicrophone();

                console.log('🔓 Unlocked & Mic Stopped!');
            } else {
                requestAnimationFrame(checkVolume);
            }
        };

        checkVolume();
    };

    const startMicrophoneCheck = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Mic access granted');
            startClapping(stream);
        } catch (e) {
            console.log('Mic denied:', e);
            if (skipBtn) skipBtn.textContent = 'Mic denied. Click to continue';
        }
    };

    // OPEN MODAL & RESET
    const openModal = () => {
        console.log('Opening Modal...');
        unlocked = false;
        energy = 0;

        // Reset UI
        if (energyBar) energyBar.style.width = '0%';
        if (energyText) energyText.textContent = '0%';
        if (volBar) volBar.style.height = '0%';

        if (modal) modal.classList.add('clapping-modal--active');

        startMicrophoneCheck();
    };

    // --- 4. EVENT LISTENERS ---
    window.openModal = openModal;

    if (startBtn) startBtn.addEventListener('click', openModal);

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            unlocked = true;
            if (modal) modal.classList.remove('clapping-modal--active');
            if (overlay) overlay.classList.add('san-siro__dark-overlay--hidden');
            if (scrollHint) scrollHint.classList.add('san-siro__scroll-hint--visible');
            killMicrophone(); // Ensure mic stops even on skip
        });
    }

    // --- 5. SPOTLIGHT & SCROLL ---
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
                        // Optional: reset logic if they scroll back up
                    } else {
                        overlay.classList.add('san-siro__dark-overlay--hidden');
                        // Hide the scroll hint once they actually scroll down
                        if (scrollHint) scrollHint.classList.remove('san-siro__scroll-hint--visible');

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

    console.log('Init finished');
};

init();