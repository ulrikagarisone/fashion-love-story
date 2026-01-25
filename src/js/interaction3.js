import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let currentStream = null;

const killMicrophone = () => {
    if (currentStream !== null) {
        // Find every audio track and tell it to stop recording
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
        //rest to empty
        currentStream = null;
    }
};


const startClappingLogic = (stream, els) => {
    currentStream = stream;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass(); // cretes audio context
    const analyser = ctx.createAnalyser(); //rounds sound waves into numbers
    const mic = ctx.createMediaStreamSource(stream); //connnects mic tos audio context

    analyser.fftSize = 1024;
    mic.connect(analyser); 

    // create an array with 512 slots (one for each pitch)
    // each slot holds a number from 0 to 255 (how loud that pitch is)
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

        analyser.getByteFrequencyData(dataArray); //fills up a array with numbers
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum = sum + dataArray[i]; //add up all the frequencies
        }
        const vol = sum / dataArray.length;

        // update volume bar UI
        if (els.volBar) {
            els.volBar.style.height = Math.min(100, vol * 2) + '%';
        }

        // calculate energy
        if (vol > 15) {
            energy = energy + 1.5; //progress bar goes
        } else {
            energy = energy - 0.5; //drains 
        }

        // keep energy between 0 and 100 for %
        if (energy < 0) { energy = 0; }
        if (energy > 100) { energy = 100; }

        // Update Energy UI
        if (els.energyBar) {
            els.energyBar.style.width = energy + '%';
        }
        if (els.energyText) {
            els.energyText.textContent = Math.floor(energy) + '%';
        }
        // check for win condition
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


const initSanSiroScroll = (els) => {
    // Spotlight follow
    els.stage.addEventListener('mousemove', (e) => {
        // check if the lights are already on
        const isHidden = els.overlay.classList.contains('san-siro__dark-overlay--hidden');
        if (isHidden === false) {
            const rect = els.stage.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // send the numbers to CSS variables
            els.overlay.style.setProperty('--x', mouseX + 'px');
            els.overlay.style.setProperty('--y', mouseY + 'px');
        }
    });


    // Setup the observer to 'watch' our scroll triggers
    const observer = new IntersectionObserver((entries) => {

        // Loop through everything the observer just detected
        entries.forEach(entry => {
            // Get the specific id
            const step = entry.target.getAttribute('data-target');

            if (entry.isIntersecting === true) { //Check if elemt actaly entered teh scren

                entry.target.classList.add('san-siro__trigger--active');

                // Is this the very first 'Intro' section
                const isIntro = entry.target.classList.contains('san-siro__trigger--intro');

                // If this is a Year section, hide the darknes
                if (isIntro === false) {
                    els.overlay.classList.add('san-siro__dark-overlay--hidden');

                    if (els.scrollHint) {
                        els.scrollHint.classList.remove('san-siro__scroll-hint--visible'); // hide scroll hint user is already scrolling
                    }

                    if (els.yearDisplay) {
                        els.yearDisplay.classList.add('san-siro__year-display--visible');
                        const yearAttr = entry.target.getAttribute('data-year'); //go to the HTML and grab the year number
                        if (yearAttr) {
                            els.yearDisplay.textContent = yearAttr; //if founf display
                        }
                    }
                }

                // hide every single model description box
                if (step) {
                    document.querySelectorAll('.san-siro__model').forEach(model => {
                        model.classList.remove('san-siro__model--active');
                    });

                    // find the specific box that matches current year
                    const targetModel = document.querySelector(`.san-siro__model[data-step="${step}"]`);
                    if (targetModel) {
                        targetModel.classList.add('san-siro__model--active');
                    }
                }

            } else {
                // reset leaving view
                entry.target.classList.remove('san-siro__trigger--active');

                // If user scrolls back up past the intro, show the spotlight again
                const isIntro = entry.target.classList.contains('san-siro__trigger--intro');
                const isScrollingUp = entry.boundingClientRect.top > 0;

                if (isIntro === true && isScrollingUp === true) {
                    //bring back darkness
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

    // Find every single trigger element in the HTML
    document.querySelectorAll('.san-siro__trigger').forEach(trigger => {
        observer.observe(trigger); // Tell the observer to start watching each one
    });
};


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

    //check stadium and overlay exists
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

        // Try to get the mic
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // REQUEST MIC wait for user to click alow
            startClappingLogic(stream, els); //start game pass the mic data to the clapping logic
        } catch (error) {
            console.log('Mic Error:', error);
            if (els.skipBtn) {
                els.skipBtn.textContent = 'Mic denied. Click to continue'; //update text if denied 
            }
        }
    };

    if (els.startBtn) {
        els.startBtn.addEventListener('click', openModal);
    }

    //connect skip button to the handleWin function
    if (els.skipBtn) {
        els.skipBtn.addEventListener('click', () => {
            handleWin(els);
        });
    }

    document.body.classList.add('js-enabled');
};