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

// Function to handle the opening animation
const animateModalOpen = () => {
    gsap.fromTo(".sticker-lab__preview",
        { scale: 0, rotation: -90 },
        {
            scale: 1,
            rotation: (i, t) => t.classList.contains('sticker-lab__preview--rhombus') ? 45 : 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        }
    );
};

// Function to show feedback toast
const showFeedback = (isCorrect) => {
    const feedbackText = document.querySelector('#feedbackText');
    const feedbackContainer = document.querySelector('#feedback');

    if (!feedbackText || !feedbackContainer) return;

    feedbackText.classList.remove('is-correct', 'is-wrong');
    feedbackText.textContent = isCorrect ? "MATCH" : "TRY AGAIN";
    feedbackText.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

    feedbackContainer.classList.add('sticker-lab__feedback--show');
    setTimeout(() => {
        feedbackContainer.classList.remove('sticker-lab__feedback--show');
    }, 1500);
};

// Function to update the UI when a user wins
const handleCorrectAnswer = (spot, material) => {
    const btn = document.querySelector(`button[data-spot="${spot}"]`);
    if (btn) {
        btn.style.display = 'none';
        if (btn.previousElementSibling) btn.previousElementSibling.style.display = 'none';
    }

    const badge = document.querySelector(`.sticker-lab__badge[data-badge="${spot}"]`);
    if (badge) {
        badge.className = `sticker-lab__badge sticker-lab__badge--${material}`;
        gsap.fromTo(badge, { scale: 0 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }
};

//  exported entry point that sets up listeners
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

    // Listeners for choosing an option
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