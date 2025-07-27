document.addEventListener('DOMContentLoaded', () => {
    const birthdayTime = new Date('2025-07-31T00:00:00');
    const ACCESS_CODE = 'HBDnimra';

    // Page containers
    const countdownContainer = document.getElementById('countdown-container');
    const accessCodePage = document.getElementById('access-code-page');
    const gsapStoryPage = document.getElementById('gsap-story-page');
    const birthdayWishPage = document.getElementById('birthday-wish-page');

    // Countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const daysProgress = document.getElementById('days-progress');
    const hoursProgress = document.getElementById('hours-progress');
    const minutesProgress = document.getElementById('minutes-progress');
    const secondsProgress = document.getElementById('seconds-progress');
    const circleCircumference = 2 * Math.PI * 70;

    // Access code elements
    const accessCodeInput = document.getElementById('access-code-input');
    const submitCodeButton = document.getElementById('submit-code-button');
    const accessError = document.getElementById('access-error');

    // GSAP Story elements
    const replayBtn = document.getElementById("replay");
    const storyToWishBtn = document.getElementById("story-to-wish-btn");
    const fakeBtn = document.querySelector(".fake-btn");


    // Final wish elements
    const goBackButton = document.getElementById('go-back-button');

    // Audio element
    const birthdaySong = document.getElementById('birthday-song');

    let timeCheckInterval;
    let animationTl; // To hold the GSAP timeline

    function playMusic() {
        if (birthdaySong) {
            birthdaySong.play().catch(error => console.log("Music play failed:", error));
        }
    }

    function transitionTo(pageToShow) {
        const pages = [countdownContainer, accessCodePage, gsapStoryPage, birthdayWishPage];
        pages.forEach(page => {
            if (page !== pageToShow) {
                page.classList.add('fade-out');
                setTimeout(() => page.classList.add('hidden'), 1000);
            }
        });
        
        setTimeout(() => {
            pageToShow.classList.remove('hidden');
            setTimeout(() => pageToShow.classList.remove('fade-out'), 50);
        }, 800);
    }

    function promptForMusicAndStart() {
        Swal.fire({
            title: 'Do you want to play music in the background?',
            text: "It's recommended for the full experience!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary-color)',
            cancelButtonColor: 'var(--secondary-color)',
            confirmButtonText: 'Yes, play it!',
            customClass: {
                popup: 'glass-popup'
            },
            background: 'transparent',
            color: 'var(--text-color)'
        }).then((result) => {
            if (result.isConfirmed) {
                playMusic();
            }
            transitionTo(gsapStoryPage);
            setTimeout(() => {
                if (animationTl) {
                    animationTl.restart();
                } else {
                    animationTimeline();
                }
            }, 1000);
        });
    }

    function updateCountdown() {
        const now = new Date();
        const timeLeft = birthdayTime - now;

        if (timeLeft <= 0) {
            clearInterval(timeCheckInterval);
            transitionTo(accessCodePage);
            return;
        }

        const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

        daysEl.textContent = d.toString().padStart(2, '0');
        hoursEl.textContent = h.toString().padStart(2, '0');
        minutesEl.textContent = m.toString().padStart(2, '0');
        secondsEl.textContent = s.toString().padStart(2, '0');

        const updateProgress = (element, value, max) => {
            const percent = value / max;
            element.style.strokeDashoffset = circleCircumference * (1 - percent);
        };
        
        updateProgress(daysProgress, d, 365);
        updateProgress(hoursProgress, h, 24);
        updateProgress(minutesProgress, m, 60);
        updateProgress(secondsProgress, s, 60);
    }

    const animationTimeline = () => {
        const textBoxChars = document.querySelector(".hbd-chatbox");
        const hbd = document.querySelector(".wish-hbd");

        textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML.split("").join("</span><span>")}</span>`;
        hbd.innerHTML = `<span>${hbd.innerHTML.split("").join("</span><span>")}</span>`;

        const ideaTextTrans = {
            opacity: 0, y: -20, rotationX: 5, skewX: "15deg"
        };
        const ideaTextTransLeave = {
            opacity: 0, y: 20, rotationY: 5, skewX: "-15deg"
        };

        animationTl = gsap.timeline({
            onComplete: () => {
                storyToWishBtn.classList.remove('hidden');
            }
        });

        animationTl.to("#gsap-story-page", { autoAlpha: 1, duration: 0.1 })
            .from(".one", { duration: 0.7, autoAlpha: 0, y: 10 })
            .from(".two", { duration: 0.4, autoAlpha: 0, y: 10 })
            .to(".one, .two", { duration: 0.7, autoAlpha: 0, y: 10 }, "+=2.5")
            .from(".three", { duration: 0.7, autoAlpha: 0, y: 10 })
            .to(".three", { duration: 0.7, autoAlpha: 0, y: 10 }, "+=2")
            .from(".four", { duration: 0.7, scale: 0.2, autoAlpha: 0 })
            .from(".fake-btn", { duration: 0.3, scale: 0.2, autoAlpha: 0 })
            .to(".hbd-chatbox span", { autoAlpha: 1, stagger: 0.05 })
            .add("hbd-sent")
            .to(".fake-btn", { duration: 0.1, backgroundColor: "rgb(127, 206, 248)" })
            .to(".four", { duration: 0.5, scale: 0.2, autoAlpha: 0, y: -150 }, "+=1")
            .from(".idea-1", { duration: 0.7, ...ideaTextTrans })
            .to(".idea-1", { duration: 0.7, ...ideaTextTransLeave }, "+=2")
            .from(".idea-2", { duration: 0.7, ...ideaTextTrans })
            .to(".idea-2", { duration: 0.7, ...ideaTextTransLeave }, "+=2")
            .from(".idea-3", { duration: 0.7, ...ideaTextTrans })
            .to(".idea-3 strong", { duration: 0.5, scale: 1.2, x: 10, backgroundColor: "#28a7f8", color: "#fff" })
            .to(".idea-3", { duration: 0.7, ...ideaTextTransLeave }, "+=2")
            .from(".idea-4", { duration: 0.7, ...ideaTextTrans })
            .to(".idea-4", { duration: 0.7, ...ideaTextTransLeave }, "+=2")
            .from(".idea-5", { duration: 0.7, rotationX: 15, rotationZ: -10, skewY: "-5deg", y: 50, z: 10, autoAlpha: 0 }, "+=1")
            .to(".idea-5 span", { duration: 0.7, rotation: 90, x:40, scale: 1.2 }, "+=1")
            .to(".idea-5", { duration: 0.7, scale: 0.2, autoAlpha: 0 }, "+=2")
            .from(".idea-6 span", { duration: 0.8, scale: 3, autoAlpha: 0, rotation: 15, ease: "expo.out", stagger: 0.2 })
            .to(".idea-6 span", { duration: 0.8, scale: 3, autoAlpha: 0, rotation: -15, ease: "expo.out", stagger: 0.2 }, "+=1")
            .fromTo(".baloons img", { y: 1400 }, { duration: 2.5, y: -1000, autoAlpha: 1, stagger: 0.2 })
            .from(".profile-picture", { duration: 0.5, scale: 3.5, autoAlpha: 0, x: 25, y: -25, rotationZ: -45 }, "-=2")
            .from(".hat", { duration: 0.5, x: -100, y: 350, rotation: -180, autoAlpha: 0 })
            .from(".wish-hbd span", { duration: 0.7, autoAlpha: 0, y: -50, rotation: 150, skewX: "30deg", ease: "elastic.out(1, 0.5)", stagger: 0.1 })
            .to(".wish-hbd span", { duration: 0.7, scale: 1, rotationY: 0, color: "var(--primary-color)", ease: "expo.out", stagger: 0.1 }, "party")
            .from(".wish h5", { duration: 0.5, autoAlpha: 0, y: 10, skewX: "-15deg" }, "party")
            .fromTo(".eight svg", { autoAlpha: 0, scale: 1 }, { duration: 1.5, autoAlpha: 1, scale: 80, ease: "expo.out", stagger: { each: 0.3, repeat: 3, repeatDelay: 1.4 } })
            .to(".six", { duration: 0.5, autoAlpha: 0, y: 30, zIndex: "-1" })
            .from(".nine p", { duration: 1, ...ideaTextTrans, stagger: 1.2 })
            .to(".last-smile", { duration: 0.5, rotation: 90 }, "+=1");
    };
    
    const heartSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f72585"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    // --- DYNAMIC ELEMENT CREATION ---
    function createBalloons(count) {
        const baloonsContainer = document.querySelector('.baloons');
        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('img');
            balloon.src = `images/ballon${(i % 3) + 1}.svg`;
            balloon.alt = "";
            balloon.onerror = function() { this.style.display='none' };
            baloonsContainer.appendChild(balloon);
        }
    }

    function createConfetti(count) {
        const confettiContainer = document.querySelector('.eight');
        for (let i = 0; i < count; i++) {
            const confetti = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            confetti.setAttribute('viewBox', '0 0 40 40');
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute('cx', '20');
            circle.setAttribute('cy', '20');
            circle.setAttribute('r', '20');
            confetti.appendChild(circle);
            confettiContainer.appendChild(confetti);
        }
    }
    
    function init() {
        // Setup Event Listeners
        const handleAccessCode = () => {
            if (accessCodeInput.value === ACCESS_CODE) {
                promptForMusicAndStart();
            } else {
                accessError.textContent = 'Incorrect code. Please try again.';
                accessCodeInput.value = '';
                accessCodePage.classList.add('shake');
                setTimeout(() => accessCodePage.classList.remove('shake'), 820);
            }
        };

        submitCodeButton.addEventListener('click', handleAccessCode);
        accessCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAccessCode();
            }
        });
        
        replayBtn.addEventListener("click", () => {
            storyToWishBtn.classList.add('hidden');
            animationTl.restart();
        });

        storyToWishBtn.addEventListener("click", () => {
            transitionTo(birthdayWishPage);
        });
        
        goBackButton.addEventListener("click", () => {
            transitionTo(gsapStoryPage);
            if (animationTl) {
                storyToWishBtn.classList.add('hidden');
                animationTl.restart();
            }
        });
        
        fakeBtn.addEventListener("click", () => {
            animationTl.seek("hbd-sent");
        });


        // Setup ParticlesJS
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: '#f72585' },
                shape: { type: 'image', image: { src: heartSVG, width: 100, height: 100 } },
                opacity: { value: 0.6, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false } },
                size: { value: 8, random: true, anim: { enable: true, speed: 2, size_min: 4, sync: false } },
                line_linked: { enable: false },
                move: { enable: true, speed: 1, direction: 'top', random: true, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false } }, modes: {} },
            retina_detect: true
        });

        // Initial page setup
        [accessCodePage, gsapStoryPage, birthdayWishPage].forEach(page => {
            page.classList.add('hidden', 'fade-out');
        });
        countdownContainer.classList.remove('hidden', 'fade-out');

        [daysProgress, hoursProgress, minutesProgress, secondsProgress].forEach(bar => {
            bar.style.strokeDasharray = circleCircumference;
        });
        
        // Create dynamic elements
        createBalloons(30);
        createConfetti(9);
        
        // Start countdown
        updateCountdown();
        timeCheckInterval = setInterval(updateCountdown, 1000);
    }

    // Initialize the application
    init();
});