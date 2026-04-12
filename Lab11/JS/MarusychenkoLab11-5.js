const glitchText = document.querySelector('.glitch');
    const glitchSound = document.getElementById('glitch-sound');

    glitchText.addEventListener('mouseenter', () => {
        glitchSound.currentTime = 0; // Починати з початку
        glitchSound.play();
    });