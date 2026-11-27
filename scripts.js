const noBtn = document.querySelector('.no_button');
const yesBtn = document.querySelector('.yes_button');
const question = document.querySelector('.question');
const volumeBtn = document.querySelector('.volume_button');
const volumeSlider = document.querySelector('.volume_slider');

const NO_MESSAGE = "Yk you should choose yes";
const PADDING = 20;
const NO_BG_IMAGE = './assets/seatdepression.webp';
const MAIN_MUSIC = './assets/sonican-love-in-lofi-568502.mp3';
const SAD_MUSIC = './assets/zephiramusic-lofi-sad-612435.mp3';

const GESTURE_EVENTS = ['pointerdown', 'click', 'touchend', 'keydown'];

const ICON_BASE = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>';
const ICON_LOW = '<path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
const ICON_HIGH = '<path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>';
const ICON_MUTED = '<line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';

let yesClickCount = 0;
let noAttempts = 0;
let spacer = null;
let lastVolume = 0.5;

// Remember the No button's original inline style so it can be restored later
const originalNoStyle = noBtn.getAttribute('style');

// Preload the new background so it appears instantly when needed
const preloadedBg = new Image();
preloadedBg.src = NO_BG_IMAGE;

// Music
const music = new Audio(MAIN_MUSIC);
music.loop = true;
music.volume = lastVolume;

// Volume control
function updateVolumeUI() {
    const level = music.muted ? 0 : music.volume;
    const percent = Math.round(level * 100);
    let shapes = '';

    volumeSlider.value = percent;
    volumeSlider.style.setProperty('--fill', `${percent}%`);

    if (level === 0) {
        shapes = ICON_BASE + ICON_MUTED;
    } else if (level < 0.5) {
        shapes = ICON_BASE + ICON_LOW;
    } else {
        shapes = ICON_BASE + ICON_HIGH;
    }

    volumeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${shapes}</svg>`;
}

volumeSlider.addEventListener('input', () => {
    const value = Number(volumeSlider.value) / 100;

    music.volume = value;
    music.muted = value === 0;

    if (value > 0) {
        lastVolume = value;
    }

    updateVolumeUI();
});

volumeBtn.addEventListener('click', () => {
    if (music.muted || music.volume === 0) {
        music.muted = false;
        music.volume = lastVolume;
    } else {
        lastVolume = music.volume;
        music.muted = true;
    }

    updateVolumeUI();
});

updateVolumeUI();

function stopListeningForGesture() {
    GESTURE_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, startMusic);
    });
}

function startMusic() {
    music.play().then(() => {
        // Started successfully, so stop listening for gestures
        stopListeningForGesture();
    }).catch(() => {
        // Browser blocked it, so try again on the next gesture
    });
}

// Try to start the moment the page loads
startMusic();

// Fallback: start on the first gesture if autoplay was blocked
GESTURE_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, startMusic);
});

function switchToSadMusic() {
    // Make sure the main track can't be restarted by a late gesture
    stopListeningForGesture();

    music.pause();

    if (!SAD_MUSIC) {
        return;
    }

    music.src = SAD_MUSIC;
    music.currentTime = 0;
    music.loop = true;
    music.play().catch(() => {});
}

function resetNoButton() {
    // Remove the invisible spacer if one was created
    if (spacer) {
        spacer.remove();
        spacer = null;
    }

    // Restore the original inline style (or remove it entirely if there was none)
    if (originalNoStyle === null) {
        noBtn.removeAttribute('style');
    } else {
        noBtn.setAttribute('style', originalNoStyle);
    }
}

function hideButtons() {
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
}

function yesAction() {
    yesClickCount++;

    if (yesClickCount === 1) {
        // First Yes: ask if it was honest and make No a normal button again
        question.innerHTML = `<p>Was that an honest yes?</p>`;
        resetNoButton();
    } else {
        // Yes clicked on the "honest yes?" question (background and music stay the same)
        question.innerHTML = `<p>Really?? Wow.. well what now... (text me)</p>`;
        hideButtons();
    }
}

function noAction() {
    // No clicked on the "honest yes?" question
    question.innerHTML = `<p>Text me why you wouldn't</p>`;
    document.body.style.backgroundImage = `url("${NO_BG_IMAGE}")`;
    switchToSadMusic();
    hideButtons();
}

function moveButton(e) {
    if (yesClickCount > 0) {
        return;
    }

    if (e && e.type === 'touchstart') {
        e.preventDefault();
    }

    const rect = noBtn.getBoundingClientRect();

    if (noBtn.style.position !== 'fixed') {
        // Invisible spacer so the Yes button doesn't shift
        spacer = document.createElement('div');
        spacer.style.width = `${rect.width}px`;
        spacer.style.height = `${rect.height}px`;
        spacer.style.visibility = 'hidden';
        noBtn.parentNode.insertBefore(spacer, noBtn);

        noBtn.style.width = `${rect.width}px`;
        noBtn.style.height = `${rect.height}px`;
        noBtn.style.left = `${rect.left}px`;
        noBtn.style.top = `${rect.top}px`;
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '999';
        noBtn.style.margin = '0';
    }

    const step = 80 + Math.random() * 60;
    const angle = Math.random() * Math.PI * 2;

    const maxX = Math.max(PADDING, window.innerWidth - rect.width - PADDING);
    const maxY = Math.max(PADDING, window.innerHeight - rect.height - PADDING);

    let newX = rect.left + Math.cos(angle) * step;
    let newY = rect.top + Math.sin(angle) * step;

    // If the jump would leave the screen, go the opposite way instead
    if (newX < PADDING) {
        newX = rect.left + step;
    }
    if (newX > maxX) {
        newX = rect.left - step;
    }
    if (newY < PADDING) {
        newY = rect.top + step;
    }
    if (newY > maxY) {
        newY = rect.top - step;
    }

    newX = Math.max(PADDING, Math.min(maxX, newX));
    newY = Math.max(PADDING, Math.min(maxY, newY));

    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;

    if (noAttempts === 5) {
        alert(NO_MESSAGE);
    }
    noAttempts++;
}

function handleNoClick(e) {
    if (yesClickCount === 0) {
        moveButton(e);
    } else {
        noAction();
    }
}

noBtn.addEventListener('mouseenter', moveButton);
noBtn.addEventListener('touchstart', moveButton, { passive: false });
noBtn.addEventListener('click', handleNoClick);

yesBtn.addEventListener('click', yesAction);
