import gsap from 'gsap';

const CORRECT_ANSWERS = {
    shoulder: 'leather',
    core: 'lycra',
    knees: 'leather'
};

// Helper to check the answer
const checkMaterialMatch = (spot, material) => {
    return CORRECT_ANSWERS[spot] === material;
};


const animateModalOpen = () => {
    const previews = document.querySelectorAll(".sticker-lab__preview");

    previews.forEach((element) => {
        let targetRotation = 0;

        // element rhombus class, change the rotation to 45
        if (element.classList.contains('sticker-lab__preview--rhombus')) {
            targetRotation = 45;
        }

        gsap.fromTo(element,
            {
                scale: 0,
                rotation: -90
            },
            {
                scale: 1,
                rotation: targetRotation,
                duration: 0.5,
                ease: "back.out(1.7)"
            }
        );
    });
};


const showFeedback = (isCorrect) => {
    const feedbackText = document.querySelector('#feedbackText');
    const feedbackContainer = document.querySelector('#feedback');

    if (!feedbackText || !feedbackContainer) {
        return;
    }

    // reset the state
    feedbackText.classList.remove('is-correct', 'is-wrong');

    if (isCorrect === true) {
        feedbackText.textContent = "MATCH";
        feedbackText.classList.add('is-correct');
    } else {
        feedbackText.textContent = "TRY AGAIN";
        feedbackText.classList.add('is-wrong');
    }

    // show the message to the user
    feedbackContainer.classList.add('sticker-lab__feedback--show');

    setTimeout(() => {
        feedbackContainer.classList.remove('sticker-lab__feedback--show');
    }, 1500);
};


const handleCorrectAnswer = (spot, material) => {
    //find the add on of the 3
    const btn = document.querySelector(`button[data-spot="${spot}"]`);

    if (btn) {
        btn.style.display = 'none';

        // Check if there is an element right before the button 
        const previousElement = btn.previousElementSibling;
        if (previousElement) {
            previousElement.style.display = 'none';
        }
    }

    // find the correct sticker
    const badge = document.querySelector(`.sticker-lab__badge[data-badge="${spot}"]`);

    if (badge) {
        // Change the class to show the specific material leather or lycra
        badge.className = `sticker-lab__badge sticker-lab__badge--${material}`;

        gsap.fromTo(badge,
            {
                scale: 0
            },
            {
                scale: 1,
                duration: 0.6,
                ease: "elastic.out(1, 0.5)"
            }
        );
    }
};


export const initInteraction2 = () => {
    const modal = document.querySelector('#stickerModal');
    const questionText = document.querySelector('#question');
    const closeBtn = document.querySelector('.sticker-lab__close-btn');
    let currentSpot = null;

    if (!modal || !questionText) return;

    // Listeners for opening the modal
    document.querySelectorAll('.sticker-lab__add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSpot = btn.dataset.spot;
            questionText.textContent = btn.dataset.text;
            modal.classList.add('sticker-lab__modal--active');
            animateModalOpen();
        });
    });

    // Listeners for choosing and animation
    document.querySelectorAll('.sticker-lab__option').forEach(opt => {
        opt.addEventListener('click', () => {
            const material = opt.dataset.material;
            const isCorrect = checkMaterialMatch(currentSpot, material);

            modal.classList.remove('sticker-lab__modal--active');
            showFeedback(isCorrect);

            if (isCorrect) {
                handleCorrectAnswer(currentSpot, material);
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('sticker-lab__modal--active');
        });
    }
};