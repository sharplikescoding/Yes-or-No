const noBtn = document.querySelector('.no_button');
const yesBtn = document.querySelector('.yes_button');

var noAttempts = 0;
const NO_MESSAGE = "Yk you should choose yes";

function yesAction(e) {
    document.write("")
    alert("Great!")
}

function moveButton(e) {
    if (e && e.type === 'touchstart') {
        e.preventDefault();
    }

    const rect = noBtn.getBoundingClientRect();

    if (noBtn.style.position !== 'fixed') {
        // Create an invisible spacer so the Yes button doesn't shift
        const spacer = document.createElement('div');
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

    let newX = rect.left + Math.cos(angle) * step;
    let newY = rect.top + Math.sin(angle) * step;

    const padding = 20;
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    if (newX < padding) { newX = rect.left + step };
    if (newX > maxX) { newX = rect.left - step };
    if (newY < padding) { newY = rect.top + step };
    if (newY > maxY) { newY = rect.top - step };

    newX = Math.max(padding, Math.min(maxX, newX));
    newY = Math.max(padding, Math.min(maxY, newY));

    void noBtn.offsetWidth;

    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;

    if (noAttempts === 5) {
        alert(NO_MESSAGE)
    }
    noAttempts++;
}

noBtn.addEventListener('mouseenter', moveButton);
noBtn.addEventListener('touchstart', moveButton, { passive: false });
noBtn.addEventListener('click', moveButton);

yesBtn.addEventListener('click', yesAction);
yesBtn.addEventListener('touchstart', yesAction);
