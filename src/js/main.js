import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// 4. SEPARATE WORLDS POP-IN
function initSeparateWorldsPopIn() {
  const closingStatement = document.querySelector('.two-worlds__closing');
  const grid = document.querySelector('.two-worlds__grid');

  if (!closingStatement || !grid) return;

  //  ONLY hide it if JS runs. 
  gsap.set(closingStatement, {
    opacity: 0,
    scale: 0.8,
    y: 50,
    position: 'relative',
    zIndex: 10
  });

  gsap.to(closingStatement, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: grid,
      start: "bottom 75%", 
      toggleActions: "play none none reverse",
    }
  });
}


const initEyeTracker = () => {
  const lycraSection = document.querySelector('.watching-lycra');
  const pupils = document.querySelectorAll('.watching-lycra__pupil');

  if (!lycraSection || pupils.length === 0) return;

  const handleMove = (e) => {
    // Get coordinates from either mouse or the first touch point
    const xCoord = e.touches ? e.touches[0].clientX : e.clientX;
    const yCoord = e.touches ? e.touches[0].clientY : e.clientY;

    pupils.forEach((pupil) => {
      const eye = pupil.parentElement;
      const rect = eye.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(yCoord - centerY, xCoord - centerX);
      const distance = Math.min(rect.width / 4, 15);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
  };

  // Add touchstart so they react immediately on tap
  lycraSection.addEventListener('mousemove', handleMove);
  lycraSection.addEventListener('touchmove', handleMove, { passive: true });
  lycraSection.addEventListener('touchstart', handleMove, { passive: true });
};


// 8. SAN SIRO / TICKET (WRAPPED IN FUNCTION TO PREVENT CRASH)
function initSanSiro() {
  const overlay = document.getElementById('spotlightOverlay');
  const stage = document.querySelector('.san-siro');
  const yearDisplay = document.getElementById('yearDisplay');
  const ticket = document.getElementById('ticket3D');

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
              yearDisplay.innerText = entry.target.getAttribute('data-year') || yearDisplay.innerText;
            }
          }
          entry.target.classList.add('san-siro__trigger--active');
        } else {
          entry.target.classList.remove('san-siro__trigger--active');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.san-siro__trigger').forEach(el => observer.observe(el));
  }

  if (ticket) {
    ticket.addEventListener('mousemove', (e) => {
      const rect = ticket.getBoundingClientRect();
      const xRot = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      const yRot = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      ticket.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
    ticket.addEventListener('mouseleave', () => ticket.style.transform = `rotateX(0deg) rotateY(0deg)`);
  }
}

const initFailedQuotes = () => {
  const wrapper = document.querySelector('.failed-image-wrapper');

  wrapper.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
      wrapper.classList.toggle('is-active');
    }
  });
};



function initFailedDates() {
  const section = document.querySelector('.failed-dates');
  const title = document.querySelector('.failed-title');
  const closingStatement = document.querySelector('.failed-statement');

  if (!section) return;

  // Create a MatchMedia object
  let mm = gsap.matchMedia();

  // ONLY RUN ON DESKTOP (Min-width 1024px)
  mm.add("(min-width: 1024px)", () => {
    // THE "FALLING" TITLE
    gsap.fromTo(title,
      {
        y: -50,
        rotation: 0
      },
      {
        y: 100,
        rotation: 8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom top",
          scrub: 1
        }
      }
    );
  });

  // THE POP-IN (Keep this for both Mobile and Desktop)
  if (closingStatement) {
    gsap.set(closingStatement, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      position: 'relative',
      zIndex: 10
    });

    gsap.to(closingStatement, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: closingStatement,
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });
  }
}

const initCaptainAnimation = () => {
  let mm = gsap.matchMedia();

  // ONLY RUNS ON DESKTOP (Min-Width 1024px)
  mm.add("(min-width: 1024px)", () => {
    const source = document.querySelector('.blue-item:nth-child(3) .img-wrapper');
    const sourceLabel = document.querySelector('.blue-item:nth-child(3) .tag-vertical');
    const dest = document.querySelector('.happy-accident__hero-wrapper');

    if (!source || !dest) return;

    const moveCaptain = () => {
      // Clear existing transforms to get clean "starting" positions
      gsap.set(source, { clearProps: "all" });

      const state1 = source.getBoundingClientRect();
      const state2 = dest.getBoundingClientRect();

      const deltaX = state2.left - state1.left;
      const deltaY = state2.top - state1.top;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".blind-date-blue",
          start: "top top",
          end: "bottom center",
          scrub: 1.5,
          invalidateOnRefresh: true // Forces math update if window resizes
        }
      });

      tl.to(sourceLabel, { autoAlpha: 0, duration: 0.1 }, 0.15)
        .to(source, {
          x: deltaX,
          y: deltaY,
          width: state2.width,
          height: state2.height,
          rotation: -5,
          borderRadius: "0px",
          ease: "power2.inOut",
          zIndex: 100
        }, 0)
        .to(dest, { autoAlpha: 1, duration: 0.2 }, "-=0.2")
        .to(source, { autoAlpha: 0, duration: 0.2 }, "<");
    };

    // Use ScrollTrigger.refresh() to ensure layout is settled before math
    ScrollTrigger.addEventListener("refreshInit", () => gsap.set(source, { clearProps: "all" }));
    setTimeout(moveCaptain, 200);
  });
};

const initHighlighter = () => {
  const highlights = document.querySelectorAll(".highlight-yellow");

  highlights.forEach((highlight) => {
    gsap.to(highlight, {
      scrollTrigger: {
        trigger: highlight,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      backgroundPosition: "0% 0",
      duration: 0.8,
      ease: "power2.out"
    });
  });
};

const initBulbTransition = () => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".idea-flash",
      start: "top top",
      end: "+=150%",
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });

  // Bulb Pops Up
  tl.to(".idea-flash__bulb", {
    autoAlpha: 1,
    y: 0,
    scale: 1.2,
    ease: "back.out(1.7)",
    duration: 1
  });

  // The Explosion
  tl.to(".idea-flash__glow", {
    scale: 150,
    duration: 3,
    ease: "power2.inOut"
  }, "+=0.2");

  // Hide content
  tl.to([".idea-flash__dirk", ".idea-flash__bulb", ".idea-flash__content"], {
    autoAlpha: 0,
    duration: 0.5
  }, "<60%");

};


const initMobileHorizontalScroll = () => {
  const gallery = document.querySelector('.blue-gallery');
  const section = document.querySelector('.blind-date-blue');
  if (!gallery || !section) return;

  let mm = gsap.matchMedia();

  //the DESKTOP behavior here
  mm.add("(min-width: 1024px)", () => {
    gsap.set(gallery, { x: 0 });
    return () => { };
  });

  mm.add("(max-width: 1023px)", () => {
    const scrollAmount = gallery.scrollWidth - window.innerWidth;

    gsap.to(gallery, {
      x: () => -(scrollAmount + 150),
      ease: "none",
      scrollTrigger: {
        trigger: ".blue-gallery",
        start: "top 20%",
        end: () => `+=${scrollAmount + 400}`,
        pin: ".blind-date-blue",
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      gsap.set(gallery, { x: 0 });
    };
  });
};


function init() {


  initSeparateWorldsPopIn();
  initEyeTracker();
  initFailedQuotes();
  initSanSiro();


  initFailedDates();
  initMobileHorizontalScroll();

  initCaptainAnimation();


  initHighlighter();


  initBulbTransition();

  console.log('Fashion Love Story Ready');
}
init();