const init = () => {
    console.log('Init started');

    const modal = document.querySelector('#clappingModal');
    const startBtn = document.querySelector('#startExperience');
    const skipBtn = document.querySelector('#skipBtn');
    const volBar = document.querySelector('#volumeBar');
    const energyBar = document.querySelector('#energyBar');
    const energyText = document.querySelector('#energyText');
    const overlay = document.querySelector('#spotlightOverlay');
    const stage = document.querySelector('#sanSiroStage');
    const yearDisplay = document.querySelector('#yearDisplay');
    const scrollHint = document.querySelector('#scrollHint');

    let energy = 0;
    let unlocked = false;
    let currentStream = null; // Store stream to stop it later

    // Stop microphone completely
    const killMicrophone = () => {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            console.log(' Microphone disconnected completely.');
            currentStream = null;
        }
    };

    // Clapping logic
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
            // Stop loop if game is won
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

            if (vol > 15) {
                energy += 1.5; 
            } else {
                energy -= 0.5; 
            }

            energy = Math.max(0, Math.min(100, energy));

            if (energyBar) energyBar.style.width = energy + '%';
            if (energyText) energyText.textContent = Math.floor(energy) + '%';

            // WIN CONDITION
            if (energy >= 100) {
                unlocked = true;

                // Hide game modal
                if (modal) modal.classList.remove('clapping-modal--active');

                // Hide dark overlay
                if (overlay) overlay.classList.add('san-siro__dark-overlay--hidden');

                // Show scroll hint
                if (scrollHint) scrollHint.classList.add('san-siro__scroll-hint--visible');

                // Stop microphone
                killMicrophone();

                console.log('Unlocked & Mic Stopped!');
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

    //  EVENT LISTENERS 
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

    //  SPOTLIGHT & SCROLL 
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
                        //  reset logic if they scroll back up
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
    document.body.classList.add('js-enabled');
    console.log('Init finished');
};

init();