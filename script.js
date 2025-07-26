document.addEventListener('DOMContentLoaded', () => {
    const birthdayTime = new Date('2025-07-31T00:00:00');
    const ACCESS_CODE = 'HBDnimra';

    const countdownContainer = document.getElementById('countdown-container');
    const carouselPage = document.getElementById('carousel-page');
    const birthdayWishPage = document.getElementById('birthday-wish-page');
    const goBackButton = document.getElementById('go-back-button');
    const storyText = document.getElementById('story-text');
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(carouselTrack.children);
    
    const accessCodePage = document.getElementById('access-code-page');
    const accessCodeInput = document.getElementById('access-code-input');
    const submitCodeButton = document.getElementById('submit-code-button');
    const accessError = document.getElementById('access-error');

    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const showWishButton = document.getElementById('show-wish-button');
    const controlsContainer = document.querySelector('.carousel-controls');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const daysProgress = document.getElementById('days-progress');
    const hoursProgress = document.getElementById('hours-progress');
    const minutesProgress = document.getElementById('minutes-progress');
    const secondsProgress = document.getElementById('seconds-progress');
    const circleCircumference = 2 * Math.PI * 70;

    let timeCheckInterval;
    let musicSynth;
    let currentSlide = 0;

    function setupMusic() {
        if (musicSynth) return;
        musicSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'fmsine' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
        }).toDestination();
        musicSynth.volume.value = -10;
    }
    
    function playMusic() {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
        const melody = [
            { note: 'C4', duration: '8n', time: 0 }, { note: 'C4', duration: '8n', time: 0.25 }, { note: 'D4', duration: '4n', time: 0.5 }, { note: 'C4', duration: '4n', time: 1 }, { note: 'F4', duration: '4n', time: 1.5 }, { note: 'E4', duration: '2n', time: 2 },
            { note: 'C4', duration: '8n', time: 3 }, { note: 'C4', duration: '8n', time: 3.25 }, { note: 'D4', duration: '4n', time: 3.5 }, { note: 'C4', duration: '4n', time: 4 }, { note: 'G4', duration: '4n', time: 4.5 }, { note: 'F4', duration: '2n', time: 5 },
            { note: 'C4', duration: '8n', time: 6 }, { note: 'C4', duration: '8n', time: 6.25 }, { note: 'C5', duration: '4n', time: 6.5 }, { note: 'A4', duration: '4n', time: 7 }, { note: 'F4', duration: '4n', time: 7.5 }, { note: 'E4', duration: '4n', time: 8 }, { note: 'D4', duration: '2n', time: 8.5 },
            { note: 'Bb4', duration: '8n', time: 9.5 }, { note: 'Bb4', duration: '8n', time: 9.75 }, { note: 'A4', duration: '4n', time: 10 }, { note: 'F4', duration: '4n', time: 10.5 }, { note: 'G4', duration: '4n', time: 11 }, { note: 'F4', duration: '2n', time: 11.5 }
        ];
        new Tone.Part((time, value) => { musicSynth.triggerAttackRelease(value.note, value.duration, time); }, melody).start(0);
        Tone.Transport.start();
    }

    function showSlide(index) {
        const activeSlide = slides[index];
        carouselTrack.style.transform = `translateX(-${index * 100}%)`;

        const newStory = activeSlide.dataset.story || "";
        storyText.classList.add('fading');
        setTimeout(() => {
            storyText.textContent = newStory;
            storyText.classList.remove('fading');
        }, 400);

        prevButton.classList.toggle('hidden', index === 0);
        nextButton.classList.toggle('hidden', index === slides.length - 1);
        showWishButton.classList.toggle('hidden', index !== slides.length - 1);
        
        controlsContainer.classList.toggle('first-slide', index === 0);
    }

    function transitionTo(pageToShow) {
        const pages = [countdownContainer, accessCodePage, carouselPage, birthdayWishPage];
        pages.forEach(page => {
            if (page !== pageToShow) {
                page.classList.add('fade-out');
                setTimeout(() => page.classList.add('hidden'), 1500);
            }
        });
        
        setTimeout(() => {
            pageToShow.classList.remove('hidden');
            setTimeout(() => pageToShow.classList.remove('fade-out'), 50);
        }, 1000);
    }

    function showBirthdaySurprise() {
        setupMusic();
        transitionTo(accessCodePage);
    }

    submitCodeButton.addEventListener('click', () => {
        const enteredCode = accessCodeInput.value;
        if (enteredCode === ACCESS_CODE) {
            playMusic();
            currentSlide = 0;
            showSlide(currentSlide);
            transitionTo(carouselPage);
        } else {
            accessError.textContent = 'Incorrect code. Please try again.';
            accessCodeInput.value = '';
            // UPDATED: Use class for shake animation
            accessCodePage.classList.add('shake');
            setTimeout(() => accessCodePage.classList.remove('shake'), 820);
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });

    showWishButton.addEventListener('click', () => {
        transitionTo(birthdayWishPage);
    });
    
    goBackButton.addEventListener('click', () => {
        currentSlide = 0;
        showSlide(currentSlide);
        transitionTo(carouselPage);
    });

    function updateCountdown() {
        const now = new Date();
        const timeLeft = birthdayTime - now;

        if (timeLeft <= 0) {
            clearInterval(timeCheckInterval);
            showBirthdaySurprise();
            countdownContainer.classList.add('hidden', 'fade-out');
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

        const daysInYear = 365;
        const daysPercent = d / daysInYear;
        const hoursPercent = h / 24;
        const minutesPercent = m / 60;
        const secondsPercent = s / 60;

        daysProgress.style.strokeDashoffset = circleCircumference * (1 - daysPercent);
        hoursProgress.style.strokeDashoffset = circleCircumference * (1 - hoursPercent);
        minutesProgress.style.strokeDashoffset = circleCircumference * (1 - minutesPercent);
        secondsProgress.style.strokeDashoffset = circleCircumference * (1 - secondsPercent);
    }

    const heartSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f72585"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
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

    [accessCodePage, carouselPage, birthdayWishPage].forEach(page => {
        page.classList.add('hidden', 'fade-out');
    });
    countdownContainer.classList.remove('hidden', 'fade-out');

    [daysProgress, hoursProgress, minutesProgress, secondsProgress].forEach(bar => {
        bar.style.strokeDasharray = circleCircumference;
    });

    updateCountdown();
    timeCheckInterval = setInterval(updateCountdown, 1000);
});
