import gsap from 'gsap';

const initStickerLab = () => {
    // 1. Correct Answers
    const correctAnswers = {
        shoulder: 'leather',
        core: 'lycra',
        knees: 'leather'
    };

    let currentSpot = null;

    const modal = document.getElementById('stickerModal');
    const questionText = document.getElementById('question');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackContainer = document.getElementById('feedback');
    const closeBtn = document.querySelector('.sticker-lab__close-btn'); // SELECT IT HERE

    // Open Modal
    document.querySelectorAll('.sticker-lab__add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSpot = btn.dataset.spot;
            questionText.textContent = btn.dataset.text;
            modal.classList.add('sticker-lab__modal--active');

            // Animation for shapes entering
            gsap.fromTo(".sticker-lab__preview",
                { scale: 0, rotation: -90 },
                {
                    scale: 1,
                    rotation: (i, t) => t.classList.contains('sticker-lab__preview--rhombus') ? 45 : 0,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                }
            );
        });
    });

    // Check Answer
    document.querySelectorAll('.sticker-lab__option').forEach(opt => {
        opt.addEventListener('click', () => {
            const chosenMaterial = opt.dataset.material;
            modal.classList.remove('sticker-lab__modal--active');

            const isCorrect = correctAnswers[currentSpot] === chosenMaterial;

            // 1. Reset Classes
            feedbackText.classList.remove('is-correct', 'is-wrong');

            // 2. Set Text & Color Class
            if (isCorrect) {
                feedbackText.textContent = "MATCH";
                feedbackText.classList.add('is-correct');
            } else {
                feedbackText.textContent = "TRY AGAIN";
                feedbackText.classList.add('is-wrong');
            }

            // 3. Show Animation
            feedbackContainer.classList.add('sticker-lab__feedback--show');

            // 4. Hide after 1.5s
            setTimeout(() => {
                feedbackContainer.classList.remove('sticker-lab__feedback--show');
            }, 1500);

            if (isCorrect) {
                const btn = document.querySelector(`button[data-spot="${currentSpot}"]`);
                if (btn) {
                    btn.style.display = 'none';
                    if (btn.previousElementSibling) btn.previousElementSibling.style.display = 'none';
                }

                const badge = document.querySelector(`.sticker-lab__badge[data-badge="${currentSpot}"]`);
                if (badge) {
                    badge.className = `sticker-lab__badge sticker-lab__badge--${chosenMaterial}`;
                    gsap.fromTo(badge, { scale: 0 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
                }
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('sticker-lab__modal--active');
        });
    }
};

const init = () => {
    initStickerLab();
    console.log('Fashion Love Story Ready');
};

init();