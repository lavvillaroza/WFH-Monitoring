let timerInterval;
let seconds = 0;

document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-button");
    const timerDisplay = document.getElementById("timer");

    function formatTime(sec) {
        const hrs = String(Math.floor(sec / 3600)).padStart(2, "0");
        const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const secs = String(sec % 60).padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    }

    playButton.addEventListener("click", () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            playButton.textContent = "▶"; // Reset button to play
        } else {
            startTimer();
            playButton.textContent = "⏸"; // Change button to pause
        }
    });
});
