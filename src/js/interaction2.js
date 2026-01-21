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

    // --- 2. STATE ---
    let energy = 0;
    let unlocked = false;

    // --- 3. HELPER FUNCTIONS ---

    // Logic to process audio
    // CLAPPING LOGIC (Updated for Safari & No Warnings)
    const startClapping = (stream) => {
        // 1. SAFARI FIX: Handle different browser names
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();

        // 2. SAFARI FIX: Ensure context is running (sometimes it starts 'suspended')
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const analyser = ctx.createAnalyser();
        const mic = ctx.createMediaStreamSource(stream);

        // Setup the Analyser
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        mic.connect(analyser);

        // 3. THE VS CODE FIX: Use a Visual Loop instead of ScriptProcessor
        // We don't need to process audio, we just need to 'look' at it 60 times a second.
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
            // Stop the loop if the game is won
            if (unlocked) {
                // Optional: Close audio context to save battery
                ctx.close();
                return;
            }

            // Get the latest data
            analyser.getByteFrequencyData(dataArray);

            // Calculate Average Volume
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const vol = sum / dataArray.length;

            // --- UPDATE UI ---
            if (volBar) volBar.style.height = Math.min(100, vol * 2) + '%';

            // Game Logic (Adjusted slightly for loop speed)
            if (vol > 20) { // Lowered slightly as visual loops can feel different
                energy += 2; // Increase slower for smoothness
            } else {
                energy -= 0.5;
            }

            // Clamp energy between 0 and 100
            energy = Math.max(0, Math.min(100, energy));

            if (energyBar) energyBar.style.width = energy + '%';
            if (energyText) energyText.textContent = Math.floor(energy) + '%';

            // Win Condition
            if (energy >= 100) {
                unlocked = true;
                if (modal) modal.classList.remove('clapping-modal--active');
                if (overlay) overlay.classList.add('san-siro__dark-overlay--hidden');
                console.log('🔓 Unlocked!');
            } else {
                // Keep looping
                requestAnimationFrame(checkVolume);
            }
        };

        // Kick off the loop
        checkVolume();
    };

    // Microphone access request
    const startMicrophoneCheck = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log(' Mic access granted');
            startClapping(stream);
        } catch (e) {
            console.log(' Mic denied:', e);
            if (skipBtn) skipBtn.textContent = 'Mic denied. Click to continue';
        }
    };

    // Helper to open modal
    const openModal = () => {
        console.log('Opening Modal...');
        if (modal) modal.classList.add('clapping-modal--active');
        startMicrophoneCheck();
    };

    // --- 4. EVENT LISTENERS ---

    // Make openModal available globally just in case you use onclick="window.openModal()" in HTML
    window.openModal = openModal;

    if (startBtn) {
        startBtn.addEventListener('click', openModal);
        console.log('Button listener attached');
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            console.log('Skipping game...');
            if (modal) modal.classList.remove('clapping-modal--active');
            if (overlay) overlay.classList.add('san-siro__dark-overlay--hidden');
        });
    }

    // --- 5. SPOTLIGHT & SCROLL LOGIC ---
    if (stage && overlay) {
        // Spotlight effect
        stage.addEventListener('mousemove', (e) => {
            if (!overlay.classList.contains('san-siro__dark-overlay--hidden')) {
                const rect = stage.getBoundingClientRect();
                overlay.style.setProperty('--x', `${e.clientX - rect.left}px`);
                overlay.style.setProperty('--y', `${e.clientY - rect.top}px`);
            }
        });

        // Scroll Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Handle Intro vs Other Sections
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

                // Handle Model Swapping
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