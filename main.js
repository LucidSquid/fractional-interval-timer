const button = document.querySelector("button");
const timer = document.querySelector(".timer");
const root = document.documentElement;
const audioContext = new AudioContext();
const volume = audioContext.createGain();

let timerActive = false;
let timerInterval = 5;
const rewardsInterval = 6.25;
let timerValue;
let start;
let loopCount;

loadSavedInterval();
setTimerText(timerInterval);

timer.addEventListener("click", () => {
    let input = prompt("Enter a timer value: ");

    if (Number.isNaN(+input))
        alert(input + " is not a valid input.");
    else if (input === null || input === "")
    {}
    else if (input <= 0)
        alert("Value must be greater than 0.");
    else if (input > 1_000_000)
        alert(input + " is too large. Max value is 1,000,000.");
    else {
        setTimerInterval(+input);
        initializeTimerVars();
        resetProgressBar();
    }
    
    setTimerText(timerInterval);
});

button.addEventListener("click", () => {
    button.classList.toggle("active");

    setTimerActive();

    // Resume audio context to prevent first pop
    if (audioContext.state !== "running") {
        audioContext.resume();
    }

    if (timerActive) {
        button.innerHTML = "Stop<kbd>Space</kbd";
        initializeTimerVars();
    }
    else {
        button.innerHTML = "Start<kbd>Space</kbd";
        resetTitle();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        button.blur();
        button.click();
    }

    if (event.code === "KeyM") {
        setTimerInterval(rewardsInterval);
        initializeTimerVars();
        setTimerText(timerInterval);
        resetProgressBar();
    }
});

function setTimerInterval(value) {
    timerInterval = value;
    localStorage.setItem("savedInterval", value);
}

function loadSavedInterval() {
    if (localStorage.getItem("savedInterval"))
        setTimerInterval(+localStorage.getItem("savedInterval"));
}

function setTimerText(value) {
    timer.textContent = value.toFixed(3);
}

function setTimerActive() {
    if (button.classList.contains("active"))
        timerActive = true;
    else
        timerActive = false;
}

function initializeTimerVars() {
    start = new Date().getTime();
    timerValue = timerInterval;
    loopCount = 0;
    resetTitle();
}

function resetProgressBar() {
    root.style.setProperty("--progress-bar-percent", "0%");
}

function getLoopCount(timeElapsed) {
    return Math.floor(timeElapsed / timerInterval);
}

function playTone(seconds) {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = 440;

    volume.connect(audioContext.destination);
    oscillator.connect(volume);

    // Fade in first 0.01s to volume 0.5
    volume.gain.setValueAtTime(0, audioContext.currentTime);
    volume.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);

    // Fade out last 0.01s to volume 0
    volume.gain.setValueAtTime(0.5, audioContext.currentTime + seconds - 0.01);
    volume.gain.linearRampToValueAtTime(0, audioContext.currentTime + seconds);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + seconds);
}

function resetTitle() {
    document.title = "Fractional Interval Timer";
}

function setTitle(percent, loops, loopTimeElapsed) {
    let title = "";

    let totalBars = 8;
    let filledBars = Math.min((Math.floor(percent / (100 / totalBars)) + 1), totalBars);

    for (let i = 0; i < filledBars; i++)
        title += "■";

    for (let i = 0; i < totalBars - filledBars; i++)
        title += "□";

    document.title = title;
}

function updateTimer() {
    if (timerActive) {
        let now = new Date().getTime();
        let totalTimeElapsed = (now - start) / 1000;
        let loopTimeElapsed = totalTimeElapsed % timerInterval;
        let loopProgress = loopTimeElapsed / timerInterval;
        let loopPercent = ((loopProgress * 100) / 2).toString() + "%";

        root.style.setProperty("--progress-bar-percent", loopPercent); // 0% to max 50%

        timerValue = timerInterval - loopTimeElapsed;
        
        let currentLoopCount = getLoopCount(totalTimeElapsed);

        if (loopCount < currentLoopCount) {
            loopCount = currentLoopCount;
            playTone(0.075);
            console.log("Times looped: " + loopCount);
        }
        setTitle(loopProgress * 100, loopCount, loopTimeElapsed);

        setTimerText(timerValue);
    }
}

const getFPS = () => 
    new Promise(resolve =>
        requestAnimationFrame(t1 =>
            requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
    ));

getFPS().then(fps => {
    // 120 times per second
    if (fps > 80) {
        setInterval(function() {
            updateTimer();
        }, 8);
    }
    // 60 times per second
    else {
        setInterval(function() {
            updateTimer();
        }, 16);
    }
});
