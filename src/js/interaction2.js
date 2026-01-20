const state = {
    energy: 0,
    unlocked: false,
    audioContext: null,
    processor: null
};

// ========== DOM ELEMENTS ==========
const getElements = () => ({
    btn: document.querySelector('#micBtn'),
    overlay: document.querySelector('#gameOverlay'),
    viz: document.querySelector('#visualizer'),
    volBar: document.querySelector('#volumeBar'),
    energyBar: document.querySelector('#energyBar'),
    energyText: document.querySelector('#energyText'),
    err: document.querySelector('#error'),
    yearDisplay: document.querySelector('#yearDisplay'),
    triggers: document.querySelectorAll('.san-siro__trigger'),
    scrollIndicator: document.querySelector('#scrollIndicator')
});

// ========== CLAPPING GAME ==========
const initClappingGame = () => {
    const elements = getElements();

    if (!elements.btn) {
        return;
    }

    elements.btn.addEventListener('click', () => handleMicButtonClick(elements));
};

const handleMicButtonClick = async (elements) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        showVisualizer(elements);
        startAudioProcessing(stream, elements);
    } catch (error) {
        handleMicError(elements);
    }
};

const showVisualizer = (elements) => {
    elements.btn.style.display = 'none';
    elements.viz.style.display = 'block';
};

const handleMicError = (elements) => {
    elements.err.textContent = 'Mic blocked. Click here to skip';
    elements.err.style.cursor = 'pointer';
    elements.err.addEventListener('click', () => skipClappingGame(elements));
};

const skipClappingGame = (elements) => {
    elements.overlay.style.display = 'none';
    state.unlocked = true;
};

const startAudioProcessing = (stream, elements) => {
    state.audioContext = new AudioContext();
    const analyser = state.audioContext.createAnalyser();
    const mic = state.audioContext.createMediaStreamSource(stream);
    state.processor = state.audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    mic.connect(analyser);
    analyser.connect(state.processor);
    state.processor.connect(state.audioContext.destination);

    state.processor.onaudioprocess = () => processAudioFrame(analyser, elements);
};

const processAudioFrame = (analyser, elements) => {
    if (state.unlocked) {
        return;
    }

    const volume = getAverageVolume(analyser);
    updateVolumeBar(volume, elements);
    updateEnergy(volume, elements);
    updateOverlayOpacity(elements);
    checkWinCondition(elements);
};

const getAverageVolume = (analyser) => {
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }

    return sum / data.length;
};

const updateVolumeBar = (volume, elements) => {
    const height = Math.min(100, volume * 2);
    elements.volBar.style.height = `${height}%`;
};

const updateEnergy = (volume, elements) => {
    if (volume > 25) {
        state.energy += 3;
    } else {
        state.energy -= 0.5;
    }

    state.energy = Math.max(0, Math.min(100, state.energy));

    elements.energyBar.style.width = `${state.energy}%`;
    elements.energyText.textContent = `${Math.floor(state.energy)}%`;
};

const updateOverlayOpacity = (elements) => {
    const opacity = 1 - (state.energy / 100);
    elements.overlay.style.backgroundColor = `rgba(0,0,0,${opacity})`;
};

const checkWinCondition = (elements) => {
    if (state.energy >= 100) {
        unlockStadium(elements);
    }
};

const unlockStadium = (elements) => {
    state.unlocked = true;

    if (state.processor) {
        state.processor.disconnect();
        state.processor = null;
    }

    setTimeout(() => {
        elements.overlay.style.display = 'none';
        showScrollIndicator(elements);
    }, 1000);
};

const showScrollIndicator = (elements) => {
    if (elements.scrollIndicator) {
        elements.scrollIndicator.classList.add('san-siro__scroll-indicator--visible');

        setTimeout(() => {
            hideScrollIndicator(elements);
        }, 5000);
    }
};

const hideScrollIndicator = (elements) => {
    if (elements.scrollIndicator) {
        elements.scrollIndicator.classList.remove('san-siro__scroll-indicator--visible');
    }
};

// ========== SCROLL TIMELINE ==========
const initScrollTimeline = () => {
    const elements = getElements();

    if (!elements.triggers.length) {
        return;
    }

    const observer = createTimelineObserver(elements);
    elements.triggers.forEach((trigger) => observer.observe(trigger));
};

const createTimelineObserver = (elements) => {
    return new IntersectionObserver(
        (entries) => handleTimelineIntersection(entries, elements),
        { threshold: 0.5 }
    );
};

const handleTimelineIntersection = (entries, elements) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            handleTriggerActive(entry, elements);
        } else {
            handleTriggerInactive(entry);
        }
    });
};

const handleTriggerActive = (entry, elements) => {
    updateYear(entry, elements);
    updateModel(entry);
    entry.target.classList.add('san-siro__trigger--active');
};

const handleTriggerInactive = (entry) => {
    entry.target.classList.remove('san-siro__trigger--active');
};

const updateYear = (entry, elements) => {
    const year = entry.target.dataset.year;

    if (year) {
        elements.yearDisplay.textContent = year;
        elements.yearDisplay.classList.add('san-siro__year-display--visible');
    } else {
        elements.yearDisplay.classList.remove('san-siro__year-display--visible');
    }
};

const updateModel = (entry) => {
    const step = entry.target.dataset.target;

    if (!step) {
        return;
    }

    const models = document.querySelectorAll('.san-siro__model');
    models.forEach((model) => model.classList.remove('san-siro__model--active'));

    const activeModel = document.querySelector(`[data-step="${step}"]`);
    if (activeModel) {
        activeModel.classList.add('san-siro__model--active');
    }
};

// ========== INIT ==========
const initSanSiro = () => {
    initClappingGame();
    initScrollTimeline();
    console.log('San Siro Experience Ready');
};

const init = () => {
    initSanSiro();

};

// Run on DOM ready
init();