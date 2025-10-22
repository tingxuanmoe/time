const targetClockElement = document.getElementById('target-clock');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const clock = document.querySelector('.clock');
const winMessage = document.getElementById('win-message');

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
    targetClockElement.textContent = `${hours}:${minutes}:${seconds}`;

    // Always keep playerHours in sync with targetTime hours unless actively dragging
    playerHours = targetTime.getHours();
    updateHourHand();

    checkWinCondition();
}


function setInitialPlayerClock() {
    const hourRotation = (playerHours % 12) * 30 + playerMinutes * 0.5;
    const minuteRotation = playerMinutes * 6;
    const secondRotation = playerSeconds * 6;

    hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
}

function updateHourHand() {
    const hourRotation = (playerHours % 12) * 30 + playerMinutes * 0.5;
    hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
}


function checkWinCondition() {
    if (
        playerHours === targetTime.getHours() &&
        playerMinutes === targetTime.getMinutes() &&
        playerSeconds === targetTime.getSeconds()
    ) {
        winMessage.classList.remove('hidden');
        clearInterval(gameInterval); // Stop the clock
        gameWon = true;
    } else {
        winMessage.classList.add('hidden');
    }
}


let isDragging = false;
let draggedHand = null;

clock.addEventListener('mousedown', (e) => {
    if (gameWon) return;
    if (e.target.id === 'minute-hand' || e.target.id === 'second-hand') {
        isDragging = true;
        draggedHand = e.target;
    }
});

window.addEventListener('mousemove', (e) => {
    if (isDragging && !gameWon) {
        const rect = clock.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Calculate angle and adjust for the top-zero position
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;

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
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        draggedHand = null;
        checkWinCondition();
    }
});

// Initial setup
setInitialPlayerClock();
gameInterval = setInterval(updateTargetClock, 1000);
updateTargetClock();
