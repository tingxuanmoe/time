document.addEventListener('DOMContentLoaded', () => {
    const targetClockElement = document.getElementById('target-clock');
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    const clock = document.querySelector('.clock');
    const winMessage = document.getElementById('win-message');

    // Create clock marks
    for (let i = 0; i < 60; i++) {
        const mark = document.createElement('div');
        mark.classList.add('mark');
        if (i % 5 === 0) {
            mark.classList.add('hour-mark');
        }
        mark.style.transform = `rotate(${i * 6}deg) translateY(-145px)`;
        clock.appendChild(mark);
    }

    let targetTime = new Date();
    // Initialize player time to the current time
    let playerHours = targetTime.getHours();
    let playerMinutes = targetTime.getMinutes();
    let playerSeconds = targetTime.getSeconds();

    let gameInterval;
    let gameWon = false;

    function updateTargetClock() {
        if (gameWon) return;

        targetTime.setSeconds(targetTime.getSeconds() + 1);
        const hours = String(targetTime.getHours()).padStart(2, '0');
        const minutes = String(targetTime.getMinutes()).padStart(2, '0');
        const seconds = String(targetTime.getSeconds()).padStart(2, '0');
        if(targetClockElement) targetClockElement.textContent = `${hours}:${minutes}:${seconds}`;

        // Always keep playerHours in sync with targetTime hours unless actively dragging
        playerHours = targetTime.getHours();
        updateHourHand();

        checkWinCondition();
    }


    function setInitialPlayerClock() {
        const hourRotation = (playerHours % 12) * 30 + playerMinutes * 0.5;
        const minuteRotation = playerMinutes * 6;
        const secondRotation = playerSeconds * 6;

        if(hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
        if(minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
        if(secondHand) secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
    }

    function updateHourHand() {
        const hourRotation = (playerHours % 12) * 30 + playerMinutes * 0.5;
        if(hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
    }


    function checkWinCondition() {
        if (
            playerHours === targetTime.getHours() &&
            playerMinutes === targetTime.getMinutes() &&
            playerSeconds === targetTime.getSeconds()
        ) {
            if(winMessage) winMessage.classList.remove('hidden');
            clearInterval(gameInterval); // Stop the clock
            gameWon = true;
        } else {
            if(winMessage) winMessage.classList.add('hidden');
        }
    }


    let isDragging = false;
    let draggedHand = null;

    const getEventCoordinates = (e) => {
        if (e.touches) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };

    const startDrag = (e) => {
        if (gameWon) return;
        if (e.target.id === 'minute-hand' || e.target.id === 'second-hand') {
            isDragging = true;
            draggedHand = e.target;
        }
    };

    const drag = (e) => {
        if (isDragging && !gameWon) {
            e.preventDefault(); // Prevent scrolling on mobile
            const coords = getEventCoordinates(e);
            const rect = clock.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(coords.y - centerY, coords.x - centerX) * (180 / Math.PI) + 90;

            let degrees = (angle + 360) % 360;

            if (draggedHand.id === 'minute-hand') {
                playerMinutes = Math.floor(degrees / 6);
                minuteHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
            } else if (draggedHand.id === 'second-hand') {
                playerSeconds = Math.floor(degrees / 6);
                secondHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
            }

            playerHours = targetTime.getHours();
            updateHourHand();
            checkWinCondition();
        }
    };

    const stopDrag = () => {
        if (isDragging) {
            isDragging = false;
            draggedHand = null;
            checkWinCondition();
        }
    };

    if(clock) {
        clock.addEventListener('mousedown', startDrag);
        clock.addEventListener('touchstart', startDrag);
    }

    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    // Initial setup
    setInitialPlayerClock();
    gameInterval = setInterval(updateTargetClock, 1000);
    updateTargetClock();
});
